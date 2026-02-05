import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function makeSku(input) {
  return String(input || '')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

async function loadData() {
  const base = await import('../data/products.base.js');
  const ncert = await import('../data/ncertCatalog.js');
  return {
    baseProducts: base.baseProducts || [],
    ncertCatalog: ncert.ncertCatalog || [],
  };
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Ensure legacy products without status become visible to the API.
    await Product.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );

    const { baseProducts, ncertCatalog } = await loadData();

    const docs = [];

    for (const p of baseProducts) {
      const externalId = `base-${String(p._id ?? p.id ?? p.slug ?? p.name)}`;
      const slug = p.slug || slugify(p.name);
      const sku = makeSku(`BASE-${String(p._id ?? p.id ?? slug)}`);

      docs.push({
        externalId,
        sku,
        name: p.name,
        slug,
        description: p.description || `${p.name}`,
        category: p.category || 'Books',
        price: Number(p.price || 0),
        retailPrice: p.retailPrice,
        discountPrice: p.discountPrice,
        stock: typeof p.stock === 'number' ? p.stock : (p.inStock ? 100 : 0),
        inStock: typeof p.inStock === 'boolean' ? p.inStock : (p.stock ?? 0) > 0,
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

    for (const b of ncertCatalog) {
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
        inStock: !!b.inStock,
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

    const ops = docs.map((d) => ({
      updateOne: {
        filter: { $or: [{ externalId: d.externalId }, { slug: d.slug }] },
        update: { $setOnInsert: d },
        upsert: true,
      },
    }));

    const result = ops.length ? await Product.bulkWrite(ops, { ordered: false }) : null;
    const upserted = result?.upsertedCount || 0;
    const matched = result?.matchedCount || 0;

    console.log(`✓ Seed complete. Upserted: ${upserted}, Matched: ${matched}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
