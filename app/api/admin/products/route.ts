import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/auth';
import { productSchema } from '@/lib/validations/product';

function makeSku(input: string) {
  return String(input || '')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Generate a SKU if missing/blank to keep admin flow smooth.
    if (!body?.sku || String(body.sku).trim() === '') {
      body.sku = makeSku(body?.slug || body?.name || 'SKU');
    }
    const validatedData = productSchema.parse(body);

    await connectDB();

    const existingProduct = await Product.findOne({ slug: validatedData.slug });
    if (existingProduct) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const product = await Product.create({
      ...validatedData,
      status: validatedData.status || 'draft',
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}
