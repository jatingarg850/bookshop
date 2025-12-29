import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    await connectDB();

    // Convert string IDs to MongoDB ObjectIds
    const objectIds = ids.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (e) {
        return id;
      }
    });

    const products = await Product.find({
      _id: { $in: objectIds },
    }).select('_id name price discountPrice cgst sgst igst weight weightUnit dimensions sku hsn');

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Batch product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
