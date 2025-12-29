import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import mongoose from 'mongoose';

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
};

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // Use native MongoDB driver to bypass Mongoose caching
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const collection = db.collection('settings');
    
    let settings = await collection.findOne({});

    // If no settings exist, create with defaults
    if (!settings) {
      const result = await collection.insertOne({
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      settings = await collection.findOne({ _id: result.insertedId });
    }

    console.log('Public settings fetched:', {
      enableRazorpay: settings?.enableRazorpay,
      enableCOD: settings?.enableCOD,
      gstRate: settings?.gstRate,
      shippingCost: settings?.shippingCost,
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
