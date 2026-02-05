import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/auth';

export const dynamic = 'force-dynamic';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const user: any = session?.user;
  if (!user) return null;

  // Prefer role-based auth, but allow legacy ADMIN_EMAIL for backward compatibility.
  const legacyAdminEmail = process.env.ADMIN_EMAIL;
  if (user.role === 'admin') return session;
  if (legacyAdminEmail && user.email && user.email === legacyAdminEmail) return session;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();

    const query: any = {};
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
