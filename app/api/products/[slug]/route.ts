import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectDB();

    const product = await Product.findOne({ slug, status: 'active' }).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const related = await Product.find({
      status: 'active',
      category: (product as any).category,
      _id: { $ne: (product as any)._id },
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({
      product,
      related,
    });
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
