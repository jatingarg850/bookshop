import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  orderId: string;
  invoiceNumber: string;
  userId?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
    total: number;
    sku?: string;
    cgst?: number;
    sgst?: number;
    igst?: number;
    taxAmount?: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxRate: number;
  totalAmount: number;
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingDetails?: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  storeLogo?: string;
  storeDetails?: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    pan?: string;
    gst?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: mongoose.Schema.Types.ObjectId,
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number,
        priceAtPurchase: Number,
        total: Number,
        sku: String,
        cgst: Number,
        sgst: Number,
        igst: Number,
        taxAmount: Number,
      },
    ],
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    cgst: Number,
    sgst: Number,
    igst: Number,
    taxRate: Number,
    totalAmount: Number,
    shippingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    billingDetails: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: String,
    paymentStatus: String,
    storeLogo: String,
    storeDetails: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
      email: String,
      pan: String,
      gst: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);
