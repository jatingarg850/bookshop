'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { printHtml } from '@/lib/utils/print';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user?.email || !orderId) return;
    fetchOrder(orderId);
  }, [session?.user?.email, orderId]);

  async function fetchOrder(id: string) {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        fetchInvoice(data.order._id);
        fetchDelivery(data.order._id);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDelivery(orderId: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}/delivery`);
      if (res.ok) {
        const data = await res.json();
        setDelivery(data.delivery);
      }
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
    }
  }

  async function fetchInvoice(orderId: string) {
    try {
      const res = await fetch(`/api/invoices/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data.invoice);
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    }
  }

  function handlePrint() {
    if (!printRef.current) return;
    printHtml(printRef.current.innerHTML, 'Invoice');
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Order Details</h1>
        <div className="flex gap-3">
          {invoice && (
            <>
              <Button variant="outline" onClick={() => setShowInvoice(!showInvoice)}>
                {showInvoice ? 'Hide Invoice' : '📄 View Invoice'}
              </Button>
              <Button onClick={handlePrint}>
                🖨️ Print Invoice
              </Button>
            </>
          )}
          <Link href="/account/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="font-heading text-xl font-bold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono font-bold">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-semibold capitalize">{order.orderStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold capitalize">{order.payment.status}</p>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="font-heading text-xl font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-heading text-xl font-bold mb-4">Shipping Address</h2>
            <p className="text-gray-700">
              {order.shippingDetails.name}<br />
              {order.shippingDetails.address}<br />
              {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}<br />
              Phone: {order.shippingDetails.phone}
            </p>
          </Card>

          {/* Delivery Status */}
          {delivery && (
            <Card className="mt-6">
              <h2 className="font-heading text-xl font-bold mb-4">Delivery Status</h2>
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
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{order.shippingCost?.toFixed(2) || '0.00'}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toFixed(2) || '0.00'}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Section */}
      {showInvoice && invoice && (
        <div className="mt-8">
          <Card>
            <div ref={printRef} className="bg-white p-8">
              <div className="text-center mb-6">
                {invoice.storeLogo && (
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={invoice.storeLogo} 
                      alt="Store Logo" 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold">INVOICE</h1>
                <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">From:</h3>
                  <p className="text-sm font-semibold">Radhe Stationery</p>
                  <p className="text-sm">Contact: support@radhestationery.com</p>
                  <p className="text-sm">Phone: +91-XXXXXXXXXX</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold mb-2">Bill To:</h3>
                  <p className="text-sm">{invoice.shippingDetails?.name}</p>
                  <p className="text-sm">{invoice.shippingDetails?.address}</p>
                  <p className="text-sm">{invoice.shippingDetails?.city}, {invoice.shippingDetails?.state} {invoice.shippingDetails?.pincode}</p>
                  <p className="text-sm">Email: {invoice.shippingDetails?.email}</p>
                  <p className="text-sm">Phone: {invoice.shippingDetails?.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-4 rounded">
                <div>
                  <p className="text-sm"><strong>Invoice Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Order ID:</strong> {invoice.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm"><strong>Payment Method:</strong> {invoice.paymentMethod?.toUpperCase()}</p>
                  <p className="text-sm"><strong>Payment Status:</strong> {invoice.paymentStatus}</p>
                </div>
              </div>

              <table className="w-full mb-6 border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-2">{item.name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">₹{item.priceAtPurchase}</td>
                      <td className="text-right py-2">₹{item.total || (item.priceAtPurchase * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t border-gray-300">
                    <span>Subtotal:</span>
                    <span>₹{invoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Shipping:</span>
                    <span>₹{invoice.shippingCost}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>₹{invoice.tax}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{invoice.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 border-t pt-4">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
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
