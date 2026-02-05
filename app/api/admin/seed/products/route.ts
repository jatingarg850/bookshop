import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';
import { baseProducts } from '@/data/products.base';
import { ncertCatalog } from '@/data/ncertCatalog';

function slugify(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function makeSku(input: string) {
  return String(input)
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') return null;
  return session;
}

const DEFAULT_CATEGORIES = [
  {
    name: 'Books',
    slug: 'books',
    description: 'School books, novels, and educational materials',
    icon: '📚',
  },
  {
    name: 'Art & Craft',
    slug: 'art',
    description: 'Art supplies and craft materials',
    icon: '🎨',
  },
  {
    name: 'Craft Supplies',
    slug: 'craft',
    description: 'DIY craft supplies and materials',
    icon: '✂️',
  },
  {
    name: 'Stationery',
    slug: 'stationery',
    description: 'Pens, pencils, notebooks, and office supplies',
    icon: '✏️',
  },
];

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let options: {
    includeCategories: boolean;
    includeBase: boolean;
    includeNCERT: boolean;
    overwrite: boolean;
  } = {
    includeCategories: true,
    includeBase: true,
    includeNCERT: true,
    overwrite: false,
  };

  try {
    const body = await req.json();
    if (body && typeof body === 'object') {
      options = {
        includeCategories: body.includeCategories ?? options.includeCategories,
        includeBase: body.includeBase ?? options.includeBase,
        includeNCERT: body.includeNCERT ?? options.includeNCERT,
        overwrite: body.overwrite ?? options.overwrite,
      };
    }
  } catch {
    // allow empty body
  }

  await connectDB();

  let categoriesResult: { upserted: number; modified: number; matched: number } | null = null;
  if (options.includeCategories) {
    const catOps = DEFAULT_CATEGORIES.map((c) => ({
      updateOne: {
        filter: { slug: c.slug },
        update: options.overwrite
          ? { $set: { ...c, parentId: null, isActive: true } }
          : { $setOnInsert: { ...c, parentId: null, isActive: true } },
        upsert: true,
      },
    }));

    const catWrite = await Category.bulkWrite(catOps, { ordered: false });
    categoriesResult = {
      upserted: catWrite.upsertedCount,
      modified: catWrite.modifiedCount,
      matched: catWrite.matchedCount,
    };
  }

  const docs: any[] = [];

  if (options.includeBase) {
    for (const p of baseProducts as any[]) {
      const externalId = `base-${String(p._id ?? p.id)}`;

      docs.push({
        externalId,
        sku: makeSku(`BASE-${String(p._id ?? p.id)}`),
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        retailPrice: p.retailPrice,
        discountPrice: p.discountPrice,
        stock: typeof p.stock === 'number' ? p.stock : (p.inStock ? 100 : 0),
        status: p.status || 'active',
        tags: p.tags || [],
        images: p.images || [{ url: '/stack-of-books.png', alt: p.name }],
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: !!p.isFeatured,
        isNewArrival: !!p.isNewArrival,
        isBestSeller: !!p.isBestSeller,
      });
    }
  }

  if (options.includeNCERT) {
    for (const b of ncertCatalog as any[]) {
      const externalId = String(b.id);
      const name = String(b.title);
      const slug = slugify(`${b.board}-class-${b.class}-${b.subject}-${b.medium}`);

      docs.push({
        externalId,
        sku: makeSku(externalId),
        name,
        slug,
        description: `NCERT textbook for Class ${b.class} (${b.medium} medium) - ${b.subject}.`,
        category: 'Books',
        price: Number(b.price || 0),
        stock: b.inStock ? 100 : 0,
        status: 'active',
        tags: ['ncert', `class-${b.class}`, slugify(b.subject), String(b.medium).toLowerCase()],
        images: [{ url: '/stack-of-books.png', alt: name }],

        board: b.board,
        class: b.class,
        subject: b.subject,
        medium: b.medium,

        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
      });
    }
  }

  const ops = docs.map((d) => ({
    updateOne: {
      filter: { externalId: d.externalId },
      update: options.overwrite ? { $set: d } : { $setOnInsert: d },
      upsert: true,
    },
  }));

  const result =
    ops.length > 0 ? await Product.bulkWrite(ops, { ordered: false }) : null;

  return NextResponse.json({
    ok: true,
    includeCategories: options.includeCategories,
    includeBase: options.includeBase,
    includeNCERT: options.includeNCERT,
    overwrite: options.overwrite,
    categories: categoriesResult,
    products: {
      upserted: result?.upsertedCount || 0,
      modified: result?.modifiedCount || 0,
      matched: result?.matchedCount || 0,
    },
  });
}
