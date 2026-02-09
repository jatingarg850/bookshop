'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';

function ProductsContent() {
  const searchParams = useSearchParams();

  // Filters: default values that don't exclude products
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(''); // empty means no min
  const [maxPrice, setMaxPrice] = useState(''); // empty means no max
  const [minPriceInput, setMinPriceInput] = useState(''); // for input display
  const [maxPriceInput, setMaxPriceInput] = useState(''); // for input display
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
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStock(false);
    setOnSale(false);
    setSort('newest');
    setPage(1);
  };

  // Debounce price inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Debounce timer fired:', { minPriceInput, maxPriceInput });
      setMinPrice(minPriceInput);
      setMaxPrice(maxPriceInput);
      if (minPriceInput || maxPriceInput) {
        console.log('Setting page to 1 due to price change');
        setPage(1);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [minPriceInput, maxPriceInput]);

  // Sync URL query params -> filter state (one-way) - ONLY on mount
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

    if (urlSearch) setSearch(urlSearch);
    if (urlCategory) setCategory(normalizedCategory);
    if (urlMinPrice) setMinPrice(urlMinPrice);
    if (urlMaxPrice) setMaxPrice(urlMaxPrice);
    if (urlInStock) setInStock(urlInStock);
    if (urlOnSale) setOnSale(urlOnSale);
    // Don't reset page here - let user control pagination
  }, []); // Only run once on mount

  // Fetch products from Mongo-backed API
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError('');

        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });

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

        console.log('Fetching products with params:', {
          page,
          limit,
          search,
          category,
          minPrice,
          maxPrice,
          inStock,
          onSale,
          sort,
          url: `/api/products?${params.toString()}`
        });

        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Failed to fetch products (${res.status})`);
        }

        if (cancelled) return;

        console.log('API Response:', {
          productsCount: data.products?.length,
          total: data.pagination?.total,
          page: data.pagination?.page,
          pages: data.pagination?.pages,
          firstProduct: data.products?.[0]?.name,
          lastProduct: data.products?.[data.products?.length - 1]?.name
        });

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

    const t = setTimeout(run, 0);

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
                      console.log('Category changed to:', e.target.value);
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
                      value={minPriceInput}
                      onChange={(e) => {
                        console.log('Min price input changed to:', e.target.value);
                        setMinPriceInput(e.target.value);
                      }}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => {
                        console.log('Max price input changed to:', e.target.value);
                        setMaxPriceInput(e.target.value);
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={(p) => {
                      console.log('Page changed to:', p);
                      setPage(p);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              <span className="block">Our</span>
              <span className="block text-primary-600">Products</span>
            </h1>
            <p className="mt-3 text-gray-600">Loading products...</p>
          </div>
        </section>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
