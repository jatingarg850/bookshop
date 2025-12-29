'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface TrackingData {
  awb_code: string;
  order_id: string;
  shipment_status: string;
  current_status: string;
  scans: Array<{
    date: string;
    status: string;
    activity: string;
    location: string;
  }>;
}

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTrack() {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTracking(null);

      const res = await fetch(`/api/shiprocket/track?awb=${trackingNumber}`);

      if (!res.ok) {
        throw new Error('Tracking number not found');
      }

      const data = await res.json();
      setTracking(data.tracking);
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'bg-green-100 text-green-700';
    if (statusLower.includes('failed')) return 'bg-red-100 text-red-700';
    if (statusLower.includes('transit')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="container-max py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back Home
          </Button>
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600 mb-8">
          Enter your tracking number to see the latest status of your shipment.
        </p>

        <Card className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter tracking number (AWB)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              className="flex-1"
            />
            <Button onClick={handleTrack} disabled={loading}>
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {tracking && (
          <div className="space-y-6">
            {/* Status Summary */}
            <Card>
              <h2 className="font-semibold text-lg mb-4">Shipment Status</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">AWB Number</p>
                  <p className="font-mono font-bold">{tracking.awb_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-bold">{tracking.order_id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(tracking.shipment_status)}`}>
                  {tracking.shipment_status}
                </span>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h2 className="font-semibold text-lg mb-6">Tracking Timeline</h2>
              <div className="space-y-4">
                {tracking.scans && tracking.scans.length > 0 ? (
                  tracking.scans.map((scan, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                        {idx < tracking.scans.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">{scan.activity}</p>
                        <p className="text-sm text-gray-600">{scan.location}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(scan.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No tracking updates yet</p>
                )}
              </div>
            </Card>

            {/* Additional Info */}
            <Card>
              <h2 className="font-semibold text-lg mb-4">Additional Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Latest Update</p>
                  <p className="font-semibold">{tracking.current_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Scanned</p>
                  <p className="font-semibold">
                    {tracking.scans && tracking.scans.length > 0
                      ? new Date(tracking.scans[0].date).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!tracking && !error && (
          <Card className="text-center py-12">
            <p className="text-gray-600">
              Enter your tracking number above to view shipment details
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
