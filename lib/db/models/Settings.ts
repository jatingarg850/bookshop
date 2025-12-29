import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  enableCOD: boolean;
  enableRazorpay: boolean;
  shippingCost: number;
  freeShippingAbove: number;
  gstRate: number;
  storeAddress: string;
  storeCity: string;
  storeState: string;
  storePincode: string;
  logoUrl?: string;
  weightBasedRates?: Array<{
    minWeight: number;
    maxWeight: number;
    cost: number;
  }>;
  dimensionBasedRates?: Array<{
    minVolume: number;
    maxVolume: number;
    cost: number;
  }>;
}

const settingsSchema = new Schema<ISettings>(
  {
    storeName: {
      type: String,
      default: 'Radhe Stationery',
    },
    supportEmail: {
      type: String,
      default: 'support@radhestationery.com',
    },
    supportPhone: {
      type: String,
      default: '+91-XXXXXXXXXX',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    enableCOD: {
      type: Boolean,
      default: false,
    },
    enableRazorpay: {
      type: Boolean,
      default: true,
    },
    shippingCost: {
      type: Number,
      default: 50,
    },
    freeShippingAbove: {
      type: Number,
      default: 500,
    },
    gstRate: {
      type: Number,
      default: 18,
    },
    storeAddress: {
      type: String,
      default: '',
    },
    storeCity: {
      type: String,
      default: '',
    },
    storeState: {
      type: String,
      default: '',
    },
    storePincode: {
      type: String,
      default: '',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    weightBasedRates: [
      {
        minWeight: {
          type: Number,
          required: true,
        },
        maxWeight: {
          type: Number,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
    dimensionBasedRates: [
      {
        minVolume: {
          type: Number,
          required: true,
        },
        maxVolume: {
          type: Number,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Delete cached model if it exists to ensure fresh schema
if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
