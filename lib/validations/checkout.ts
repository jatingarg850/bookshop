import { z } from 'zod';

export const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),
});

export const checkoutSchema = z.object({
  shipping: shippingSchema,
  paymentMethod: z.enum(['razorpay', 'cod']),
});

export type ShippingInput = z.infer<typeof shippingSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
