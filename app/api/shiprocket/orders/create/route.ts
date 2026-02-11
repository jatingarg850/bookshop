import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import { getShiprocketClient, OrderCreateRequest } from '@/lib/utils/shiprocket';
import { calculateOrderWeight } from '@/lib/utils/shippingCalculator';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating Shiprocket order for orderId:', orderId);

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Order found:', {
      _id: order._id,
      items: order.items.length,
      totalWeight: order.totalWeight,
      shippingDetails: order.shippingDetails,
      itemsWithWeight: order.items.map((i: any) => ({
        name: i.name,
        weight: i.weight,
        weightUnit: i.weightUnit,
        quantity: i.quantity,
      })),
      rawItems: JSON.stringify(order.items, null, 2),
    });

    // Check if already shipped
    if (order.shiprocketOrderId) {
      console.warn('Order already shipped:', order.shiprocketOrderId);
      return NextResponse.json(
        { error: 'Order already shipped with Shiprocket' },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();

    // Calculate weight - use stored totalWeight if available, otherwise calculate
    let weight = order.totalWeight || calculateOrderWeight(order.items);
    
    // Validate weight
    if (!weight || weight <= 0) {
      console.warn('Invalid weight calculated, using minimum 0.5kg:', {
        orderId: order._id,
        storedWeight: order.totalWeight,
        calculatedWeight: calculateOrderWeight(order.items),
      });
      weight = 0.5;
    }

    console.log('Shiprocket order weight:', {
      orderId: order._id,
      storedTotalWeight: order.totalWeight,
      calculatedWeight: calculateOrderWeight(order.items),
      finalWeight: weight,
    });

    // Prepare order creation request
    const shiprocketOrder: OrderCreateRequest = {
      order_id: order._id.toString(),
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location_id: parseInt(process.env.SHIPROCKET_PICKUP_LOCATION_ID || '1'),
      billing_customer_name: order.shippingDetails.name,
      billing_last_name: order.shippingDetails.name.split(' ').slice(1).join(' ') || 'Customer', // Extract last name or use default
      billing_email: order.shippingDetails.email,
      billing_phone: order.shippingDetails.phone,
      billing_address: order.shippingDetails.address,
      billing_city: order.shippingDetails.city,
      billing_state: order.shippingDetails.state,
      billing_postcode: String(order.shippingDetails.pincode).trim(), // Ensure it's a string, no padding
      billing_country: 'India',
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku || 'N/A',
        units: item.quantity,
        selling_price: item.priceAtPurchase,
      })),
      payment_method: order.payment.method === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal,
      weight,
      // Add default dimensions (required by Shiprocket)
      length: 10,
      breadth: 10,
      height: 10,
    };

    console.log('Shiprocket order payload:', JSON.stringify(shiprocketOrder, null, 2));

    // Create order in Shiprocket
    const response = await client.createOrder(shiprocketOrder);

    console.log('Shiprocket response:', response);

    if (response.status_code !== 1) {
      console.error('Shiprocket error:', response);
      return NextResponse.json(
        { error: response.message || 'Failed to create Shiprocket order' },
        { status: 400 }
      );
    }

    // Update order with Shiprocket details
    order.shiprocketOrderId = response.order_id;
    order.shiprocketShipmentId = response.shipment_id;
    await order.save();

    console.log('Order updated with Shiprocket IDs:', {
      shiprocketOrderId: response.order_id,
      shiprocketShipmentId: response.shipment_id,
    });

    return NextResponse.json({
      success: true,
      shiprocketOrderId: response.order_id,
      shipmentId: response.shipment_id,
      message: 'Order created in Shiprocket successfully',
    });
  } catch (error: any) {
    console.error('Shiprocket order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Shiprocket order' },
      { status: 500 }
    );
  }
}
