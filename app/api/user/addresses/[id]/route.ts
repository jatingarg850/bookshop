import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import mongoose from 'mongoose';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, city, state, pincode, isDefault } = body;

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === params.id
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Update address fields
    if (name) user.addresses[addressIndex].name = name;
    if (phone) user.addresses[addressIndex].phone = phone;
    if (address) user.addresses[addressIndex].address = address;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (pincode) user.addresses[addressIndex].pincode = pincode;

    // Handle default address
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
      user.addresses[addressIndex].isDefault = true;
      user.defaultAddressId = new mongoose.Types.ObjectId(params.id);
    }

    await user.save();

    return NextResponse.json({ address: user.addresses[addressIndex] });
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === params.id
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    user.addresses.splice(addressIndex, 1);

    // If deleted address was default, set first address as default
    if (user.addresses.length > 0 && user.defaultAddressId?.toString() === params.id) {
      user.addresses[0].isDefault = true;
      user.defaultAddressId = user.addresses[0]._id;
    } else if (user.addresses.length === 0) {
      user.defaultAddressId = undefined;
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
