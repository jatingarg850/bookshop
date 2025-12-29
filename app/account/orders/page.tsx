'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container-max py-12">
        <Card className="text-center max-w-md mx-auto">
          <h1 className="font-heading text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your orders.</p>
          <Button onClick={() => signIn()} size="lg">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-max py-12">
        <Card className="text-center max-w-md mx-auto">
          <h1 className="font-heading text-2xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono font-bold mb-2">{order._id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-bold text-lg text-primary-600 mb-2">₹{order.totalAmount}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.orderStatus === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.orderStatus === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              <Link href={`/account/orders/${order._id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
