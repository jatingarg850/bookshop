import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get the first order that hasn't been shipped yet
    const order = await Order.findOne({ shiprocketOrderId: { $exists: false } }).sort({ createdAt: -1 });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'No unshipped orders found. Please create an order first.',
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderDetails: {
        items: order.items.length,
        total: order.totalAmount,
        shipping: order.shippingDetails,
        payment: order.payment.method,
      },
      message: 'Found unshipped order. Use this orderId to test order creation.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
