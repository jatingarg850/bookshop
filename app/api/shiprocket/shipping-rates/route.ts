import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';
import { MOCK_SHIPPING_RATES, isMockMode } from '@/lib/utils/shiprocket-mock';

export async function POST(req: NextRequest) {
  let pickup_postcode: string;
  let delivery_postcode: string;
  
  try {
    const data = await req.json();
    pickup_postcode = data.pickup_postcode;
    delivery_postcode = data.delivery_postcode;
    const { weight, cod, length, breadth, height, declared_value } = data;

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

    // Check if mock mode is enabled
    if (isMockMode()) {
      console.log('📦 Using MOCK shipping rates (SHIPROCKET_MOCK_MODE=true)');
      return NextResponse.json(MOCK_SHIPPING_RATES);
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

    // Handle specific error cases
    let errorMessage = error.message || 'Failed to fetch shipping rates';
    
    if (error.response?.status === 404) {
      errorMessage = `No shipping routes available from pincode ${pickup_postcode} to ${delivery_postcode}. This route may not be serviceable by Shiprocket. Please verify both pincodes are valid and serviceable. Contact support if you believe this is an error.`;
    } else if (error.response?.status === 401) {
      errorMessage = 'Shiprocket authentication failed. Please check your credentials in .env file.';
    } else if (error.response?.status === 400) {
      errorMessage = `Invalid request parameters. Weight: ${weight}kg, Pickup: ${pickup_postcode}, Delivery: ${delivery_postcode}. ${error.response?.data?.message || ''}`;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.response?.data?.errors || null,
        shiprocketStatus: error.response?.status,
      },
      { status: error.response?.status || 500 }
    );
  }
}
