import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketClient } from '@/lib/utils/shiprocket';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing Shiprocket credentials...');
    
    const client = await getShiprocketClient();
    
    return NextResponse.json({
      success: true,
      message: 'Shiprocket credentials are valid and authentication successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Shiprocket test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to authenticate with Shiprocket',
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}
