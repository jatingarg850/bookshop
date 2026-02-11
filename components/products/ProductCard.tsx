'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id?: string | { toString(): string };
    name: string;
    slug: string;
    description: string;
    category: string;
    price: number;
    retailPrice?: number;
    discountPrice?: number;
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    quantityPerItem?: number;
    unit?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  // Check if product has images
  const hasImages = product.images && product.images.length > 0;
  const imageUrl = hasImages ? product.images[0].url : null;
  const imageAlt = hasImages ? (product.images[0].alt || product.name) : product.name;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={imageAlt}
              fill 
              className="object-cover hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            // Text-only placeholder for products without authentic covers
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm font-semibold text-gray-700">{product.name}</p>
              <p className="text-xs text-gray-500 mt-2">Cover Image Coming Soon</p>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">NEW</span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">BESTSELLER</span>
            )}
            {product.isFeatured && (
              <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-bold">FEATURED</span>
            )}
          </div>
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
          )}

          <h3 className="font-heading font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}

          <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Pack Info */}
          {product.quantityPerItem && product.quantityPerItem > 1 && (
            <p className="text-xs text-gray-500 mb-2">Pack of {product.quantityPerItem} {product.unit || 'pieces'}</p>
          )}

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600">₹{displayPrice}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              )}
            </div>
            {product.retailPrice && product.retailPrice > product.price && (
              <p className="text-xs text-gray-500">MRP: ₹{product.retailPrice}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded font-medium">{product.category}</span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
