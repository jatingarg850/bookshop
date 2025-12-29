import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Delivery from '@/lib/db/models/Delivery';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const awb = searchParams.get('awb');

    if (!awb) {
      return NextResponse.json(
        { error: 'AWB is required' },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();
    const tracking = await client.trackOrder(awb);

    await connectDB();

    // Update delivery status
    const delivery = await Delivery.findOne({ trackingNumber: awb });
    if (delivery && tracking.tracking_data) {
      const statusMap: { [key: string]: string } = {
        'MANIFEST GENERATED': 'pending',
        'PICKED UP': 'picked_up',
        'IN TRANSIT': 'in_transit',
        'OUT FOR DELIVERY': 'out_for_delivery',
        'DELIVERED': 'delivered',
        'FAILED': 'failed',
      };

      const newStatus = statusMap[tracking.tracking_data.shipment_status] || delivery.status;
      delivery.status = newStatus;
      delivery.location = tracking.tracking_data.scans?.[0]?.location || delivery.location;
      delivery.notes = tracking.tracking_data.current_status;
      await delivery.save();
    }

    return NextResponse.json({
      tracking: tracking.tracking_data,
      updated: true,
    });
  } catch (error: any) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track order' },
      { status: 500 }
    );
  }
}
