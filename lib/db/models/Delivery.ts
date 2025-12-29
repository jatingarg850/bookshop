import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  location: string;
  notes: string;
  shiprocketAWB?: string;
  shiprocketOrderId?: number;
  shiprocketCourierId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      default: 'Standard Delivery',
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    actualDeliveryDate: Date,
    status: {
      type: String,
      enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
      default: 'pending',
    },
    location: String,
    notes: String,
    shiprocketAWB: String,
    shiprocketOrderId: Number,
    shiprocketCourierId: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', deliverySchema);
