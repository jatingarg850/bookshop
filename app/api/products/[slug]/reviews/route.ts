import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Review from '@/lib/db/models/Review';
import Product from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({
      productId: product._id,
      isApproved: true,
    })
      .sort('-createdAt')
      .lean();

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

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
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    await connectDB();

    const product = await Product.findOne({ slug: params.slug });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const review = await Review.create({
      productId: product._id,
      userEmail: session?.user?.email,
      guestName: !session ? body.guestName : undefined,
      guestEmail: !session ? body.guestEmail : undefined,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      isApproved: true,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 400 }
    );
  }
}
