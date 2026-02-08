'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchInvoices();
  }, [search, page]);

  async function fetchInvoices() {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/invoices?${params}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold mb-8">Invoices</h1>

      <Card className="mb-6">
        <Input
          placeholder="Search by invoice number or order ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Card>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-center text-gray-600">No invoices found</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {invoices.map((invoice) => (
              <Card key={invoice._id}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Invoice: {invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Order: {invoice.orderId}</p>
                    <p className="text-sm text-gray-600">
                      Customer: {invoice.shippingDetails.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary-600">
                      ₹{invoice.totalAmount}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                      invoice.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.paymentStatus}
                    </span>
                    <Link href={`/admin/invoices/${invoice._id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        View
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
