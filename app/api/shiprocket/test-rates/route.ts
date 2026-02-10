import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

/**
 * Test endpoint to check shipping rates for different pincode combinations
 * Usage: POST /api/shiprocket/test-rates
 * Body: { pickup_postcode, delivery_postcode, weight }
 */
export async function POST(req: NextRequest) {
  try {
    const { pickup_postcode, delivery_postcode, weight = 1.0 } = await req.json();

    if (!pickup_postcode || !delivery_postcode) {
      return NextResponse.json(
        { error: 'pickup_postcode and delivery_postcode are required' },
        { status: 400 }
      );
    }

    console.log('Testing shipping rates:', {
      pickup_postcode,
      delivery_postcode,
      weight,
    });

    const client = await getShiprocketClient();
    
    try {
      const rates = await client.getShippingRates({
        pickup_postcode,
        delivery_postcode,
        weight,
        cod: 0,
      });

      return NextResponse.json({
        success: true,
        pickup_postcode,
        delivery_postcode,
        weight,
        rates: rates.rates || [],
        message: rates.rates && rates.rates.length > 0 
          ? `Found ${rates.rates.length} courier options`
          : 'No couriers available for this route',
      });
    } catch (shiprocketError: any) {
      return NextResponse.json({
        success: false,
        pickup_postcode,
        delivery_postcode,
        weight,
        error: shiprocketError.response?.data?.message || shiprocketError.message,
        status: shiprocketError.response?.status,
        message: shiprocketError.response?.status === 404 
          ? 'This route is not serviceable by Shiprocket'
          : 'Failed to fetch shipping rates',
      }, { status: shiprocketError.response?.status || 500 });
    }
  } catch (error: any) {
    console.error('Test rates error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
