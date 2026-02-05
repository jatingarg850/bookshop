import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/utils/razorpay';
import { updateMockOrder } from '@/lib/mockOrderStore';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const updated = updateMockOrder(orderId, (order) => ({
      ...order,
      updatedAt: new Date().toISOString(),
      payment: {
        ...order.payment,
        status: 'paid',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      orderStatus: 'confirmed',
    }));

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
