'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ShippingRate {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  etd: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<number | null>(null);
  const [shipping, setShipping] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        fetchDelivery(data.order._id);
        if (data.order.orderStatus === 'confirmed') {
          fetchShippingRates(data.order);
        }
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDelivery(orderId: string) {
    try {
      const res = await fetch(`/api/admin/delivery/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setDelivery(data.delivery);
      }
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
    }
  }

  async function fetchShippingRates(order: any) {
    try {
      setLoadingRates(true);
      const res = await fetch('/api/shiprocket/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_postcode: process.env.NEXT_PUBLIC_STORE_PINCODE || '110001',
          delivery_postcode: order.shippingDetails.pincode,
          weight: calculateWeight(order.items),
          cod: order.payment.method === 'cod' ? 1 : 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShippingRates(data.rates || []);
      }
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
    } finally {
      setLoadingRates(false);
    }
  }

  async function handleShipOrder() {
    if (!selectedCourier) {
      alert('Please select a courier');
      return;
    }

    try {
      setShipping(true);

      // First create order in Shiprocket
      const createRes = await fetch('/api/shiprocket/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!createRes.ok) {
        const error = await createRes.json();
        throw new Error(error.error || 'Failed to create Shiprocket order');
      }

      // Then ship the order
      const shipRes = await fetch('/api/shiprocket/orders/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          courierId: selectedCourier,
        }),
      });

      if (shipRes.ok) {
        const data = await shipRes.json();
        alert(`Order shipped successfully!\nAWB: ${data.awb}`);
        fetchOrder();
      } else {
        const error = await shipRes.json();
        throw new Error(error.error || 'Failed to ship order');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setShipping(false);
    }
  }

  async function handleTrackOrder() {
    if (!delivery?.shiprocketAWB) {
      alert('No tracking number available');
      return;
    }

    try {
      const res = await fetch(`/api/shiprocket/track?awb=${delivery.shiprocketAWB}`);
      if (res.ok) {
        const data = await res.json();
        alert(`Tracking updated!\nStatus: ${data.tracking.shipment_status}`);
        fetchDelivery(order._id);
      }
    } catch (error) {
      alert('Failed to track order');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Loading...</p>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Order not found</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/orders">
          <Button variant="outline" className="mb-6">
            ← Back to Orders
          </Button>
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-6">Order Details</h1>

        {/* Order Info */}
        <Card className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-bold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize">{order.orderStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-bold text-lg">₹{order.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold capitalize">{order.payment.method}</p>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Items</h2>
          <div className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.sku && <p className="text-sm text-gray-600">SKU: {item.sku}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.priceAtPurchase}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
          <p className="font-semibold">{order.shippingDetails.name}</p>
          <p className="text-sm text-gray-600">{order.shippingDetails.address}</p>
          <p className="text-sm text-gray-600">
            {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}
          </p>
          <p className="text-sm text-gray-600">Phone: {order.shippingDetails.phone}</p>
          <p className="text-sm text-gray-600">Email: {order.shippingDetails.email}</p>
        </Card>

        {/* Shipping Options */}
        {order.orderStatus === 'confirmed' && !order.shiprocketAWB && (
          <Card className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Ship Order</h2>

            {loadingRates ? (
              <p className="text-gray-600">Loading shipping rates...</p>
            ) : shippingRates.length === 0 ? (
              <p className="text-gray-600">No shipping rates available</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {shippingRates.map((rate) => (
                    <label key={rate.courier_company_id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="courier"
                        value={rate.courier_company_id}
                        checked={selectedCourier === rate.courier_company_id}
                        onChange={(e) => setSelectedCourier(Number(e.target.value))}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{rate.courier_name}</p>
                        <p className="text-sm text-gray-600">₹{rate.rate} • {rate.etd} days</p>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  onClick={handleShipOrder}
                  disabled={shipping || !selectedCourier}
                  className="w-full"
                >
                  {shipping ? 'Shipping...' : 'Ship Order'}
                </Button>
              </>
            )}
          </Card>
        )}

        {/* Delivery Status */}
        {delivery && (
          <Card>
            <h2 className="font-semibold text-lg mb-4">Delivery Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-mono font-bold">{delivery.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-semibold">{delivery.carrier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">{delivery.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{delivery.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Delivery</p>
                <p className="font-semibold">
                  {new Date(delivery.estimatedDeliveryDate).toLocaleDateString()}
                </p>
              </div>
              {delivery.shiprocketAWB && (
                <Button
                  onClick={handleTrackOrder}
                  variant="outline"
                  className="w-full mt-4"
                >
                  🔄 Update Tracking
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

function calculateWeight(items: any[]): number {
  const defaultWeightPerItem = 0.5;
  return items.reduce((total, item) => total + item.quantity * defaultWeightPerItem, 0);
}
