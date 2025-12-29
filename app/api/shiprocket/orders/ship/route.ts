import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import Delivery from '@/lib/db/models/Delivery';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

export async function POST(req: NextRequest) {
  try {
    const { orderId, courierId } = await req.json();

    if (!orderId || !courierId) {
      return NextResponse.json(
        { error: 'Order ID and Courier ID are required' },
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

    if (!order.shiprocketShipmentId) {
      return NextResponse.json(
        { error: 'Order not created in Shiprocket yet' },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();

    // Assign courier and generate AWB
    const response = await client.shipOrder({
      shipment_id: order.shiprocketShipmentId,
      courier_id: courierId,
    });

    if (response.status_code !== 1) {
      return NextResponse.json(
        { error: response.message || 'Failed to assign courier' },
        { status: 400 }
      );
    }

    // Update order status
    order.orderStatus = 'shipped';
    order.shiprocketAWB = response.awb_code;
    order.shiprocketCourier = response.courier_name;
    await order.save();

    // Update or create delivery record
    let delivery = await Delivery.findOne({ orderId: order._id.toString() });

    if (!delivery) {
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

      delivery = await Delivery.create({
        orderId: order._id.toString(),
        trackingNumber: response.awb_code,
        carrier: response.courier_name,
        estimatedDeliveryDate,
        status: 'picked_up',
        location: 'Processing',
        notes: `Shipped via ${response.courier_name}`,
        shiprocketAWB: response.awb_code,
      });
    } else {
      delivery.trackingNumber = response.awb_code;
      delivery.carrier = response.courier_name;
      delivery.status = 'picked_up';
      delivery.shiprocketAWB = response.awb_code;
      await delivery.save();
    }

    return NextResponse.json({
      success: true,
      awb: response.awb_code,
      courier: response.courier_name,
      message: 'Order shipped successfully',
    });
  } catch (error: any) {
    console.error('Shiprocket ship order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to ship order' },
      { status: 500 }
    );
  }
}
