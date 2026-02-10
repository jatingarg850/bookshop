import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { checkoutSchema } from '@/lib/validations/checkout';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import mongoose from 'mongoose';
import Order from '@/lib/db/models/Order';
import Delivery from '@/lib/db/models/Delivery';
import Settings from '@/lib/db/models/Settings';
import { calculateOrderWeight } from '@/lib/utils/shippingCalculator';
import { getShiprocketClient, OrderCreateRequest } from '@/lib/utils/shiprocket';

const DEFAULT_SETTINGS = {
  shippingCost: 50,
  freeShippingAbove: 500,
  gstRate: 18,
};

async function createShiprocketOrder(order: any) {
  try {
    console.log('🚀 Creating Shiprocket order for orderId:', order._id);
    
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
      payment_method: order.payment.method === 'cod' ? 'COD' : 'Prepaid',
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
      return null;
    }

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
        cod: order.payment.method === 'cod' ? 1 : 0,
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

          return { success: true, awb: shipResponse.awb_code };
        } else {
          console.error('Failed to ship order:', shipResponse);
          return null;
        }
      } else {
        console.warn('No shipping rates available for this pincode');
        return null;
      }
    } catch (shippingError: any) {
      console.error('Error getting shipping rates or shipping order:', shippingError.message);
      return null;
    }
  } catch (shiprocketError: any) {
    console.error('Error creating Shiprocket order:', shiprocketError.message);
    return null;
  }
}
        selling_price: item.priceAtPurchase,
      })),
      payment_method: order.payment.method === 'cod' ? 'COD' : 'Prepaid',
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
      return null;
    }

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
        cod: order.payment.method === 'cod' ? 1 : 0,
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

          return { success: true, awb: shipResponse.awb_code };
        } else {
          console.error('Failed to ship order:', shipResponse);
          return null;
        }
      } else {
        console.warn('No shipping rates available for this pincode');
        return null;
      }
    } catch (shippingError: any) {
      console.error('Error getting shipping rates or shipping order:', shippingError.message);
      return null;
    }
  } catch (shiprocketError: any) {
    console.error('Error creating Shiprocket order:', shiprocketError.message);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping, paymentMethod } = body;

    const validatedShipping = checkoutSchema.parse({
      shipping,
      paymentMethod,
    });

    await connectDB();

    // Fetch settings from database
    let settings = DEFAULT_SETTINGS;
    try {
      const dbSettings = await Settings.findOne({});
      if (dbSettings) {
        settings = {
          shippingCost: dbSettings.shippingCost || DEFAULT_SETTINGS.shippingCost,
          freeShippingAbove: dbSettings.freeShippingAbove || DEFAULT_SETTINGS.freeShippingAbove,
          gstRate: dbSettings.gstRate || DEFAULT_SETTINGS.gstRate,
        };
      }
    } catch (error) {
      console.warn('Failed to fetch settings from DB, using defaults:', error);
    }

    const globalTaxRate = settings.gstRate;
    const shippingThreshold = settings.freeShippingAbove;
    const defaultShippingCost = settings.shippingCost;

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    const findProduct = async (productId: string) => {
      if (!productId) return null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        return Product.findOne({ _id: productId, status: 'active' }).lean();
      }
      return (
        (await Product.findOne({ externalId: productId, status: 'active' }).lean()) ||
        (await Product.findOne({ slug: productId, status: 'active' }).lean())
      );
    };

    for (const item of items) {
      const product = await findProduct(String(item.productId));
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      console.log('Product fetched:', {
        productId: item.productId,
        name: (product as any).name,
        weight: (product as any).weight,
        weightUnit: (product as any).weightUnit,
      });

      if (typeof (product as any).stock === 'number' && (product as any).stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${(product as any).name}` },
          { status: 400 }
        );
      }

      const price = (product as any).discountPrice || (product as any).price;
      subtotal += price * item.quantity;

      const orderItem = {
        productId: String((product as any)._id ?? (product as any).id),
        name: (product as any).name,
        sku: (product as any).sku,
        priceAtPurchase: price,
        quantity: item.quantity,
        weight: (product as any).weight,
        weightUnit: (product as any).weightUnit,
        dimensions: (product as any).dimensions,
        cgst: (product as any).cgst,
        sgst: (product as any).sgst,
        igst: (product as any).igst,
        image: (product as any).images?.[0]?.url || item.image,
        slug: (product as any).slug,
      };

      console.log('Order item created:', {
        name: orderItem.name,
        weight: orderItem.weight,
        weightUnit: orderItem.weightUnit,
        quantity: orderItem.quantity,
      });

      orderItems.push(orderItem);
    }

    const shippingCost = subtotal > shippingThreshold ? 0 : defaultShippingCost;
    const tax = Math.round(((subtotal * globalTaxRate) / 100) * 100) / 100;
    const cgst = Math.round((tax / 2) * 100) / 100;
    const sgst = Math.round((tax / 2) * 100) / 100;
    const igst = 0;
    const totalAmount = subtotal + shippingCost + tax;

    // Calculate total weight BEFORE creating order
    const totalWeight = calculateOrderWeight(orderItems);

    console.log('Order creation - Weight calculation DEBUG:', {
      itemsCount: orderItems.length,
      totalWeight,
      itemsDetail: orderItems.map(i => ({
        name: i.name,
        weight: i.weight,
        weightUnit: i.weightUnit,
        quantity: i.quantity,
        effectiveWeight: i.weight ? (i.weight / 1000) : 0, // Convert g to kg
      })),
    });

    const session = await getServerSession(authOptions);
    const userId =
      session?.user && mongoose.Types.ObjectId.isValid((session.user as any).id)
        ? new mongoose.Types.ObjectId((session.user as any).id)
        : undefined;

    const paymentStatus = validatedShipping.paymentMethod === 'razorpay' ? 'pending' : 'paid';
    
    console.log('Creating order with items:', {
      itemsCount: orderItems.length,
      totalWeight,
      itemsToSave: JSON.stringify(orderItems.map((item) => ({
        ...item,
        productId: mongoose.Types.ObjectId.isValid(item.productId)
          ? new mongoose.Types.ObjectId(item.productId)
          : item.productId,
      })), null, 2),
    });

    const order = await Order.create({
      userId,
      userEmail: session?.user?.email || undefined,
      guestEmail: !session ? validatedShipping.shipping.email : undefined,
      items: orderItems.map((item) => ({
        ...item,
        productId: mongoose.Types.ObjectId.isValid(item.productId)
          ? new mongoose.Types.ObjectId(item.productId)
          : item.productId,
      })),
      shippingDetails: validatedShipping.shipping,
      payment: {
        method: validatedShipping.paymentMethod as any,
        status: paymentStatus as any,
      },
      orderStatus: validatedShipping.paymentMethod === 'razorpay' ? 'pending' : 'confirmed',
      subtotal,
      shippingCost,
      tax,
      cgst,
      sgst,
      igst,
      discount: 0,
      totalAmount,
      totalWeight,
    });

    console.log('Order created successfully:', {
      orderId: order._id,
      totalWeight: order.totalWeight,
      itemsCount: order.items.length,
      itemsInDB: order.items.map(i => ({
        name: i.name,
        weight: i.weight,
        weightUnit: i.weightUnit,
        quantity: i.quantity,
      })),
    });

    // Create delivery record immediately on order creation
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5); // Default 5 days

    const delivery = await Delivery.create({
      orderId: order._id.toString(),
      trackingNumber: `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
      carrier: 'Pending',
      estimatedDeliveryDate,
      status: 'pending',
      location: validatedShipping.shipping.city,
      notes: 'Order placed, awaiting shipment',
    });

    // For COD orders, automatically create Shiprocket order
    if (validatedShipping.paymentMethod === 'cod') {
      console.log('📦 COD order detected, automatically creating Shiprocket order...');
      await createShiprocketOrder(order);
    }

    return NextResponse.json({
      orderId: order._id.toString(),
      deliveryId: delivery._id.toString(),
      totalAmount,
      shippingCost,
      tax,
      subtotal,
      totalWeight,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}

    const delivery = await Delivery.create({
      orderId: order._id.toString(),
      trackingNumber: `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
      carrier: 'Pending',
      estimatedDeliveryDate,
      status: 'pending',
      location: validatedShipping.shipping.city,
      notes: 'Order placed, awaiting shipment',
    });

    return NextResponse.json({
      orderId: order._id.toString(),
      deliveryId: delivery._id.toString(),
      totalAmount,
      shippingCost,
      tax,
      subtotal,
      totalWeight,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
