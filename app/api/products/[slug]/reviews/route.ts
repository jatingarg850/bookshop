import { NextRequest, NextResponse } from 'next/server';
import { products as staticProducts } from '@/data/products';
import { addMockReview, listMockReviews } from '@/lib/mockReviewStore';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = staticProducts.find((p: any) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = listMockReviews(slug);
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
            reviews.length
          ).toFixed(1)
        : '0';

    return NextResponse.json({
      reviews,
      avgRating,
      totalReviews: reviews.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = staticProducts.find((p: any) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();

    const review = {
      _id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      productSlug: slug,
      rating: Number(body?.rating || 0),
      title: String(body?.title || ''),
      comment: String(body?.comment || ''),
      guestName: body?.guestName ? String(body.guestName) : undefined,
      guestEmail: body?.guestEmail ? String(body.guestEmail) : undefined,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

        addMockReview(slug, review);

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 400 }
    );
  }
}
