'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { printHtml } from '@/lib/utils/print';

export default function AdminInvoicePage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetchInvoice(id);
  }, [id]);

  async function fetchInvoice(invoiceId: string) {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data.invoice);
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    if (!printRef.current) return;
    printHtml(printRef.current.innerHTML, 'Invoice');
  }

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Loading...</p>
      </AdminLayout>
    );
  }

  if (!invoice) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Invoice not found</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto" suppressHydrationWarning>
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-heading text-3xl font-bold">Invoice Details</h1>
          <Button onClick={handlePrint}>
            🖨️ Print Invoice
          </Button>
        </div>

        <div ref={printRef} className="bg-white border border-gray-300 rounded-lg p-8">
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
              <p className="text-sm">{invoice.shippingDetails.name}</p>
              <p className="text-sm">{invoice.shippingDetails.address}</p>
              <p className="text-sm">{invoice.shippingDetails.city}, {invoice.shippingDetails.state} {invoice.shippingDetails.pincode}</p>
              <p className="text-sm">Email: {invoice.shippingDetails.email}</p>
              <p className="text-sm">Phone: {invoice.shippingDetails.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-4 rounded">
            <div>
              <p className="text-sm"><strong>Invoice Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Order ID:</strong> {invoice.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm"><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
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
              {invoice.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2">{item.name}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">₹{item.priceAtPurchase}</td>
                  <td className="text-right py-2">₹{item.total}</td>
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
      </div>
    </AdminLayout>
  );
}
