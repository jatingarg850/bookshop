import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { checkoutSchema } from '@/lib/validations/checkout';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import mongoose from 'mongoose';
import Order from '@/lib/db/models/Order';

const DEFAULT_SETTINGS = {
  shippingCost: 50,
  freeShippingAbove: 500,
  gstRate: 18,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping, paymentMethod } = body;

    const validatedShipping = checkoutSchema.parse({
      shipping,
      paymentMethod,
    });

    const settings = DEFAULT_SETTINGS;
    const globalTaxRate = settings.gstRate;
    const shippingThreshold = settings.freeShippingAbove;
    const defaultShippingCost = settings.shippingCost;

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    await connectDB();

    const findProduct = async (productId: string) => {
      if (!productId) return null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        return Product.findOne({ _id: productId, status: 'active' }).lean();
      }
      return (
        (await Product.findOne({ externalId: productId, status: 'active' }).lean()) ||
        (await Product.findOne({ slug: productId, status: 'active' }).lean())
      );
    };

    for (const item of items) {
      const product = await findProduct(String(item.productId));
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (typeof product.stock === 'number' && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      const orderItem = {
        productId: String((product as any)._id ?? (product as any).id),
        name: (product as any).name,
        sku: (product as any).sku,
        priceAtPurchase: price,
        quantity: item.quantity,
        weight: (product as any).weight,
        weightUnit: (product as any).weightUnit,
        dimensions: (product as any).dimensions,
        cgst: (product as any).cgst,
        sgst: (product as any).sgst,
        igst: (product as any).igst,
        image: (product as any).images?.[0]?.url || item.image,
        slug: (product as any).slug,
      };

      orderItems.push(orderItem);
    }

    const shippingCost = subtotal > shippingThreshold ? 0 : defaultShippingCost;
    const tax = Math.round(((subtotal * globalTaxRate) / 100) * 100) / 100;
    const cgst = Math.round((tax / 2) * 100) / 100;
    const sgst = Math.round((tax / 2) * 100) / 100;
    const igst = 0;
    const totalAmount = subtotal + shippingCost + tax;

    const session = await getServerSession(authOptions);
    const userId =
      session?.user && mongoose.Types.ObjectId.isValid((session.user as any).id)
        ? new mongoose.Types.ObjectId((session.user as any).id)
        : undefined;

    const paymentStatus = validatedShipping.paymentMethod === 'razorpay' ? 'pending' : 'paid';
    const order = await Order.create({
      userId,
      userEmail: session?.user?.email || undefined,
      guestEmail: !session ? validatedShipping.shipping.email : undefined,
      items: orderItems.map((item) => ({
        ...item,
        productId: mongoose.Types.ObjectId.isValid(item.productId)
          ? new mongoose.Types.ObjectId(item.productId)
          : item.productId,
      })),
      shippingDetails: validatedShipping.shipping,
      payment: {
        method: validatedShipping.paymentMethod as any,
        status: paymentStatus as any,
      },
      orderStatus: validatedShipping.paymentMethod === 'razorpay' ? 'pending' : 'confirmed',
      subtotal,
      shippingCost,
      tax,
      cgst,
      sgst,
      igst,
      discount: 0,
      totalAmount,
    });

    return NextResponse.json({
      orderId: order._id.toString(),
      totalAmount,
      shippingCost,
      tax,
      subtotal,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
