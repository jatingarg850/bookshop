import { NextRequest, NextResponse } from 'next/server';
import { generateInvoiceNumber } from '@/lib/utils/invoice';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import mongoose from 'mongoose';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    await connectDB();
    const order = mongoose.Types.ObjectId.isValid(orderId)
      ? await Order.findById(orderId)
      : await Order.findOne({ _id: orderId });
    if (!order) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      orderId: order._id,
      createdAt: order.createdAt,
      storeName: 'Radhe Stationery',
      storeAddress: '',
      storeCity: '',
      storeState: '',
      storePincode: '',
      storePAN: '',
      storeGST: '',
      storePhone: '',
      storeEmail: '',
      storeLogo: '',
      billingName: order.shippingDetails.name,
      billingAddress: order.shippingDetails.address,
      billingCity: order.shippingDetails.city,
      billingState: order.shippingDetails.state,
      billingPincode: order.shippingDetails.pincode,
      shippingName: order.shippingDetails.name,
      shippingAddress: order.shippingDetails.address,
      shippingCity: order.shippingDetails.city,
      shippingState: order.shippingDetails.state,
      shippingPincode: order.shippingDetails.pincode,
      shippingPhone: order.shippingDetails.phone,
      shippingEmail: order.shippingDetails.email,
      items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        total: item.priceAtPurchase * item.quantity,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        taxAmount: 0,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      cgst: order.cgst,
      sgst: order.sgst,
      igst: order.igst,
      taxRate: 18,
      totalAmount: order.totalAmount,
      paymentMethod: order.payment.method,
      paymentStatus: order.payment.status,
    };

    return NextResponse.json({ invoice: invoiceData });
  } catch (error: any) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}
