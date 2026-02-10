import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Settings from '@/lib/db/models/Settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

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
  storePincode: process.env.NEXT_PUBLIC_STORE_PINCODE || '121006',
  logoUrl: '',
};

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const user: any = session?.user;
  if (!user) return null;

  const legacyAdminEmail = process.env.ADMIN_EMAIL;
  if (user.role === 'admin') return session;
  if (legacyAdminEmail && user.email && user.email === legacyAdminEmail) return session;
  return null;
}

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const settings = await Settings.findOne({});
    
    if (settings) {
      return NextResponse.json(settings.toObject());
    }
    
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error: any) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }

    await settings.save();
    return NextResponse.json(settings.toObject());
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
