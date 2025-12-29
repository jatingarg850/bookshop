import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import Invoice from '@/lib/db/models/Invoice';
import Delivery from '@/lib/db/models/Delivery';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth/auth';
import { checkoutSchema } from '@/lib/validations/checkout';
import { generateInvoiceNumber } from '@/lib/utils/invoice';
import {
  calculateOrderWeight,
  calculateOrderWeightInGrams,
  calculateOrderVolume,
  calculateShippingCost,
  calculateOrderTax,
} from '@/lib/utils/shippingCalculator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping, paymentMethod } = body;

    const validatedShipping = checkoutSchema.parse({
      shipping,
      paymentMethod,
    });

    await connectDB();

    // Fetch settings for tax and shipping calculation
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const settingsCollection = db.collection('settings');
    const settings = await settingsCollection.findOne({});
    const globalTaxRate = settings?.gstRate ?? 18;
    const shippingThreshold = settings?.freeShippingAbove ?? 500;
    const defaultShippingCost = settings?.shippingCost ?? 50;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    const productsData = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      const orderItem = {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        priceAtPurchase: price,
        quantity: item.quantity,
        weight: product.weight,
        weightUnit: product.weightUnit,
        dimensions: product.dimensions,
        cgst: product.cgst,
        sgst: product.sgst,
        igst: product.igst,
      };

      orderItems.push(orderItem);
      productsData.push({
        ...orderItem,
        productId: product._id.toString(),
      });
    }

    // Calculate shipping based on weight and dimensions
    const totalWeight = calculateOrderWeight(productsData);
    const totalWeightGrams = calculateOrderWeightInGrams(productsData);
    const totalVolume = calculateOrderVolume(productsData);
    const shippingCost = calculateShippingCost(subtotal, totalWeightGrams, {
      shippingCost: defaultShippingCost,
      freeShippingAbove: shippingThreshold,
      weightBasedRates: settings?.weightBasedRates,
      dimensionBasedRates: settings?.dimensionBasedRates,
    }, totalVolume);

    // Calculate tax with product-level rates
    const taxCalculation = calculateOrderTax(
      productsData.map(item => ({
        ...item,
        priceAtPurchase: item.priceAtPurchase,
      })),
      globalTaxRate
    );

    const totalAmount = subtotal + shippingCost + taxCalculation.totalTax;

    const session = await getServerSession(authOptions);

    const order = await Order.create({
      userEmail: session?.user?.email || undefined,
      guestEmail: !session ? shipping.email : undefined,
      items: orderItems,
      shippingDetails: validatedShipping.shipping,
      payment: {
        method: validatedShipping.paymentMethod,
        status: validatedShipping.paymentMethod === 'cod' ? 'pending' : 'pending',
      },
      orderStatus: validatedShipping.paymentMethod === 'cod' ? 'confirmed' : 'pending',
      subtotal,
      shippingCost,
      tax: taxCalculation.totalTax,
      cgst: taxCalculation.totalCGST,
      sgst: taxCalculation.totalSGST,
      igst: taxCalculation.totalIGST,
      totalAmount,
      totalWeight,
    });

    // For COD orders, create invoice and delivery immediately
    if (validatedShipping.paymentMethod === 'cod') {
      // Reduce stock for COD orders
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Create Invoice for COD
      const invoiceNumber = generateInvoiceNumber();
      await Invoice.create({
        orderId: order._id.toString(),
        invoiceNumber,
        userId: order.userId,
        items: orderItems.map((item, idx) => ({
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
        subtotal,
        shippingCost,
        tax: taxCalculation.totalTax,
        cgst: taxCalculation.totalCGST,
        sgst: taxCalculation.totalSGST,
        igst: taxCalculation.totalIGST,
        taxRate: globalTaxRate,
        totalAmount,
        shippingDetails: validatedShipping.shipping,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        storeLogo: settings?.logoUrl || '',
      });

      // Create Delivery Record for COD
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

      const trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await Delivery.create({
        orderId: order._id.toString(),
        trackingNumber,
        carrier: 'Standard Delivery',
        estimatedDeliveryDate,
        status: 'pending',
        location: 'Processing',
        notes: 'COD order confirmed and ready for pickup',
      });
    }

    return NextResponse.json({
      orderId: order._id,
      totalAmount,
      shippingCost,
      tax: taxCalculation.totalTax,
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

    const orders = await Order.find({ userEmail: session.user.email }).sort('-createdAt');

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
