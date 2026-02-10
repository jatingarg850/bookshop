import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';
import { connectDB } from '@/lib/db/connect';
import Settings from '@/lib/db/models/Settings';

/**
 * Test which pincodes are serviceable
 * GET /api/shiprocket/test-pincodes?pincodes=110001,201310,203201
 */
export async function GET(req: NextRequest) {
  try {
    const pincodes = req.nextUrl.searchParams.get('pincodes')?.split(',') || [];

    if (pincodes.length === 0) {
      return NextResponse.json(
        { error: 'Please provide pincodes parameter: ?pincodes=110001,201310,203201' },
        { status: 400 }
      );
    }

    // Fetch store pincode from settings
    await connectDB();
    let storePincode = '121006';
    try {
      const settings = await Settings.findOne({});
      if (settings?.storePincode) {
        storePincode = settings.storePincode;
      }
    } catch (error) {
      console.warn('Failed to fetch store pincode, using default:', error);
    }

    const client = await getShiprocketClient();
    const results = [];

    for (const pincode of pincodes) {
      try {
        const rates = await client.getShippingRates({
          pickup_postcode: storePincode,
          delivery_postcode: pincode.trim(),
          weight: 0.5,
          cod: 0,
        });

        if (rates.rates && rates.rates.length > 0) {
          results.push({
            pincode: pincode.trim(),
            serviceable: true,
            couriers: rates.rates.map(r => ({
              name: r.courier_name,
              rate: r.rate,
              etd: r.etd,
            })),
          });
        } else {
          results.push({
            pincode: pincode.trim(),
            serviceable: false,
            couriers: [],
          });
        }
      } catch (error: any) {
        results.push({
          pincode: pincode.trim(),
          serviceable: false,
          error: error.response?.status === 404 ? '404 Not Found' : error.message,
        });
      }
    }

    const serviceable = results.filter(r => r.serviceable);
    const notServiceable = results.filter(r => !r.serviceable);

    return NextResponse.json({
      storePincode,
      tested: pincodes.length,
      serviceable: serviceable.length,
      notServiceable: notServiceable.length,
      results,
      serviceableList: serviceable.map(r => r.pincode),
      notServiceableList: notServiceable.map(r => r.pincode),
    });
  } catch (error: any) {
    console.error('Pincode test error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test pincodes' },
      { status: 500 }
    );
  }
}
