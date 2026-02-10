'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { calculateOrderTax } from '@/lib/utils/shippingCalculator';

interface Address {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  // All hooks must be declared at the top level BEFORE any conditional returns
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [taxBreakdown, setTaxBreakdown] = useState<any>(null);
  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);
  const [pincodeError, setPincodeError] = useState<string>('');

  // Define fetchProductDetailsCallback before using it in useEffect
  const fetchProductDetailsCallback = useCallback(async () => {
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
        if (settings) {
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
        }
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
  }, [items, settings]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    fetchSettings();
    if (session?.user?.email) {
      fetchSavedAddresses();
    }
  }, [session?.user?.email]);

  // Fetch product details for tax calculation
  useEffect(() => {
    if (items.length > 0 && settingsLoaded && settings) {
      fetchProductDetailsCallback();
    }
  }, [items.length, settingsLoaded, fetchProductDetailsCallback]);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        // Set default payment method based on enabled methods
        if (data.enableCOD) {
          setPaymentMethod('cod');
        } else if (data.enableRazorpay) {
          setPaymentMethod('razorpay');
        } else if (data.enableUPI) {
          setPaymentMethod('upi');
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setSettingsLoaded(true);
    }
  }

  async function fetchSavedAddresses() {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setUseNewAddress(false);
          const defaultAddr = data.addresses.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
            populateFormFromAddress(defaultAddr);
          } else {
            setSelectedAddressId(data.addresses[0]._id);
            populateFormFromAddress(data.addresses[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  }

  function populateFormFromAddress(address: Address) {
    setFormData({
      name: address.name,
      email: session?.user?.email || '',
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
  }

  async function validatePincode(pincode: string) {
    if (!pincode || pincode.length < 5) {
      setPincodeValid(false);
      setPincodeError('Pincode must be at least 5 digits');
      return false;
    }

    try {
      setPincodeValidating(true);
      setPincodeError('');
      
      const res = await fetch('/api/shiprocket/check-serviceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_pincode: pincode }),
      });

      const data = await res.json();
      
      if (data.serviceable) {
        setPincodeValid(true);
        setPincodeError('');
        return true;
      } else {
        setPincodeValid(false);
        setPincodeError(data.message || 'This pincode is not serviceable');
        return false;
      }
    } catch (error: any) {
      setPincodeValid(false);
      setPincodeError(error.message || 'Failed to validate pincode');
      return false;
    } finally {
      setPincodeValidating(false);
    }
  }

  function handleSelectAddress(addressId: string) {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((a) => a._id === addressId);
    if (address) {
      populateFormFromAddress(address);
    }
  }

  const shippingCost = settings ? (subtotal > settings.freeShippingAbove ? 0 : settings.shippingCost) : 50;
  const gstRate = settings?.gstRate || 18;
  
  // Use calculated tax breakdown if available, otherwise use simple calculation
  const tax = taxBreakdown?.totalTax || (subtotal * gstRate) / 100;
  const cgst = taxBreakdown?.totalCGST || 0;
  const sgst = taxBreakdown?.totalSGST || 0;
  const igst = taxBreakdown?.totalIGST || 0;
  
  const total = subtotal + shippingCost + tax;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate payment method is enabled
    if (paymentMethod === 'razorpay' && !settings?.enableRazorpay) {
      setError('Razorpay payment is not available');
      setLoading(false);
      return;
    }

    if (paymentMethod === 'cod' && !settings?.enableCOD) {
      setError('Cash on Delivery is not available');
      setLoading(false);
      return;
    }

    if (paymentMethod === 'upi' && !settings?.enableUPI) {
      setError('UPI payment is not available');
      setLoading(false);
      return;
    }

    // Validate pincode serviceability BEFORE creating order
    const isPincodeServiceable = await validatePincode(formData.pincode);
    if (!isPincodeServiceable) {
      setError(pincodeError || 'Delivery location is not serviceable. Please try another pincode.');
      setLoading(false);
      return;
    }

    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping: formData,
          paymentMethod,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData?.error || 'Failed to create order');
      }
      const orderId = orderData.orderId;

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const paymentRes = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: total,
          }),
        });

        const paymentData = await paymentRes.json();
        if (!paymentRes.ok) {
          throw new Error(paymentData?.error || 'Failed to create payment order');
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(total * 100),
            currency: 'INR',
            name: 'Radhe Stationery',
            description: 'Order Payment',
            order_id: paymentData.orderId,
            handler: async (response: any) => {
              try {
                const verifyRes = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });

                if (verifyRes.ok) {
                  clearCart();
                  router.push(`/order-confirmation/${orderId}`);
                } else {
                  setError('Payment verification failed');
                }
              } catch (err) {
                setError('Payment verification error');
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      } else {
        // COD - just redirect to confirmation
        clearCart();
        router.push(`/order-confirmation/${orderId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  // Early returns AFTER all hooks are declared
  if (status === 'loading') {
    return (
      <div className="container-max py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container-max py-12">
        <p className="text-center text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container-max py-12" suppressHydrationWarning>
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleCheckout} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <h2 className="font-heading text-xl font-bold mb-4">Shipping Address</h2>

                {/* Saved Addresses */}
                {settingsLoaded && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
                      <input
                        type="radio"
                        checked={!useNewAddress}
                        onChange={() => setUseNewAddress(false)}
                      />
                      <span className="font-semibold">Use Saved Address</span>
                    </label>

                    {!useNewAddress && (
                      <div className="space-y-2 ml-6 mb-4">
                        {savedAddresses.map((address) => (
                          <label
                            key={address._id}
                            className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              checked={selectedAddressId === address._id}
                              onChange={() => handleSelectAddress(address._id)}
                            />
                            <div className="flex-1">
                              <p className="font-semibold">{address.name}</p>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                              <p className="text-sm text-gray-600">
                                {address.address}, {address.city}, {address.state} {address.pincode}
                              </p>
                              {address.isDefault && (
                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded mt-1 inline-block">
                                  Default
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                      />
                      <span className="font-semibold">Use New Address</span>
                    </label>
                  </div>
                )}

                {/* Address Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="City"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="Pincode"
                    required
                    value={formData.pincode}
                    onChange={(e) => {
                      setFormData({ ...formData, pincode: e.target.value });
                      setPincodeValid(null); // Reset validation on change
                    }}
                    onBlur={() => {
                      if (formData.pincode) {
                        validatePincode(formData.pincode);
                      }
                    }}
                  />
                  {pincodeValidating && (
                    <p className="text-sm text-blue-600 mt-1">Checking serviceability...</p>
                  )}
                  {pincodeValid === false && (
                    <p className="text-sm text-red-600 mt-1">❌ {pincodeError}</p>
                  )}
                  {pincodeValid === true && (
                    <p className="text-sm text-green-600 mt-1">✓ Pincode is serviceable</p>
                  )}
                </div>
                <Input
                  label="Address"
                  required
                  className="mt-4"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold mb-4">Payment Method</h2>
                {!settingsLoaded ? (
                  <p className="text-gray-600">Loading payment options...</p>
                ) : !settings?.enableRazorpay && !settings?.enableCOD ? (
                  <p className="text-red-600 font-semibold">No payment methods available. Please contact support.</p>
                ) : (
                  <div className="space-y-3">
                    {settings?.enableRazorpay && (
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod' | 'upi')}
                        />
                        <span className="font-semibold">Razorpay (Card, UPI, Wallet)</span>
                      </label>
                    )}
                    {settings?.enableCOD && (
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod' | 'upi')}
                        />
                        <span className="font-semibold">Cash on Delivery</span>
                      </label>
                    )}
                    {settings?.enableUPI && (
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod' | 'upi')}
                        />
                        <span className="font-semibold">
                          UPI (Manual Transfer{settings?.upiId ? `: ${settings.upiId}` : ''})
                        </span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" isLoading={loading} className="w-full">
                {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 mb-4">
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
                  <span>GST ({gstRate}%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
