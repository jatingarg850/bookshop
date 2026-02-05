import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId?: string;
  guestEmail?: string;
  userEmail?: string;
  items: Array<{
    productId: string;
    name: string;
    sku?: string;
    priceAtPurchase: number;
    quantity: number;
    weight?: number;
    weightUnit?: string;
    dimensions?: any;
    cgst?: number;
    sgst?: number;
    igst?: number;
  }>;
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment: {
    method: 'razorpay' | 'cod' | 'upi';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  discount: number;
  totalWeight?: number;
  shiprocketOrderId?: number;
  shiprocketShipmentId?: number;
  shiprocketAWB?: string;
  shiprocketCourier?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: mongoose.Schema.Types.ObjectId,
    userEmail: String,
    guestEmail: String,
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        sku: String,
        priceAtPurchase: Number,
        quantity: Number,
        weight: Number,
        weightUnit: String,
        dimensions: {
          length: Number,
          width: Number,
          height: Number,
          breadth: Number,
          unit: String,
        },
        cgst: Number,
        sgst: Number,
        igst: Number,
        image: String,
        slug: String,
      },
    ],
    shippingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'cod', 'upi'],
        default: 'razorpay',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalAmount: Number,
    subtotal: Number,
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    cgst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    igst: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalWeight: Number,
    shiprocketOrderId: Number,
    shiprocketShipmentId: Number,
    shiprocketAWB: String,
    shiprocketCourier: String,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ guestEmail: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
