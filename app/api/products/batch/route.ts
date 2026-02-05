import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = (searchParams.get('ids') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    await connectDB();

    const objectIds: mongoose.Types.ObjectId[] = [];
    const externalIds: string[] = [];

    for (const id of ids) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        objectIds.push(new mongoose.Types.ObjectId(id));
      } else {
        externalIds.push(id);
      }
    }

    const or: any[] = [];
    if (objectIds.length > 0) or.push({ _id: { $in: objectIds } });
    if (externalIds.length > 0) or.push({ externalId: { $in: externalIds } });

    const query = or.length === 1 ? or[0] : { $or: or };

    const found = await Product.find(query).lean();

    const byKey = new Map<string, any>();
    for (const product of found) {
      byKey.set(String((product as any)._id), product);
      if ((product as any).externalId) {
        byKey.set(String((product as any).externalId), product);
      }
    }

    const products = ids
      .map((id) => byKey.get(id))
      .filter(Boolean)
      .map((product) => ({
        _id: (product as any)._id,
        externalId: (product as any).externalId,
        name: (product as any).name,
        price: (product as any).price,
        discountPrice: (product as any).discountPrice,
        cgst: (product as any).cgst,
        sgst: (product as any).sgst,
        igst: (product as any).igst,
        weight: (product as any).weight,
        weightUnit: (product as any).weightUnit,
        dimensions: (product as any).dimensions,
        sku: (product as any).sku,
        hsn: (product as any).hsn,
      }));

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Batch product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
