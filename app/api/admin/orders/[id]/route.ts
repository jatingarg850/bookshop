import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/auth';

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
