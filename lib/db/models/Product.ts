import mongoose, { Schema, Document } from 'mongoose';

export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface IVariation {
  color?: string;
  size?: string;
  quantity: number;
  sku?: string;
  price?: number;
}

export interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  // Optional education/catalog metadata (e.g. NCERT)
  externalId?: string;
  board?: string;
  class?: number;
  subject?: string;
  medium?: 'English' | 'Hindi';
  inStock?: boolean;
  price: number;
  retailPrice?: number;
  discountPrice?: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  stock: number;
  tags: string[];
  status: ProductStatus;
  rating?: number;
  reviewCount?: number;
  // New fields
  hsn?: string;
  brand?: string;
  manufacturer?: string;
  quantityPerItem?: number;
  unit?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    breadth?: number;
    unit?: string;
  };
  // GST fields
  cgst?: number;
  sgst?: number;
  igst?: number;
  material?: string;
  color?: string;
  size?: string;
  variations?: IVariation[];
  warranty?: string;
  countryOfOrigin?: string;
  features?: string[];
  specifications?: Record<string, string>;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const variationSchema = new Schema({
  color: String,
  size: String,
  quantity: { type: Number, default: 0 },
  sku: String,
  price: Number,
}, { _id: false });

const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    externalId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    board: {
      type: String,
      trim: true,
    },
    class: {
      type: Number,
      min: 1,
      max: 12,
    },
    subject: {
      type: String,
      trim: true,
    },
    medium: {
      type: String,
      enum: ['English', 'Hindi'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    retailPrice: {
      type: Number,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // New fields
    hsn: {
      type: String,
    },
    brand: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    quantityPerItem: {
      type: Number,
      min: 1,
      default: 1,
    },
    unit: {
      type: String,
      default: 'piece',
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    weightUnit: {
      type: String,
      default: 'g',
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      breadth: Number,
      unit: { type: String, default: 'cm' },
    },
    cgst: {
      type: Number,
      min: 0,
    },
    sgst: {
      type: Number,
      min: 0,
    },
    igst: {
      type: Number,
      min: 0,
    },
    material: {
      type: String,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    variations: [variationSchema],
    warranty: {
      type: String,
    },
    countryOfOrigin: {
      type: String,
      default: 'India',
    },
    features: [String],
    specifications: {
      type: Map,
      of: String,
    },
    minOrderQuantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    maxOrderQuantity: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



// Keep `inStock` consistent when stock is set/updated.
productSchema.pre('save', function (next) {
  try {
    (this as any).inStock = Number((this as any).stock || 0) > 0;
    next();
  } catch (error) {
    next(error as Error);
  }
});

productSchema.pre('findOneAndUpdate', function (next) {
  const update: any = this.getUpdate() || {};
  const stock =
    typeof update?.stock === 'number'
      ? update.stock
      : typeof update?.$set?.stock === 'number'
        ? update.$set.stock
        : null;

  if (stock !== null) {
    update.$set = update.$set || {};
    update.$set.inStock = stock > 0;
    this.setUpdate(update);
  }

  next();
});

productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ status: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ manufacturer: 1 });
productSchema.index({ board: 1 });
productSchema.index({ class: 1 });
productSchema.index({ subject: 1 });
productSchema.index({ medium: 1 });
productSchema.index({ color: 1 });
productSchema.index({ size: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
