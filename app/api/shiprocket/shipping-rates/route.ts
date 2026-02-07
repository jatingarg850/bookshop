import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

export async function POST(req: NextRequest) {
  try {
    const { pickup_postcode, delivery_postcode, weight, cod, length, breadth, height, declared_value } = await req.json();

    // Validation with detailed logs
    console.log('Shipping Rates Request:', {
      pickup_postcode,
      delivery_postcode,
      weight,
      cod,
      length,
      breadth,
      height,
      declared_value,
    });

    if (!pickup_postcode || !delivery_postcode || !weight) {
      const missingFields = [];
      if (!pickup_postcode) missingFields.push('pickup_postcode');
      if (!delivery_postcode) missingFields.push('delivery_postcode');
      if (!weight) missingFields.push('weight');
      
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error(errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    if (weight <= 0) {
      const errorMsg = `Invalid weight: ${weight}. Must be greater than 0.`;
      console.error(errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    const client = await getShiprocketClient();
    console.log('Authenticated with Shiprocket');
    
    const rateRequest = {
      pickup_postcode,
      delivery_postcode,
      weight,
      cod: cod ? 1 : 0,
      ...(length && breadth && height && { length, breadth, height }),
      ...(declared_value && { declared_value }),
    };

    console.log('Sending to Shiprocket API:', rateRequest);
    const rates = await client.getShippingRates(rateRequest);
    
    console.log('Shiprocket Response:', rates);
    
    if (!rates.rates || rates.rates.length === 0) {
      console.warn('No shipping rates available for this route');
      return NextResponse.json({
        rates: [],
        warning: 'No shipping rates available for the requested pincode combination'
      });
    }

    return NextResponse.json(rates);
  } catch (error: any) {
    console.error('Shipping rates error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config?.url,
    });
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.message || 'Failed to fetch shipping rates',
        details: error.response?.data?.errors || null,
      },
      { status: error.response?.status || 500 }
    );
  }
}
