import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/utils/razorpay';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import Delivery from '@/lib/db/models/Delivery';
import { getShiprocketClient, OrderCreateRequest } from '@/lib/utils/shiprocket';
import { calculateOrderWeight } from '@/lib/utils/shippingCalculator';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    await connectDB();

    // Find and update order
    const order = await Order.findById(
      mongoose.Types.ObjectId.isValid(orderId) ? orderId : null
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update payment details
    order.payment.status = 'paid';
    order.payment.razorpayOrderId = razorpayOrderId;
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.orderStatus = 'confirmed';

    await order.save();

    // Automatically create Shiprocket order and ship it
    try {
      console.log('🚀 Automatically creating Shiprocket order for orderId:', orderId);
      
      const client = await getShiprocketClient();

      // Calculate weight
      let weight = order.totalWeight || calculateOrderWeight(order.items);
      if (!weight || weight <= 0) {
        weight = 0.5;
      }

      // Prepare Shiprocket order
      const shiprocketOrder: OrderCreateRequest = {
        order_id: order._id.toString(),
        order_date: new Date(order.createdAt).toISOString().split('T')[0],
        pickup_location_id: parseInt(process.env.SHIPROCKET_PICKUP_LOCATION_ID || '1'),
        billing_customer_name: order.shippingDetails.name,
        billing_last_name: order.shippingDetails.name.split(' ').slice(1).join(' ') || 'Customer',
        billing_email: order.shippingDetails.email,
        billing_phone: order.shippingDetails.phone,
        billing_address: order.shippingDetails.address,
        billing_city: order.shippingDetails.city,
        billing_state: order.shippingDetails.state,
        billing_postcode: String(order.shippingDetails.pincode).trim(),
        billing_country: 'India',
        shipping_is_billing: true,
        order_items: order.items.map((item: any) => ({
          name: item.name,
          sku: item.sku || 'N/A',
          units: item.quantity,
          selling_price: item.priceAtPurchase,
        })),
        payment_method: 'Prepaid',
        sub_total: order.subtotal,
        weight,
        length: 10,
        breadth: 10,
        height: 10,
      };

      // Create order in Shiprocket
      const createResponse = await client.createOrder(shiprocketOrder);

      if (createResponse.status_code !== 1) {
        console.error('Failed to create Shiprocket order:', createResponse);
        // Don't fail the payment verification, just log the error
      } else {
        console.log('✓ Shiprocket order created:', {
          shiprocketOrderId: createResponse.order_id,
          shipmentId: createResponse.shipment_id,
        });

        // Update order with Shiprocket details
        order.shiprocketOrderId = createResponse.order_id;
        order.shiprocketShipmentId = createResponse.shipment_id;
        await order.save();

        // Get available couriers and ship with the cheapest one
        try {
          const ratesResponse = await client.getShippingRates({
            pickup_postcode: process.env.NEXT_PUBLIC_STORE_PINCODE || '121006',
            delivery_postcode: order.shippingDetails.pincode,
            weight,
            cod: 0,
          });

          if (ratesResponse.rates && ratesResponse.rates.length > 0) {
            // Get the first available courier (usually cheapest)
            const selectedCourier = ratesResponse.rates[0];
            const courierId = selectedCourier.courier_company_id;

            console.log('📦 Shipping with courier:', selectedCourier.courier_name);

            // Ship the order
            const shipResponse = await client.shipOrder({
              shipment_id: createResponse.shipment_id,
              courier_id: courierId,
            });

            if (shipResponse.status_code === 1) {
              console.log('✓ Order shipped successfully:', {
                awb: shipResponse.awb_code,
                courier: shipResponse.courier_name,
              });

              // Update order with shipping details
              order.orderStatus = 'shipped';
              order.shiprocketAWB = shipResponse.awb_code;
              order.shiprocketCourier = shipResponse.courier_name;
              await order.save();

              // Update or create delivery record
              let delivery = await Delivery.findOne({ orderId: order._id.toString() });

              if (!delivery) {
                const estimatedDeliveryDate = new Date();
                estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

                delivery = await Delivery.create({
                  orderId: order._id.toString(),
                  trackingNumber: shipResponse.awb_code,
                  carrier: shipResponse.courier_name,
                  estimatedDeliveryDate,
                  status: 'picked_up',
                  location: 'Processing',
                  notes: `Shipped via ${shipResponse.courier_name}`,
                  shiprocketAWB: shipResponse.awb_code,
                });
              } else {
                delivery.trackingNumber = shipResponse.awb_code;
                delivery.carrier = shipResponse.courier_name;
                delivery.status = 'picked_up';
                delivery.shiprocketAWB = shipResponse.awb_code;
                await delivery.save();
              }
            } else {
              console.error('Failed to ship order:', shipResponse);
            }
          } else {
            console.warn('No shipping rates available for this pincode');
          }
        } catch (shippingError: any) {
          console.error('Error getting shipping rates or shipping order:', shippingError.message);
          // Don't fail the payment verification
        }
      }
    } catch (shiprocketError: any) {
      console.error('Error creating Shiprocket order:', shiprocketError.message);
      // Don't fail the payment verification if Shiprocket fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
