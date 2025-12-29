import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Invoice from '@/lib/db/models/Invoice';
import Order from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/auth';
import mongoose from 'mongoose';

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectDB();

    // Find invoice by order ID
    const invoice = await Invoice.findOne({ orderId: params.orderId });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Verify user has access to this invoice
    if (session?.user?.email) {
      const order = await Order.findById(params.orderId);
      if (!order || order.userEmail !== session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Fetch store settings
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const settingsCollection = db.collection('settings');
    const settings = await settingsCollection.findOne({});

    // Format invoice data for template
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      orderId: invoice.orderId,
      createdAt: invoice.createdAt,
      storeName: settings?.storeName || 'Radhe Stationery',
      storeAddress: settings?.storeAddress || '',
      storeCity: settings?.storeCity || '',
      storeState: settings?.storeState || '',
      storePincode: settings?.storePincode || '',
      storePAN: settings?.panNumber || '',
      storeGST: settings?.gstNumber || '',
      storePhone: settings?.storePhone || '',
      storeEmail: settings?.storeEmail || '',
      storeLogo: invoice.storeLogo || settings?.logoUrl || '',
      billingName: invoice.billingDetails?.name || invoice.shippingDetails.name,
      billingAddress: invoice.billingDetails?.address || invoice.shippingDetails.address,
      billingCity: invoice.billingDetails?.city || invoice.shippingDetails.city,
      billingState: invoice.billingDetails?.state || invoice.shippingDetails.state,
      billingPincode: invoice.billingDetails?.pincode || invoice.shippingDetails.pincode,
      shippingName: invoice.shippingDetails.name,
      shippingAddress: invoice.shippingDetails.address,
      shippingCity: invoice.shippingDetails.city,
      shippingState: invoice.shippingDetails.state,
      shippingPincode: invoice.shippingDetails.pincode,
      shippingPhone: invoice.shippingDetails.phone,
      shippingEmail: invoice.shippingDetails.email,
      items: invoice.items,
      subtotal: invoice.subtotal,
      shippingCost: invoice.shippingCost,
      tax: invoice.tax,
      taxRate: invoice.taxRate || 18,
      totalAmount: invoice.totalAmount,
      paymentMethod: invoice.paymentMethod,
      paymentStatus: invoice.paymentStatus,
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
