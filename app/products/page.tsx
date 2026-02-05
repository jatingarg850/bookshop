'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // Filters: default values that don't exclude products
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(''); // empty means no min
  const [maxPrice, setMaxPrice] = useState(''); // empty means no max
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All', 'Books', 'Stationery', 'Art', 'Craft']);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 12;
  const currentPage = Math.min(page, pages);
  const visibleProducts = items;

  const hasActiveFilters =
    search.trim() !== '' ||
    (category && category !== 'All') ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '' ||
    inStock ||
    onSale;

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setOnSale(false);
    setSort('newest');
    setPage(1);
  };

  // Sync URL query params -> filter state (one-way)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlMinPrice = searchParams.get('minPrice') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '';
    const urlInStock = searchParams.get('inStock') === 'true';
    const urlOnSale = searchParams.get('onSale') === 'true';

    const guessedCategory = urlCategory
      ? urlCategory.slice(0, 1).toUpperCase() + urlCategory.slice(1).toLowerCase()
      : '';

    const normalizedCategory = urlCategory
      ? categories.find((c) => c.toLowerCase() === urlCategory.toLowerCase()) ||
        categories.find((c) => c.toLowerCase() === guessedCategory.toLowerCase()) ||
        guessedCategory ||
        'All'
      : 'All';

    setSearch((prev) => (prev === urlSearch ? prev : urlSearch));
    setCategory((prev) => (prev === normalizedCategory ? prev : normalizedCategory));
    setMinPrice((prev) => (prev === urlMinPrice ? prev : urlMinPrice));
    setMaxPrice((prev) => (prev === urlMaxPrice ? prev : urlMaxPrice));
    setInStock((prev) => (prev === urlInStock ? prev : urlInStock));
    setOnSale((prev) => (prev === urlOnSale ? prev : urlOnSale));
    setPage(1);
  }, [searchParamsString, categories]);

  // Fetch products from Mongo-backed API
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams();

        if (search.trim()) params.set('search', search.trim());
        if (category && category !== 'All') params.set('category', category);
        if (minPrice.trim()) params.set('minPrice', minPrice.trim());
        if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
        if (inStock) params.set('inStock', 'true');
        if (onSale) params.set('onSale', 'true');
        if (sort) params.set('sort', sort);

        params.set('page', String(page));
        params.set('limit', String(limit));

        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Failed to fetch products (${res.status})`);
        }

        if (cancelled) return;

        setItems(Array.isArray(data.products) ? data.products : []);

        const nextTotal = Number(data?.pagination?.total || 0);
        const nextPages = Math.max(1, Number(data?.pagination?.pages || 1));
        setTotal(nextTotal);
        setPages(nextPages);

        const apiCategories = data?.filters?.categories;
        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          setCategories(['All', ...apiCategories]);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error(err);
        if (!cancelled) {
          setItems([]);
          setTotal(0);
          setPages(1);
          setError(err?.message || 'Failed to fetch products');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(run, search.trim() ? 250 : 0);

    return () => {
      cancelled = true;
      clearTimeout(t);
      controller.abort();
    };
  }, [search, category, minPrice, maxPrice, inStock, onSale, sort, page]);

  // If API reduced page count (e.g. after filters), clamp locally.
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            <span className="block">Our</span>
            <span className="block text-primary-600">Products</span>
          </h1>
          <p className="mt-3 text-gray-600">Explore our complete collection of {total} products</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <div className="mb-8">
            <Input
              placeholder="🔍 Search products by name or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full text-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPage(1);
                      }}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPage(1);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => {
                          setInStock(e.target.checked);
                          setPage(1);
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => {
                          setOnSale(e.target.checked);
                          setPage(1);
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">{error}</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Reset filters
                  </button>
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Clear filters and try again
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Showing {visibleProducts.length} of {total} products
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {visibleProducts.map((product) => (
                      <ProductCard key={String((product as any)._id)} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                        const p = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                        if (p < 1 || p > pages) return null;
                        return (
                          <Button
                            key={p}
                            variant={currentPage === p ? 'primary' : 'outline'}
                            onClick={() => setPage(p)}
                            size="sm"
                          >
                            {p}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        disabled={currentPage === pages}
                        onClick={() => setPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
