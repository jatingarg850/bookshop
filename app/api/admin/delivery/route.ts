import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Delivery from '@/lib/db/models/Delivery';
import { authOptions } from '@/lib/auth/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();

    const query: any = {};
    if (status) query.status = status;

    const total = await Delivery.countDocuments(query);
    const deliveries = await Delivery.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      deliveries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Deliveries fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
