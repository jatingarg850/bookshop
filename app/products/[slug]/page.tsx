'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProductCard } from '@/components/products/ProductCard';
import { ReviewSection } from '@/components/products/ReviewSection';

export default function ProductPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'specifications' | 'features'>('overview');
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  // Fetch product + related from the Mongo-backed API.
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setProduct(null);
      setRelated([]);
      setError('');
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || `Failed to fetch product (${res.status})`);
        }

        if (cancelled) return;
        setProduct(data?.product || null);
        setRelated(Array.isArray(data?.related) ? data.related : []);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error(err);
        if (!cancelled) {
          setProduct(null);
          setRelated([]);
          setError(err?.message || 'Failed to load product');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedVariation(null);
  }, [slug]);

  function handleAddToCart() {
    if (!product || !mounted) return;

    const price = selectedVariation?.price || product.discountPrice || product.price;
    addItem({
      productId: product._id.toString(),
      name: product.name + (selectedVariation ? ` (${selectedVariation.color || ''} ${selectedVariation.size || ''})`.trim() : ''),
      price: product.price,
      discountPrice: price !== product.price ? price : product.discountPrice,
      quantity,
      image: product.images[0]?.url || '',
      slug: product.slug,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <div className="container-max py-12"><p className="text-center text-gray-600">Product not found</p></div>;
  }

  const displayPrice = selectedVariation?.price || product.discountPrice || product.price;
  const hasDiscount = (product.discountPrice && product.discountPrice < product.price) || 
                      (selectedVariation?.price && selectedVariation.price < product.price);
  const discountPercent = hasDiscount ? Math.round(((product.price - displayPrice) / product.price) * 100) : 0;
  const currentStock = selectedVariation?.quantity ?? product.stock;
  const minQty = product.minOrderQuantity || 1;
  const maxQty = product.maxOrderQuantity || currentStock;

  const hasSpecifications = product.specifications && Object.keys(product.specifications).length > 0;
  const hasFeatures = product.features && product.features.length > 0;

  // Check if product has images
  const hasImages = product.images && product.images.length > 0;
  const productImages = hasImages ? product.images : [];
  const currentImage = productImages[selectedImage] || null;

  return (
    <div className="container-max py-12">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 h-96 relative">
            {currentImage ? (
              <Image 
                src={currentImage.url} 
                alt={currentImage.alt || product.name}
                fill 
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              // Text-only placeholder for products without authentic covers
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500">Authentic NCERT Book Cover Coming Soon</p>
                <p className="text-xs text-gray-400 mt-2">We only display verified textbook covers</p>
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNewArrival && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">NEW</span>}
              {product.isBestSeller && <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">BESTSELLER</span>}
              {product.isFeatured && <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">FEATURED</span>}
            </div>
            {hasDiscount && <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">-{discountPercent}%</span>}
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((img: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-primary-600' : 'border-gray-200'}`}>
                  <Image 
                    src={img.url} 
                    alt={img.alt || `${product.name} ${idx}`} 
                    width={80} 
                    height={80} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">{product.category}</span>
            {product.subcategory && <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{product.subcategory}</span>}
            {product.brand && <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{product.brand}</span>}
          </div>

          <h1 className="font-heading text-3xl font-bold mb-2">{product.name}</h1>
          {product.manufacturer && <p className="text-sm text-gray-600 mb-3">by <span className="font-semibold">{product.manufacturer}</span></p>}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">₹{displayPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                <span className="text-lg font-bold text-green-600">Save {discountPercent}%</span>
              </>
            )}
          </div>
          {product.retailPrice && product.retailPrice > product.price && (
            <p className="text-sm text-gray-500 mb-4">MRP: <span className="line-through">₹{product.retailPrice}</span></p>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {currentStock > 0 ? (
              <p className="text-green-600 font-semibold">✓ In Stock ({currentStock} available)</p>
            ) : (
              <p className="text-red-600 font-semibold">✗ Out of Stock</p>
            )}
          </div>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Variant:</p>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v: any, idx: number) => (
                  <button key={idx} onClick={() => setSelectedVariation(v)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedVariation === v ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 hover:border-gray-400'
                    } ${v.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={v.quantity === 0}>
                    {v.color && <span>{v.color}</span>}
                    {v.color && v.size && <span> / </span>}
                    {v.size && <span>{v.size}</span>}
                    {v.price && <span className="ml-2 text-primary-600">₹{v.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {currentStock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(minQty, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-lg">−</button>
                  <span className="px-4 py-2 font-semibold min-w-[50px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} className="px-4 py-2 hover:bg-gray-100 text-lg">+</button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" onClick={handleAddToCart} className="flex-1">
                  {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
                </Button>
                <Link href="/cart">
                  <Button size="lg" variant="outline">View Cart</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold text-gray-700 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Link key={tag} href={`/products?search=${encodeURIComponent(tag)}`}>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-12">
        <div className="border-b mb-6">
          <div className="flex gap-6 overflow-x-auto">
            <button onClick={() => setActiveTab('overview')}
              className={`pb-3 font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('details')}
              className={`pb-3 font-semibold whitespace-nowrap ${activeTab === 'details' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Product Details
            </button>
            {hasSpecifications && (
              <button onClick={() => setActiveTab('specifications')}
                className={`pb-3 font-semibold whitespace-nowrap ${activeTab === 'specifications' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
                Specifications
              </button>
            )}
            {hasFeatures && (
              <button onClick={() => setActiveTab('features')}
                className={`pb-3 font-semibold whitespace-nowrap ${activeTab === 'features' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
                Features
              </button>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{product.description}</p>
          </div>
        )}

        {/* Product Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <h3 className="font-heading text-lg font-bold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.sku && <div><span className="text-gray-500">SKU:</span> <span className="font-mono font-semibold">{product.sku}</span></div>}
                {product.hsn && <div><span className="text-gray-500">HSN Code:</span> <span className="font-mono font-semibold">{product.hsn}</span></div>}
                {product.brand && <div><span className="text-gray-500">Brand:</span> <span className="font-semibold">{product.brand}</span></div>}
                {product.manufacturer && <div><span className="text-gray-500">Manufacturer:</span> <span className="font-semibold">{product.manufacturer}</span></div>}
              </div>
            </Card>

            {/* Category & Pricing */}
            <Card>
              <h3 className="font-heading text-lg font-bold mb-4">Category & Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.category && <div><span className="text-gray-500">Category:</span> <span className="font-semibold">{product.category}</span></div>}
                {product.subcategory && <div><span className="text-gray-500">Sub Category:</span> <span className="font-semibold">{product.subcategory}</span></div>}
                <div><span className="text-gray-500">Price:</span> <span className="font-semibold">₹{product.price}</span></div>
                {product.retailPrice && <div><span className="text-gray-500">Retail Price:</span> <span className="font-semibold">₹{product.retailPrice}</span></div>}
                {product.discountPrice && <div><span className="text-gray-500">Discount Price:</span> <span className="font-semibold">₹{product.discountPrice}</span></div>}
                <div><span className="text-gray-500">Stock:</span> <span className="font-semibold">{product.stock}</span></div>
                {product.quantityPerItem && product.quantityPerItem > 1 && <div><span className="text-gray-500">Qty per Item:</span> <span className="font-semibold">{product.quantityPerItem} {product.unit || 'pieces'}</span></div>}
                {product.status && <div><span className="text-gray-500">Status:</span> <span className="font-semibold capitalize">{product.status}</span></div>}
              </div>
            </Card>

            {/* Product Details */}
            <Card>
              <h3 className="font-heading text-lg font-bold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.color && <div><span className="text-gray-500">Color:</span> <span className="font-semibold">{product.color}</span></div>}
                {product.size && <div><span className="text-gray-500">Size:</span> <span className="font-semibold">{product.size}</span></div>}
                {product.material && <div><span className="text-gray-500">Material:</span> <span className="font-semibold">{product.material}</span></div>}
                {product.weight && <div><span className="text-gray-500">Weight:</span> <span className="font-semibold">{product.weight} {product.weightUnit || 'g'}</span></div>}
                {product.warranty && <div><span className="text-gray-500">Warranty:</span> <span className="font-semibold">{product.warranty}</span></div>}
                {product.countryOfOrigin && <div><span className="text-gray-500">Country of Origin:</span> <span className="font-semibold">{product.countryOfOrigin}</span></div>}
                {product.minOrderQuantity && product.minOrderQuantity > 1 && <div><span className="text-gray-500">Min Order Qty:</span> <span className="font-semibold">{product.minOrderQuantity}</span></div>}
                {product.maxOrderQuantity && <div><span className="text-gray-500">Max Order Qty:</span> <span className="font-semibold">{product.maxOrderQuantity}</span></div>}
              </div>
            </Card>

            {/* Dimensions */}
            {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height || product.dimensions.breadth) && (
              <Card>
                <h3 className="font-heading text-lg font-bold mb-4">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.dimensions.length && <div><span className="text-gray-500">Length:</span> <span className="font-semibold">{product.dimensions.length} {product.dimensions.unit || 'cm'}</span></div>}
                  {product.dimensions.width && <div><span className="text-gray-500">Width:</span> <span className="font-semibold">{product.dimensions.width} {product.dimensions.unit || 'cm'}</span></div>}
                  {product.dimensions.height && <div><span className="text-gray-500">Height:</span> <span className="font-semibold">{product.dimensions.height} {product.dimensions.unit || 'cm'}</span></div>}
                  {product.dimensions.breadth && <div><span className="text-gray-500">Breadth:</span> <span className="font-semibold">{product.dimensions.breadth} {product.dimensions.unit || 'cm'}</span></div>}
                </div>
              </Card>
            )}

            {/* GST Rates */}
            
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && hasSpecifications && (
          <Card>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                  <span className="font-semibold text-gray-700">{key}</span>
                  <span className="text-gray-600">{value as string}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && hasFeatures && (
          <Card>
            <ul className="space-y-3">
              {product.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700 text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Variations Details */}
      {product.variations && product.variations.length > 0 && (
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6">Available Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.variations.map((v: any, idx: number) => (
              <Card key={idx} className={v.quantity === 0 ? 'opacity-50 bg-gray-50' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {v.color && <p className="font-semibold">{v.color}</p>}
                    {v.size && <p className="text-sm text-gray-600">Size: {v.size}</p>}
                  </div>
                  {v.price && <span className="text-lg font-bold text-primary-600">₹{v.price}</span>}
                </div>
                {v.sku && <p className="text-xs text-gray-500 font-mono mb-2">SKU: {v.sku}</p>}
                <p className={`text-sm ${v.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {v.quantity > 0 ? `${v.quantity} in stock` : 'Out of stock'}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t pt-12 mb-12">
          <h2 className="font-heading text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod._id.toString()} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <ReviewSection productSlug={slug} />
    </div>
  );
}
