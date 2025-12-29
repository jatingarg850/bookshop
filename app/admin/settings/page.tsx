'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    supportEmail: '',
    supportPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    enableCOD: false,
    enableRazorpay: true,
    shippingCost: 50,
    freeShippingAbove: 500,
    gstRate: 18,
    storeAddress: '',
    storeCity: '',
    storeState: '',
    storePincode: '',
    logoUrl: '',
    weightBasedRates: [] as Array<{ minWeight: number; maxWeight: number; cost: number }>,
    dimensionBasedRates: [] as Array<{ minVolume: number; maxVolume: number; cost: number }>,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          storeName: data.storeName || '',
          supportEmail: data.supportEmail || '',
          supportPhone: data.supportPhone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          enableCOD: data.enableCOD ?? false,
          enableRazorpay: data.enableRazorpay ?? true,
          shippingCost: data.shippingCost ?? 50,
          freeShippingAbove: data.freeShippingAbove ?? 500,
          gstRate: data.gstRate ?? 18,
          storeAddress: data.storeAddress || '',
          storeCity: data.storeCity || '',
          storeState: data.storeState || '',
          storePincode: data.storePincode || '',
          logoUrl: data.logoUrl || '',
          weightBasedRates: data.weightBasedRates || [],
          dimensionBasedRates: data.dimensionBasedRates || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Ensure numeric fields are numbers
      const dataToSend = {
        ...formData,
        gstRate: parseFloat(String(formData.gstRate || 18)),
        shippingCost: parseFloat(String(formData.shippingCost || 50)),
        freeShippingAbove: parseFloat(String(formData.freeShippingAbove || 500)),
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, logoUrl: data.secure_url });
        alert('Logo uploaded successfully!');
      } else {
        alert('Failed to upload logo');
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold mb-8">Store Settings</h1>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Store Information</h2>
            <div className="space-y-4">
              <Input
                label="Store Name"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
              <Input
                label="Support Email"
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              />
              <Input
                label="Support Phone"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Store Logo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo for Invoices
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <p className="text-sm font-semibold text-gray-700">
                        {uploading ? 'Uploading...' : 'Click to upload logo'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB (recommended: 200x100px)
                      </p>
                    </div>
                  </label>
                  {formData.logoUrl && (
                    <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={formData.logoUrl} alt="Store Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Address</h2>
            <div className="space-y-4">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Store Address (For Invoices)</h2>
            <div className="space-y-4">
              <Input
                label="Store Address"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Store City"
                  value={formData.storeCity}
                  onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
                />
                <Input
                  label="Store State"
                  value={formData.storeState}
                  onChange={(e) => setFormData({ ...formData, storeState: e.target.value })}
                />
              </div>
              <Input
                label="Store Pincode"
                value={formData.storePincode}
                onChange={(e) => setFormData({ ...formData, storePincode: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Tax Settings</h2>
            <div className="space-y-4">
              <Input
                label="GST Rate (%)"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">
                GST will be calculated on the subtotal and added to the invoice
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Shipping Settings</h2>
            <div className="space-y-4">
              <Input
                label="Shipping Cost (₹)"
                type="number"
                step="1"
                min="0"
                value={formData.shippingCost}
                onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Free Shipping Above (₹)"
                type="number"
                step="1"
                min="0"
                value={formData.freeShippingAbove}
                onChange={(e) => setFormData({ ...formData, freeShippingAbove: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">
                Orders above this amount will have free shipping
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-heading text-lg font-bold mb-4">Weight-Based Shipping Rates (kg)</h3>
              <div className="space-y-3 mb-4">
                {formData.weightBasedRates.map((rate, idx) => (
                  <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                    <Input
                      label="Min Weight (kg)"
                      type="number"
                      step="0.1"
                      min="0"
                      value={rate.minWeight}
                      onChange={(e) => {
                        const newRates = [...formData.weightBasedRates];
                        newRates[idx].minWeight = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, weightBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Input
                      label="Max Weight (kg)"
                      type="number"
                      step="0.1"
                      min="0"
                      value={rate.maxWeight}
                      onChange={(e) => {
                        const newRates = [...formData.weightBasedRates];
                        newRates[idx].maxWeight = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, weightBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Input
                      label="Cost (₹)"
                      type="number"
                      step="1"
                      min="0"
                      value={rate.cost}
                      onChange={(e) => {
                        const newRates = [...formData.weightBasedRates];
                        newRates[idx].cost = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, weightBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newRates = formData.weightBasedRates.filter((_, i) => i !== idx);
                        setFormData({ ...formData, weightBasedRates: newRates });
                      }}
                      className="px-3"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    weightBasedRates: [...formData.weightBasedRates, { minWeight: 0, maxWeight: 1, cost: 50 }],
                  });
                }}
              >
                Add Weight Rate
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-heading text-lg font-bold mb-4">Dimension-Based Shipping Rates (cm³)</h3>
              <div className="space-y-3 mb-4">
                {formData.dimensionBasedRates.map((rate, idx) => (
                  <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                    <Input
                      label="Min Volume (cm³)"
                      type="number"
                      step="100"
                      min="0"
                      value={rate.minVolume}
                      onChange={(e) => {
                        const newRates = [...formData.dimensionBasedRates];
                        newRates[idx].minVolume = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, dimensionBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Input
                      label="Max Volume (cm³)"
                      type="number"
                      step="100"
                      min="0"
                      value={rate.maxVolume}
                      onChange={(e) => {
                        const newRates = [...formData.dimensionBasedRates];
                        newRates[idx].maxVolume = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, dimensionBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Input
                      label="Cost (₹)"
                      type="number"
                      step="1"
                      min="0"
                      value={rate.cost}
                      onChange={(e) => {
                        const newRates = [...formData.dimensionBasedRates];
                        newRates[idx].cost = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, dimensionBasedRates: newRates });
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newRates = formData.dimensionBasedRates.filter((_, i) => i !== idx);
                        setFormData({ ...formData, dimensionBasedRates: newRates });
                      }}
                      className="px-3"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    dimensionBasedRates: [...formData.dimensionBasedRates, { minVolume: 0, maxVolume: 1000, cost: 50 }],
                  });
                }}
              >
                Add Dimension Rate
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-heading text-xl font-bold mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.enableRazorpay}
                  onChange={(e) => setFormData({ ...formData, enableRazorpay: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Enable Razorpay (Online Payment)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.enableCOD}
                  onChange={(e) => setFormData({ ...formData, enableCOD: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Enable Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-4">
            <Button type="submit" isLoading={saving}>
              Save Settings
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchSettings()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}
