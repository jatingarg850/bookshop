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
  const [rateError, setRateError] = useState<string | null>(null);
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
      setRateError(null);
      
      const weight = calculateWeight(order.items);
      const pickup_postcode = process.env.NEXT_PUBLIC_STORE_PINCODE || '110001';
      const delivery_postcode = order.shippingDetails.pincode;
      
      console.log('Calculating shipping rates:', {
        weight,
        pickup_postcode,
        delivery_postcode,
        payment_method: order.payment.method,
        total_items: order.items.length,
      });

      if (!weight || weight <= 0) {
        setRateError(`Invalid weight calculated: ${weight}. Please check order items.`);
        console.error('Invalid weight:', weight);
        return;
      }

      if (!delivery_postcode || delivery_postcode.length !== 6) {
        setRateError(`Invalid delivery pincode: ${delivery_postcode}. Must be 6 digits.`);
        console.error('Invalid pincode:', delivery_postcode);
        return;
      }

      const payload = {
        pickup_postcode,
        delivery_postcode,
        weight,
        cod: order.payment.method === 'cod' ? 1 : 0,
      };

      console.log('Requesting shipping rates with payload:', payload);

      const res = await fetch('/api/shiprocket/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Received shipping rates:', data);
        
        if (data.rates && data.rates.length > 0) {
          setShippingRates(data.rates);
        } else {
          setRateError(data.warning || 'No shipping rates available for this location.');
          console.warn('No rates in response:', data);
        }
      } else {
        try {
          const errorData = await res.json();
          const errorMsg = errorData?.error || errorData?.message || 'Failed to fetch shipping rates';
          setRateError(errorMsg);
          if (typeof errorData === 'object' && errorData !== null) {
            console.error('API error response:', errorData);
          }
        } catch (parseError) {
          console.error('Failed to parse error response');
          setRateError('Server error: Invalid response format');
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch shipping rates';
      setRateError(errorMsg);
      console.error('Fetch error:', error);
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
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin">⏳</div>
                <p>Loading shipping rates...</p>
              </div>
            ) : rateError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-semibold">⚠️ Unable to fetch shipping rates</p>
                <p className="text-red-600 text-sm mt-1">{rateError}</p>
                <p className="text-red-600 text-xs mt-2">
                  <strong>Debug info:</strong> Check browser console (F12) for detailed logs. Verify:
                </p>
                <ul className="text-red-600 text-xs mt-1 ml-4 list-disc">
                  <li>Delivery pincode is valid (6 digits): {order.shippingDetails.pincode}</li>
                  <li>Pickup location ID is set: {process.env.NEXT_PUBLIC_STORE_PINCODE || '110001'}</li>
                  <li>Shiprocket credentials are correct in .env.local</li>
                  <li>Server logs show authentication succeeded</li>
                </ul>
              </div>
            ) : shippingRates.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700 font-semibold">⚠️ No shipping rates available</p>
                <p className="text-yellow-600 text-sm mt-1">
                  This may mean Shiprocket doesn't service the delivery location.
                </p>
              </div>
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
          <Card className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Delivery Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono font-bold text-lg">
                    {delivery.trackingNumber || 'Not assigned yet'}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadgeColor(delivery.status || 'pending')}`}>
                  {formatStatus(delivery.status || 'pending')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <p className="font-semibold">{delivery.carrier || 'To be assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Delivery</p>
                  <p className="font-semibold">
                    {delivery.estimatedDeliveryDate
                      ? new Date(delivery.estimatedDeliveryDate).toLocaleDateString()
                      : 'TBD'}
                  </p>
                </div>
              </div>

              {delivery.actualDeliveryDate && (
                <div>
                  <p className="text-sm text-gray-600">Delivered On</p>
                  <p className="font-semibold text-green-600">
                    {new Date(delivery.actualDeliveryDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {delivery.location && (
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-semibold">{delivery.location}</p>
                </div>
              )}

              {delivery.notes && (
                <div>
                  <p className="text-sm text-gray-600">Latest Update</p>
                  <p className="font-semibold">{delivery.notes}</p>
                </div>
              )}

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
  if (!items || items.length === 0) return 0;
  
  // Use item weight if available, otherwise default to 0.5kg per item
  const defaultWeightPerItem = 0.5;
  const totalWeight = items.reduce((total, item) => {
    const itemWeight = item.weight || defaultWeightPerItem;
    return total + itemWeight * item.quantity;
  }, 0);

  console.log('Weight Calculation:', {
    items_count: items.length,
    total_weight: totalWeight,
    items_details: items.map(i => ({
      name: i.name,
      qty: i.quantity,
      weight: i.weight || defaultWeightPerItem,
      total: (i.weight || defaultWeightPerItem) * i.quantity,
    })),
  });

  return totalWeight;
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'out_for_delivery':
      return 'bg-blue-100 text-blue-700';
    case 'in_transit':
      return 'bg-blue-100 text-blue-700';
    case 'picked_up':
      return 'bg-yellow-100 text-yellow-700';
    case 'pending':
      return 'bg-gray-100 text-gray-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
