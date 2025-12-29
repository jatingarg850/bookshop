'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface DeliveryUpdateProps {
  params: { id: string };
}

export default function DeliveryUpdatePage({ params }: DeliveryUpdateProps) {
  const router = useRouter();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    estimatedDeliveryDate: '',
    actualDeliveryDate: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchDelivery();
  }, [params.id]);

  async function fetchDelivery() {
    try {
      const res = await fetch(`/api/admin/delivery/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDelivery(data);
        setFormData({
          status: data.status,
          estimatedDeliveryDate: data.estimatedDeliveryDate?.split('T')[0] || '',
          actualDeliveryDate: data.actualDeliveryDate?.split('T')[0] || '',
          location: data.location || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/delivery/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedDeliveryDate: formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate) : undefined,
          actualDeliveryDate: formData.actualDeliveryDate ? new Date(formData.actualDeliveryDate) : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin/delivery');
      }
    } catch (error) {
      console.error('Failed to update delivery:', error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Delivery not found</p>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Update Delivery</h1>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={delivery.orderId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={delivery.trackingNumber}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <Input
            label="Estimated Delivery Date"
            type="date"
            value={formData.estimatedDeliveryDate}
            onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
          />

          <Input
            label="Actual Delivery Date"
            type="date"
            value={formData.actualDeliveryDate}
            onChange={(e) => setFormData({ ...formData, actualDeliveryDate: e.target.value })}
          />

          <Input
            label="Current Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={updating}>
              Update Delivery
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
