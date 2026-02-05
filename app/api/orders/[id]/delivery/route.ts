import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import mongoose from 'mongoose';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const order = mongoose.Types.ObjectId.isValid(id)
      ? await Order.findById(id)
      : await Order.findOne({ _id: id });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isDelivered = order.orderStatus === 'delivered';
    const isCancelled = order.orderStatus === 'cancelled';
    const isShipped = order.orderStatus === 'shipped' || isDelivered;

    const estimatedDeliveryDate = isShipped
      ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const status = isCancelled
      ? 'cancelled'
      : isDelivered
        ? 'delivered'
        : isShipped
          ? 'in_transit'
          : 'pending';

    const location = isCancelled
      ? 'Cancelled'
      : isDelivered
        ? 'Delivered'
        : isShipped
          ? 'In Transit'
          : 'Processing';

    const notes = isCancelled
      ? 'Order has been cancelled.'
      : isDelivered
        ? 'Delivered successfully.'
        : isShipped
          ? 'Shipment is in transit.'
          : 'Tracking will be available once the order is shipped.';

    const delivery = {
      orderId: order._id,
      trackingNumber: isShipped ? `TRK-${String(order._id).slice(-6).toUpperCase()}` : null,
      carrier: isShipped ? 'Standard Delivery' : null,
      estimatedDeliveryDate,
      status,
      location,
      actualDeliveryDate: isDelivered ? order.updatedAt : null,
      notes,
    };

    return NextResponse.json({ delivery });
  } catch (error: any) {
    console.error('Delivery fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery' },
      { status: 500 }
    );
  }
}
