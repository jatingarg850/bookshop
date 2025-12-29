'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InvoiceTemplate } from '@/components/invoice/InvoiceTemplate';

interface OrderConfirmationProps {
  params: { id: string };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const [order, setOrder] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        fetchInvoice(data.order._id);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
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
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Invoice</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('h1 { text-align: center; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin: 20px 0; }');
        printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
        printWindow.document.write('th { background-color: #f2f2f2; }');
        printWindow.document.write('.total { font-weight: bold; font-size: 16px; }');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-max py-12" suppressHydrationWarning>
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="font-heading text-3xl font-bold mb-2 text-green-600">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you an email confirmation shortly.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-bold text-lg">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg text-primary-600">₹{order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold capitalize">{order.payment.status}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {order.shippingDetails.name}<br />
                  {order.shippingDetails.address}<br />
                  {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}
                </p>
              </div>
            </div>
          )}

          {invoice && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-2xl font-bold">Invoice</h2>
                <div className="flex gap-2">
                  <Button onClick={handlePrint} variant="outline">
                    🖨️ Print Invoice
                  </Button>
                  <Button 
                    onClick={() => window.open(`/api/invoices/${params.id}/download`, '_blank')}
                    variant="outline"
                  >
                    📥 Download Invoice
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <InvoiceTemplate ref={printRef} data={invoice} />
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link href="/account/orders">
              <Button>View My Orders</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
