import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';
import { authOptions } from '@/lib/auth/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');
    const parent = searchParams.get('parent');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = { isActive: true };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Handle parentId filtering
    if (parentId === 'null') {
      // Get only root categories (parentId is null)
      filter.parentId = null;
    } else if (parentId) {
      // Get categories with specific parentId
      filter.parentId = parentId;
    } else if (parent) {
      // Find parent category by slug and get its ID
      const parentCategory = await Category.findOne({ slug: parent });
      if (parentCategory) {
        filter.parentId = parentCategory._id;
      }
    }

    const skip = (page - 1) * limit;
    const categories = await Category.find(filter)
      .populate('parentId', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(filter);

    return NextResponse.json({
      categories,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, icon, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    await connectDB();

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 });
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase().trim(),
      description,
      icon,
      parentId: parentId || null,
      isActive: true,
    });

    await category.populate('parentId', 'name slug');

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 400 }
    );
  }
}
