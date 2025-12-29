'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, brand, color, size, minPrice, maxPrice, inStock, onSale, rating, sort, page]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories?limit=100&parentId=null');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (color) params.append('color', color);
      if (size) params.append('size', size);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (inStock) params.append('inStock', 'true');
      if (onSale) params.append('onSale', 'true');
      if (rating) params.append('rating', rating);
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.pagination.total);
      if (data.filters) {
        setBrands(data.filters.brands || []);
        setColors(data.filters.colors || []);
        setSizes(data.filters.sizes || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);
  const hasActiveFilters = search || category || brand || color || size || minPrice || maxPrice || inStock || onSale || rating;

  const clearAllFilters = () => {
    setSearch(''); setCategory(''); setBrand(''); setColor(''); setSize('');
    setMinPrice(''); setMaxPrice(''); setInStock(false); setOnSale(false);
    setRating(''); setSort('-createdAt'); setPage(1);
  };

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
            <Input placeholder="🔍 Search products by name, brand, description..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full text-lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Clear All</button>
                  )}
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Sort By</label>
                  <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="-createdAt">Newest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-rating">Highest Rated</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Category</label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                {brands.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200"></div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Brand</label>
                      <select value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">All Brands</option>
                        {brands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Color */}
                {colors.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200"></div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Color</label>
                      <select value={color} onChange={(e) => { setColor(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">All Colors</option>
                        {colors.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Size */}
                {sizes.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200"></div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Size</label>
                      <select value={size} onChange={(e) => { setSize(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">All Sizes</option>
                        {sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="h-px bg-gray-200"></div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className="text-sm" />
                    <Input type="number" placeholder="Max" value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className="text-sm" />
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1); }} className="rounded" />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={onSale} onChange={(e) => { setOnSale(e.target.checked); setPage(1); }} className="rounded" />
                      <span className="text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Minimum Rating</label>
                  <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Any Rating</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="2">2★ & above</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-4">
              {loading ? (
                <div className="text-center py-12"><p className="text-gray-600">Loading products...</p></div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found</p>
                  <button onClick={clearAllFilters} className="mt-4 text-primary-600 hover:text-primary-700 font-semibold">
                    Clear filters and try again
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">Showing {products.length} of {total} products</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <ProductCard key={product._id.toString()} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                      {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                        const p = page <= 3 ? i + 1 : page + i - 2;
                        if (p < 1 || p > pages) return null;
                        return (
                          <Button key={p} variant={page === p ? 'primary' : 'outline'} onClick={() => setPage(p)} size="sm">{p}</Button>
                        );
                      })}
                      <Button variant="outline" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
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
