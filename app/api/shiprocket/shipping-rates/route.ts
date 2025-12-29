import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

export async function POST(req: NextRequest) {
  try {
    const { pickup_postcode, delivery_postcode, weight, cod } = await req.json();

    if (!pickup_postcode || !delivery_postcode || !weight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();
    const rates = await client.getShippingRates({
      pickup_postcode,
      delivery_postcode,
      weight,
      cod: cod ? 1 : 0,
    });

    return NextResponse.json(rates);
  } catch (error: any) {
    console.error('Shipping rates error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping rates' },
      { status: 500 }
    );
  }
}
