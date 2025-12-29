import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import Invoice from '@/lib/db/models/Invoice';
import Delivery from '@/lib/db/models/Delivery';
import mongoose from 'mongoose';
import { verifyRazorpaySignature } from '@/lib/utils/razorpay';
import { generateInvoiceNumber } from '@/lib/utils/invoice';
import { calculateOrderTax } from '@/lib/utils/shippingCalculator';

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

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order with payment details
    order.payment.status = 'paid';
    order.payment.razorpayOrderId = razorpayOrderId;
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.orderStatus = 'confirmed';

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    await order.save();

    // Fetch settings using native MongoDB driver
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const settingsCollection = db.collection('settings');
    const settings = await settingsCollection.findOne({});
    const globalTaxRate = settings?.gstRate ?? 18;

    // Calculate tax with product-level rates
    const productsData = order.items.map((item: any) => ({
      productId: item.productId?.toString() || '',
      priceAtPurchase: item.priceAtPurchase || 0,
      quantity: item.quantity || 1,
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      igst: item.igst || 0,
    }));

    const taxCalculation = calculateOrderTax(productsData, globalTaxRate);

    // Ensure tax values are valid numbers
    const validTax = isNaN(taxCalculation.totalTax) ? 0 : taxCalculation.totalTax;
    const validCGST = isNaN(taxCalculation.totalCGST) ? 0 : taxCalculation.totalCGST;
    const validSGST = isNaN(taxCalculation.totalSGST) ? 0 : taxCalculation.totalSGST;
    const validIGST = isNaN(taxCalculation.totalIGST) ? 0 : taxCalculation.totalIGST;
    const validTotalAmount = order.subtotal + order.shippingCost + validTax;

    // Create Invoice
    const invoiceNumber = generateInvoiceNumber();
    const invoice = await Invoice.create({
      orderId: order._id.toString(),
      invoiceNumber,
      userId: order.userId,
      items: order.items.map((item: any, idx: number) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        total: item.priceAtPurchase * item.quantity,
        cgst: taxCalculation.itemTaxes[idx]?.cgst || 0,
        sgst: taxCalculation.itemTaxes[idx]?.sgst || 0,
        igst: taxCalculation.itemTaxes[idx]?.igst || 0,
        taxAmount: taxCalculation.itemTaxes[idx]?.total || 0,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: validTax,
      cgst: validCGST,
      sgst: validSGST,
      igst: validIGST,
      taxRate: globalTaxRate,
      totalAmount: validTotalAmount,
      shippingDetails: order.shippingDetails,
      paymentMethod: order.payment.method,
      paymentStatus: order.payment.status,
      storeLogo: settings?.logoUrl || '',
    });

    // Create Delivery Record
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5); // 5 days delivery

    const trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const delivery = await Delivery.create({
      orderId: order._id.toString(),
      trackingNumber,
      carrier: 'Standard Delivery',
      estimatedDeliveryDate,
      status: 'pending',
      location: 'Processing',
      notes: 'Order confirmed and ready for pickup',
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      invoiceNumber: invoice.invoiceNumber,
      trackingNumber: delivery.trackingNumber,
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
