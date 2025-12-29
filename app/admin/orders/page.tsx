'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  async function fetchOrders() {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold mb-8">Orders</h1>

      <Card className="mb-6">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </Card>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900">Items:</p>
                      <div className="mt-1 space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-700">
                            • {item.name} {item.sku && `(${item.sku})`}
                          </p>
                        ))}
                      </div>
                    </div>
                    {order.shippingDetails && (
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Address:</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <div>
                      <p className="font-bold">₹{order.totalAmount}</p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'primary' : 'outline'}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
