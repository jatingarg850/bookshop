'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

type ProductStatus = 'active' | 'inactive' | 'draft';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [search, status, page]);

  async function fetchProducts() {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'all') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/admin/products/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setImportError('Failed to export products');
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMessage('');
    setImportError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Starting import for file:', file.name);

      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      console.log('Import response status:', res.status);

      const data = await res.json();
      console.log('Import response data:', data);

      if (res.ok) {
        setImportMessage(data.message);
        console.log('Import successful:', data.results);
        fetchProducts();
        setTimeout(() => setImportMessage(''), 5000);
      } else {
        setImportError(data.error || 'Import failed');
        console.error('Import error:', data.error);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import products');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  const pages = Math.ceil(total / limit);

  const getStatusBadge = (status: ProductStatus | undefined) => {
    const badges: Record<ProductStatus, { bgColor: string; textColor: string; label: string }> = {
      active: { bgColor: '#dcfce7', textColor: '#166534', label: '✓ Active' },
      inactive: { bgColor: '#fef3c7', textColor: '#92400e', label: '⚠ Inactive' },
      draft: { bgColor: '#f3f4f6', textColor: '#374151', label: '✎ Draft' },
    };
    
    const normalizedStatus = (status || 'draft') as ProductStatus;
    const badge = badges[normalizedStatus] || badges.draft;
    
    return (
      <span 
        style={{
          backgroundColor: badge.bgColor,
          color: badge.textColor,
          padding: '0.5rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            📥 Export CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
          <Button 
            variant="outline" 
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            {importing ? 'Importing...' : '📤 Import CSV'}
          </Button>
          <Link href="/admin/products/new">
            <Button>+ Add Product</Button>
          </Link>
        </div>
      </div>

      {importMessage && (
        <Card className="mb-6 bg-green-50 border border-green-200">
          <p className="text-green-700">✓ {importMessage}</p>
        </Card>
      )}

      {importError && (
        <Card className="mb-6 bg-red-50 border border-red-200">
          <p className="text-red-700">✗ {importError}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Input
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Card>
        <Card>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ProductStatus | 'all');
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">✓ Active</option>
            <option value="inactive">⚠ Inactive</option>
            <option value="draft">✎ Draft</option>
          </select>
        </Card>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {products.map((product) => (
              <Card key={product._id}>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      SKU: {product.sku} • {product.category} • Stock: {product.stock} • ₹{product.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (confirm('Delete this product?')) {
                          await fetch(`/api/admin/products/${product._id}`, {
                            method: 'DELETE',
                          });
                          fetchProducts();
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'primary' : 'outline'}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
