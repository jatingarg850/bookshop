import { NextRequest, NextResponse } from 'next/server';

// Default settings values
const DEFAULT_SETTINGS = {
  storeName: 'Radhe Stationery',
  supportEmail: 'support@radhestationery.com',
  supportPhone: '+91-XXXXXXXXXX',
  address: '',
  city: '',
  state: '',
  pincode: '',
  enableCOD: true,
  enableRazorpay: true,
  enableUPI: true,
  upiId: '',
  shippingCost: 50,
  freeShippingAbove: 500,
  gstRate: 18,
  storeAddress: '',
  storeCity: '',
  storeState: '',
  storePincode: '',
  logoUrl: '',
};

export async function GET(_req: NextRequest) {
  try {
    // Static settings (UI stabilization mode - no DB)
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error: any) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}
