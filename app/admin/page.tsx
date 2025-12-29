'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <p className="text-sm text-gray-600 mb-2">Total Products</p>
            <p className="text-4xl font-bold text-primary-600">{stats?.totalProducts || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-primary-600">{stats?.totalOrders || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-primary-600">₹{stats?.totalRevenue || 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-2">Avg Order Value</p>
            <p className="text-4xl font-bold text-primary-600">
              ₹{stats?.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
            </p>
          </Card>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <Card>
            <h2 className="font-heading text-2xl font-bold mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{order._id.slice(-8)}</td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold">₹{order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
