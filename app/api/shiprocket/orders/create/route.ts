import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import { getShiprocketClient, OrderCreateRequest } from '@/lib/utils/shiprocket';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if already shipped
    if (order.shiprocketOrderId) {
      return NextResponse.json(
        { error: 'Order already shipped with Shiprocket' },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();

    // Prepare order creation request
    const shiprocketOrder: OrderCreateRequest = {
      order_id: order._id.toString(),
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location_id: parseInt(process.env.SHIPROCKET_PICKUP_LOCATION_ID || '1'),
      billing_customer_name: order.shippingDetails.name,
      billing_email: order.shippingDetails.email,
      billing_phone: order.shippingDetails.phone,
      billing_address: order.shippingDetails.address,
      billing_city: order.shippingDetails.city,
      billing_state: order.shippingDetails.state,
      billing_postcode: order.shippingDetails.pincode,
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
      weight: calculateWeight(order.items),
    };

    // Create order in Shiprocket
    const response = await client.createOrder(shiprocketOrder);

    if (response.status_code !== 1) {
      return NextResponse.json(
        { error: response.message || 'Failed to create Shiprocket order' },
        { status: 400 }
      );
    }

    // Update order with Shiprocket details
    order.shiprocketOrderId = response.order_id;
    order.shiprocketShipmentId = response.shipment_id;
    await order.save();

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

function calculateWeight(items: any[]): number {
  // Default weight per item in kg (adjust based on your products)
  const defaultWeightPerItem = 0.5;
  return items.reduce((total, item) => total + item.quantity * defaultWeightPerItem, 0);
}
