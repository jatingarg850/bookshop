'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function ShiprocketTestPage() {
  const [pickupPostcode, setPickupPostcode] = useState('121006');
  const [deliveryPostcode, setDeliveryPostcode] = useState('203201');
  const [weight, setWeight] = useState('1.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPincodes = [
    { name: 'Delhi (110001)', code: '110001' },
    { name: 'Bangalore (560001)', code: '560001' },
    { name: 'Mumbai (400001)', code: '400001' },
    { name: 'Hyderabad (500001)', code: '500001' },
    { name: 'Pune (411001)', code: '411001' },
    { name: 'Noida (201301)', code: '201301' },
    { name: 'Gurgaon (122001)', code: '122001' },
    { name: 'Kolkata (700001)', code: '700001' },
    { name: 'Chennai (600001)', code: '600001' },
    { name: 'Ahmedabad (380001)', code: '380001' },
  ];

  async function testRoute() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch('/api/shiprocket/test-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_postcode: pickupPostcode,
          delivery_postcode: deliveryPostcode,
          weight: parseFloat(weight),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to test route');
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Error testing route');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/orders">
          <Button variant="outline" className="mb-6">
            ← Back to Orders
          </Button>
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-6">Shiprocket Route Tester</h1>

        <Card className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Test Shipping Route</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Postcode</label>
                <Input
                  type="text"
                  value={pickupPostcode}
                  onChange={(e) => setPickupPostcode(e.target.value)}
                  placeholder="e.g., 121006"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Postcode</label>
                <Input
                  type="text"
                  value={deliveryPostcode}
                  onChange={(e) => setDeliveryPostcode(e.target.value)}
                  placeholder="e.g., 203201"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="1.0"
                  step="0.1"
                  min="0.1"
                />
              </div>
            </div>

            <Button onClick={testRoute} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Route'}
            </Button>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Quick Test Pincodes</h2>
          <div className="grid grid-cols-2 gap-2">
            {testPincodes.map((pincode) => (
              <button
                key={pincode.code}
                onClick={() => {
                  setDeliveryPostcode(pincode.code);
                }}
                className="p-2 text-left border rounded hover:bg-gray-50 transition"
              >
                <p className="font-medium text-sm">{pincode.name}</p>
              </button>
            ))}
          </div>
        </Card>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <p className="text-red-700 font-semibold">Error</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
          </Card>
        )}

        {result && (
          <Card className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Test Result</h2>
            
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-sm text-gray-600">
                <strong>Route:</strong> {result.pickup_postcode} → {result.delivery_postcode}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Weight:</strong> {result.weight} kg
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {result.success ? '✅ Success' : '❌ Failed'}
              </p>
              {result.message && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Message:</strong> {result.message}
                </p>
              )}
            </div>

            {result.rates && result.rates.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-3">Available Couriers</h3>
                <div className="space-y-2">
                  {result.rates.map((rate: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded">
                      <p className="font-semibold">{rate.courier_name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{rate.rate} • {rate.etd} days
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 font-semibold">No couriers available</p>
                <p className="text-yellow-600 text-sm mt-1">
                  This route may not be serviceable by Shiprocket. Try a different delivery pincode.
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
