import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      addresses: user.addresses || [],
      defaultAddressId: user.defaultAddressId,
    });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, city, state, pincode, isDefault } = body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newAddress = {
      _id: new (require('mongoose')).Types.ObjectId(),
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    };

    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
      newAddress.isDefault = true;
      user.defaultAddressId = newAddress._id;
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Failed to create address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
