'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminDeliveryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchDeliveries();
  }, [status, page]);

  async function fetchDeliveries() {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/delivery?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data.deliveries);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold mb-8">Delivery Management</h1>

      <Card className="mb-6">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Statuse</option>
          <option value="pending">Pending</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </Card>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-center text-gray-600">No deliveries found</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {deliveries.map((delivery) => (
              <Card key={delivery._id}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Order: {delivery.orderId}</p>
                    <p className="text-sm text-gray-600">
                      Tracking: {delivery.trackingNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Carrier: {delivery.carrier}
                    </p>
                    <p className="text-sm text-gray-600">
                      Est. Delivery: {new Date(delivery.estimatedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      delivery.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : delivery.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <Link href={`/admin/delivery/${delivery._id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        Update
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pages}
            onPageChange={setPage}
          />
        </>
      )}
    </AdminLayout>
  );
}
