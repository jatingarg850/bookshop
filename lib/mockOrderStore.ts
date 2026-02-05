export type MockPaymentMethod = 'razorpay' | 'cod' | 'upi';
export type MockPaymentStatus = 'pending' | 'paid' | 'failed';
export type MockOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface MockOrderItem {
  productId: string;
  name: string;
  sku?: string;
  priceAtPurchase: number;
  quantity: number;
  image?: string;
  slug?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
  weight?: number;
  weightUnit?: string;
  dimensions?: any;
}

export interface MockShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface MockOrder {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
  guestEmail?: string;
  items: MockOrderItem[];
  shippingDetails: MockShippingDetails;
  payment: {
    method: MockPaymentMethod;
    status: MockPaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  orderStatus: MockOrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  totalAmount: number;
}

type OrderStore = Map<string, MockOrder>;

function getStore(): OrderStore {
  const g = globalThis as any;
  if (!g.__mockOrderStore) {
    g.__mockOrderStore = new Map();
  }
  return g.__mockOrderStore as OrderStore;
}

export function createMockOrder(order: MockOrder): MockOrder {
  const store = getStore();
  store.set(order._id, order);
  return order;
}

export function updateMockOrder(id: string, updater: (order: MockOrder) => MockOrder): MockOrder | null {
  const store = getStore();
  const existing = store.get(id);
  if (!existing) return null;
  const next = updater(existing);
  store.set(id, next);
  return next;
}

export function getMockOrder(id: string): MockOrder | null {
  return getStore().get(id) || null;
}

export function listMockOrders(): MockOrder[] {
  return Array.from(getStore().values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listMockOrdersByEmail(email: string): MockOrder[] {
  const normalized = email.trim().toLowerCase();
  return listMockOrders().filter((o) => (o.userEmail || '').toLowerCase() === normalized);
}
