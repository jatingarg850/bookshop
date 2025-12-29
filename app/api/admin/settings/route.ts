import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null;
  }
  return session;
}

// Default settings values
const DEFAULT_SETTINGS = {
  storeName: 'Radhe Stationery',
  supportEmail: 'support@radhestationery.com',
  supportPhone: '+91-XXXXXXXXXX',
  address: '',
  city: '',
  state: '',
  pincode: '',
  enableCOD: false,
  enableRazorpay: true,
  shippingCost: 50,
  freeShippingAbove: 500,
  gstRate: 18,
  storeAddress: '',
  storeCity: '',
  storeState: '',
  storePincode: '',
  logoUrl: '',
  weightBasedRates: [],
  dimensionBasedRates: [],
};

export async function GET(_req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // Use native MongoDB driver to bypass Mongoose caching
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const collection = db.collection('settings');
    
    let settings = await collection.findOne({});

    if (!settings) {
      const result = await collection.insertOne({
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      settings = await collection.findOne({ _id: result.insertedId });
    }

    console.log('Admin settings fetched:', {
      enableRazorpay: settings?.enableRazorpay,
      enableCOD: settings?.enableCOD,
      gstRate: settings?.gstRate,
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('Settings update request:', body);

    await connectDB();

    // Use native MongoDB driver to bypass Mongoose caching
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const collection = db.collection('settings');
    
    // Build the complete settings object with all fields
    const newSettings = {
      storeName: body.storeName || DEFAULT_SETTINGS.storeName,
      supportEmail: body.supportEmail || DEFAULT_SETTINGS.supportEmail,
      supportPhone: body.supportPhone || DEFAULT_SETTINGS.supportPhone,
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      pincode: body.pincode || '',
      enableCOD: body.enableCOD ?? DEFAULT_SETTINGS.enableCOD,
      enableRazorpay: body.enableRazorpay ?? DEFAULT_SETTINGS.enableRazorpay,
      shippingCost: body.shippingCost ?? DEFAULT_SETTINGS.shippingCost,
      freeShippingAbove: body.freeShippingAbove ?? DEFAULT_SETTINGS.freeShippingAbove,
      gstRate: body.gstRate ?? DEFAULT_SETTINGS.gstRate,
      storeAddress: body.storeAddress || '',
      storeCity: body.storeCity || '',
      storeState: body.storeState || '',
      storePincode: body.storePincode || '',
      logoUrl: body.logoUrl || '',
      weightBasedRates: body.weightBasedRates || [],
      dimensionBasedRates: body.dimensionBasedRates || [],
      updatedAt: new Date(),
    };

    // Use replaceOne with upsert to ensure all fields are saved
    const result = await collection.findOneAndReplace(
      {}, // Match any document (there should only be one)
      { ...newSettings, createdAt: new Date() },
      { 
        upsert: true, 
        returnDocument: 'after'
      }
    );

    const settings = result;

    console.log('Settings saved:', {
      enableRazorpay: settings?.enableRazorpay,
      enableCOD: settings?.enableCOD,
      gstRate: settings?.gstRate,
      shippingCost: settings?.shippingCost,
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
