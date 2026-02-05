'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import { calculateOrderTax } from '@/lib/utils/shippingCalculator';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [taxBreakdown, setTaxBreakdown] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  // Fetch product details and calculate tax when items or settings change
  useEffect(() => {
    if (items.length > 0 && settings) {
      fetchProductDetails();
    }
  }, [items.length, settings]);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }

  async function fetchProductDetails() {
    try {
      const productIds = items.map((item) => item.productId).join(',');
      const res = await fetch(`/api/products/batch?ids=${productIds}`);
      if (res.ok) {
        const data = await res.json();
        
        const detailsMap: any = {};
        data.products.forEach((product: any) => {
          detailsMap[product._id] = product;
          if (product.externalId) detailsMap[product.externalId] = product;
        });

        // Calculate tax breakdown with product-level rates
        const itemsWithTax = items.map((item) => {
          const product = detailsMap[item.productId];
          return {
            productId: item.productId,
            priceAtPurchase: item.discountPrice || item.price,
            quantity: item.quantity,
            cgst: product?.cgst,
            sgst: product?.sgst,
            igst: product?.igst,
          };
        });

        const breakdown = calculateOrderTax(itemsWithTax, settings.gstRate || 18);
        setTaxBreakdown(breakdown);

        // Calculate shipping cost
        calculateShipping(detailsMap);
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
  }

  function calculateShipping(detailsMap: any) {
    // Calculate total weight in grams
    let totalWeightGrams = 0;
    let totalVolume = 0;

    items.forEach((item) => {
      const product = detailsMap[item.productId];
      if (!product) return;

      // Calculate weight in grams
      let weightKg = 0;
      if (product.weight) {
        const conversions: Record<string, number> = {
          'g': 0.001,
          'kg': 1,
          'mg': 0.000001,
          'oz': 0.0283495,
          'lb': 0.453592,
        };
        const unit = product.weightUnit || 'g';
        weightKg = product.weight * (conversions[unit] || 0.001);
      }

      // Calculate volumetric weight
      if (product.dimensions?.length && product.dimensions?.width && product.dimensions?.height) {
        const unit = product.dimensions.unit || 'cm';
        const conversions: Record<string, number> = {
          'cm': 1,
          'mm': 0.1,
          'in': 2.54,
          'm': 100,
        };
        const multiplier = conversions[unit] || 1;
        const length = product.dimensions.length * multiplier;
        const width = product.dimensions.width * multiplier;
        const height = product.dimensions.height * multiplier;
        const volumetricWeightKg = (length * width * height) / 5000 / 1000;
        weightKg = Math.max(weightKg, volumetricWeightKg);
      }

      totalWeightGrams += weightKg * 1000 * item.quantity;

      // Calculate volume
      if (product.dimensions?.length && product.dimensions?.width && product.dimensions?.height) {
        const unit = product.dimensions.unit || 'cm';
        const conversions: Record<string, number> = {
          'cm': 1,
          'mm': 0.1,
          'in': 2.54,
          'm': 100,
        };
        const multiplier = conversions[unit] || 1;
        const length = product.dimensions.length * multiplier;
        const width = product.dimensions.width * multiplier;
        const height = product.dimensions.height * multiplier;
        totalVolume += length * width * height * item.quantity;
      }
    });

    // Calculate shipping cost based on weight and dimension rates
    let cost = settings.shippingCost || 50;

    // Check free shipping
    if (subtotal >= (settings.freeShippingAbove || 500)) {
      cost = 0;
    } else {
      // Check weight-based rates
      if (settings.weightBasedRates && settings.weightBasedRates.length > 0) {
        for (const rate of settings.weightBasedRates) {
          if (totalWeightGrams >= rate.minWeight && totalWeightGrams <= rate.maxWeight) {
            cost = rate.cost;
            break;
          }
        }
        // If weight exceeds all ranges, use the last rate
        if (totalWeightGrams > settings.weightBasedRates[settings.weightBasedRates.length - 1].maxWeight) {
          cost = settings.weightBasedRates[settings.weightBasedRates.length - 1].cost;
        }
      }

      // Check dimension-based rates if no weight rate matched
      if (settings.dimensionBasedRates && settings.dimensionBasedRates.length > 0 && cost === (settings.shippingCost || 50)) {
        for (const rate of settings.dimensionBasedRates) {
          if (totalVolume >= rate.minVolume && totalVolume <= rate.maxVolume) {
            cost = rate.cost;
            break;
          }
        }
        // If volume exceeds all ranges, use the last rate
        if (totalVolume > settings.dimensionBasedRates[settings.dimensionBasedRates.length - 1].maxVolume) {
          cost = settings.dimensionBasedRates[settings.dimensionBasedRates.length - 1].cost;
        }
      }
    }

    setShippingCost(cost);
  }

  const tax = taxBreakdown?.totalTax || (subtotal * (settings?.gstRate || 18)) / 100;
  const cgst = taxBreakdown?.totalCGST || 0;
  const sgst = taxBreakdown?.totalSGST || 0;
  const igst = taxBreakdown?.totalIGST || 0;
  const total = subtotal + shippingCost + tax;

  if (!mounted) {
    return (
      <div className="container-max py-16">
        <p className="text-center text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-max py-16">
        <div className="text-center">
          <img src="/cart.png" alt="Empty Cart" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="font-heading text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{item.discountPrice || item.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              {shippingCost === 0 && (
                <p className="text-xs text-green-600">Free shipping on orders above ₹{settings?.freeShippingAbove || 500}</p>
              )}
              {cgst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>CGST</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
              )}
              {sgst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>SGST</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              )}
              {igst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>IGST</span>
                  <span>₹{igst.toFixed(2)}</span>
                </div>
              )}
              {cgst === 0 && sgst === 0 && igst === 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>GST ({settings?.gstRate || 18}%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full mb-3">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
