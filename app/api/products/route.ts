import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export const dynamic = 'force-dynamic';

function normalize(value?: string | null) {
  return String(value || '').trim();
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSort(sortRaw: string) {
  const s = normalize(sortRaw);

  // UI-friendly sort keys
  if (s === '' || s === 'newest') return { field: 'createdAt', dir: -1 } as const;
  if (s === 'price-asc') return { field: 'price', dir: 1 } as const;
  if (s === 'price-desc') return { field: 'price', dir: -1 } as const;
  if (s === 'name-asc') return { field: 'name', dir: 1 } as const;

  // Legacy API style: "-createdAt", "price", etc.
  if (s.startsWith('-')) return { field: s.slice(1) || 'createdAt', dir: -1 } as const;
  return { field: s, dir: 1 } as const;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const brand = searchParams.get('brand') || '';
    const color = searchParams.get('color') || '';
    const size = searchParams.get('size') || '';

    // Optional catalog metadata filters
    const board = searchParams.get('board') || '';
    const subject = searchParams.get('subject') || '';
    const medium = searchParams.get('medium') || '';
    const classLevel = searchParams.get('class') || searchParams.get('classLevel') || '';

    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const rating = searchParams.get('rating') || '';

    const featured = searchParams.get('featured') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';

    const status = searchParams.get('status') || 'active';
    const sortRaw = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '12') || 12));

    const filter: any = {};

    if (status !== 'all') {
      filter.status = status;
    }

    if (normalize(category)) {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }

    if (normalize(subcategory)) {
      filter.subcategory = new RegExp(`^${escapeRegex(subcategory)}$`, 'i');
    }

    if (normalize(brand)) {
      filter.brand = new RegExp(escapeRegex(brand), 'i');
    }

    if (normalize(color)) {
      filter.color = new RegExp(escapeRegex(color), 'i');
    }

    if (normalize(size)) {
      filter.size = new RegExp(escapeRegex(size), 'i');
    }

    if (normalize(board)) {
      filter.board = new RegExp(`^${escapeRegex(board)}$`, 'i');
    }

    if (normalize(subject)) {
      filter.subject = new RegExp(`^${escapeRegex(subject)}$`, 'i');
    }

    if (normalize(medium)) {
      filter.medium = new RegExp(`^${escapeRegex(medium)}$`, 'i');
    }

    if (normalize(classLevel)) {
      const parsed = parseInt(classLevel);
      if (!Number.isNaN(parsed)) {
        filter.class = parsed;
      }
    }

    const min = normalize(minPrice) ? parseFloat(minPrice) : null;
    const max = normalize(maxPrice) ? parseFloat(maxPrice) : null;
    if (min !== null || max !== null) {
      filter.price = {};
      if (min !== null && !Number.isNaN(min)) filter.price.$gte = min;
      if (max !== null && !Number.isNaN(max)) filter.price.$lte = max;
    }

    if (inStock) {
      // inStock is kept in sync with stock via model hooks.
      filter.inStock = true;
    }

    if (onSale) {
      // discountPrice exists and is lower than price
      filter.$expr = {
        $and: [
          { $gt: ['$discountPrice', 0] },
          { $lt: ['$discountPrice', '$price'] },
        ],
      };
    }

    const minRating = normalize(rating) ? parseFloat(rating) : null;
    if (minRating !== null && !Number.isNaN(minRating)) {
      filter.rating = { $gte: minRating };
    }

    if (featured) filter.isFeatured = true;
    if (newArrival) filter.isNewArrival = true;
    if (bestSeller) filter.isBestSeller = true;

    const searchTerm = normalize(search);
    if (searchTerm) {
      const re = escapeRegex(searchTerm);
      filter.$or = [
        { name: { $regex: re, $options: 'i' } },
        { description: { $regex: re, $options: 'i' } },
        { sku: { $regex: re, $options: 'i' } },
        { tags: { $elemMatch: { $regex: re, $options: 'i' } } },
        { board: { $regex: re, $options: 'i' } },
        { subject: { $regex: re, $options: 'i' } },
      ];
    }

    const { field, dir } = resolveSort(sortRaw);
    const sort: any = { isFeatured: -1 };
    sort[field] = dir;
    if (field !== 'createdAt') sort.createdAt = -1;

    const skip = (page - 1) * limit;

    const [products, total, categories, brands, colors, sizes] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Product.distinct('category', { status: 'active' }),
      Product.distinct('brand', { status: 'active' }),
      Product.distinct('color', { status: 'active' }),
      Product.distinct('size', { status: 'active' }),
    ]);

    const clean = (arr: any[]) => {
      const out = new Map<string, string>();
      for (const v of arr || []) {
        if (v == null) continue;
        const s = String(v).trim();
        if (!s) continue;
        const key = s.toLowerCase();
        if (!out.has(key)) out.set(key, s);
      }
      return Array.from(out.values());
    };
    const pages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      products,
      pagination: { total, page, limit, pages },
      filters: {
        categories: clean(categories).sort(),
        brands: clean(brands).sort(),
        colors: clean(colors).sort(),
        sizes: clean(sizes).sort(),
      },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
