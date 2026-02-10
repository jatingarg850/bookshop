import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';
import { MOCK_SHIPPING_RATES, isMockMode } from '@/lib/utils/shiprocket-mock';
import { connectDB } from '@/lib/db/connect';
import Settings from '@/lib/db/models/Settings';

/**
 * Check if a pincode is serviceable by Shiprocket
 * This is called BEFORE checkout to validate the delivery location
 */
export async function POST(req: NextRequest) {
  try {
    const { delivery_pincode } = await req.json();

    if (!delivery_pincode) {
      return NextResponse.json(
        { error: 'Delivery pincode is required' },
        { status: 400 }
      );
    }

    // Check if mock mode is enabled
    if (isMockMode()) {
      console.log('📦 Using MOCK serviceability check (SHIPROCKET_MOCK_MODE=true)');
      return NextResponse.json({
        serviceable: true,
        message: 'Pincode is serviceable (Mock)',
        rates: MOCK_SHIPPING_RATES.rates,
      });
    }

    // Fetch store pincode from settings
    await connectDB();
    let storePincode = '121006'; // Default fallback
    try {
      const settings = await Settings.findOne({});
      if (settings?.storePincode) {
        storePincode = settings.storePincode;
      }
    } catch (error) {
      console.warn('Failed to fetch store pincode from settings, using default:', error);
    }

    // Try to get shipping rates - if successful, pincode is serviceable
    const client = await getShiprocketClient();
    
    try {
      const rates = await client.getShippingRates({
        pickup_postcode: storePincode,
        delivery_postcode: delivery_pincode,
        weight: 0.5, // Use minimum weight for serviceability check
        cod: 0,
      });

      if (rates.rates && rates.rates.length > 0) {
        return NextResponse.json({
          serviceable: true,
          message: 'Pincode is serviceable',
          rates: rates.rates,
        });
      } else {
        return NextResponse.json({
          serviceable: false,
          message: 'No shipping routes available for this pincode',
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return NextResponse.json({
          serviceable: false,
          message: `Pincode ${delivery_pincode} is not serviceable from ${storePincode}. Please try another location.`,
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Serviceability check error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to check serviceability',
        serviceable: false,
      },
      { status: 500 }
    );
  }
}
