import { z } from 'zod';

const imageUrlSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith('/') || /^https?:\/\//i.test(value), {
    message: 'Invalid image URL',
  });

const variationSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().min(0).default(0),
  sku: z.string().optional(),
  price: z.number().min(0).optional(),
});

export const productSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  // Optional catalog/education metadata (e.g. NCERT)
  externalId: z.string().optional(),
  board: z.string().optional(),
  class: z.number().int().min(1).max(12).optional(),
  subject: z.string().optional(),
  medium: z.enum(['English', 'Hindi']).optional(),
  inStock: z.boolean().optional(),
  price: z.number().min(0, 'Price must be positive'),
  retailPrice: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional(),
  stock: z.number().min(0, 'Stock must be non-negative'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  images: z
    .array(
      z.object({
        url: imageUrlSchema,
        alt: z.string().optional(),
      })
    )
    .optional(),
  // New fields
  hsn: z.string().optional(),
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  quantityPerItem: z.number().min(1).optional(),
  unit: z.string().optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.string().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    breadth: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  cgst: z.number().min(0).optional(),
  sgst: z.number().min(0).optional(),
  igst: z.number().min(0).optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  variations: z.array(variationSchema).optional(),
  warranty: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  minOrderQuantity: z.number().min(1).optional(),
  maxOrderQuantity: z.number().min(1).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
