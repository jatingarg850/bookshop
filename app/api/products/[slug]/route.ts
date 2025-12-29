import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug, status: 'active' });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    }).limit(4);

    return NextResponse.json({
      product,
      related,
    });
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
