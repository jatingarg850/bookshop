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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, icon, isActive, parentId } = body;

    await connectDB();

    const category = await Category.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase().trim() }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        ...(parentId !== undefined && { parentId: parentId || null }),
      },
      { new: true }
    ).populate('parentId', 'name slug');

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Category update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
