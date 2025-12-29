import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const brand = searchParams.get('brand');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const onSale = searchParams.get('onSale');
    const rating = searchParams.get('rating');
    const featured = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');
    const bestSeller = searchParams.get('bestSeller');
    const status = searchParams.get('status') || 'active';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter: any = {};
    
    if (status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (color) filter.color = { $regex: color, $options: 'i' };
    if (size) filter.size = { $regex: size, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (onSale === 'true') filter.discountPrice = { $exists: true, $ne: null };
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (featured === 'true') filter.isFeatured = true;
    if (newArrival === 'true') filter.isNewArrival = true;
    if (bestSeller === 'true') filter.isBestSeller = true;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    // Get unique values for filters
    const allProducts = await Product.find({ status: 'active' }).select('brand color size');
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
    const colors = [...new Set(allProducts.map(p => p.color).filter(Boolean))];
    const sizes = [...new Set(allProducts.map(p => p.size).filter(Boolean))];

    return NextResponse.json({
      products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      filters: { brands, colors, sizes },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
