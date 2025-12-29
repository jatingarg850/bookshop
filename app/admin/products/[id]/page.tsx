'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Variation {
  color: string;
  size: string;
  quantity: number;
  sku: string;
  price: number | string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [specifications, setSpecifications] = useState<{key: string; value: string}[]>([]);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  useEffect(() => {
    if (categorySearch.trim()) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categorySearch, categories]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setUploadedImages(data.images || []);
        setVariations(data.variations || []);
        setFeatures(data.features || []);
        if (data.specifications) {
          const specs = Object.entries(data.specifications).map(([key, value]) => ({ key, value: value as string }));
          setSpecifications(specs);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories?limit=100');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  function handleSelectCategory(category: Category) {
    if (formData) {
      setFormData({ ...formData, category: category.slug });
      setCategorySearch(category.name);
      setShowCategoryDropdown(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          setError(`Image "${file.name}" is too large. Maximum is 5MB.`);
          continue;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formDataToSend });
        if (res.ok) {
          const data = await res.json();
          setUploadedImages((prev) => [...prev, { url: data.secure_url, alt: file.name }]);
        }
      }
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) { setUploadedImages((prev) => prev.filter((_, i) => i !== index)); }
  function addVariation() { setVariations([...variations, { color: '', size: '', quantity: 0, sku: '', price: '' }]); }
  function updateVariation(index: number, field: keyof Variation, value: any) {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  }
  function removeVariation(index: number) { setVariations(variations.filter((_, i) => i !== index)); }
  function addFeature() { if (newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature(''); } }
  function removeFeature(index: number) { setFeatures(features.filter((_, i) => i !== index)); }
  function addSpecification() { setSpecifications([...specifications, { key: '', value: '' }]); }
  function updateSpecification(index: number, field: 'key' | 'value', value: string) {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  }
  function removeSpecification(index: number) { setSpecifications(specifications.filter((_, i) => i !== index)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    setError('');

    try {
      if (uploadedImages.length === 0) {
        setError('Please upload at least one image');
        setSaving(false);
        return;
      }

      const specsObject: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key.trim()) specsObject[spec.key.trim()] = spec.value.trim();
      });

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price?.toString() || '0'),
          retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice.toString()) : undefined,
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice.toString()) : undefined,
          stock: parseInt(formData.stock?.toString() || '0'),
          tags: Array.isArray(formData.tags) ? formData.tags : formData.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          images: uploadedImages,
          rating: formData.rating ? parseFloat(formData.rating.toString()) : undefined,
          reviewCount: formData.reviewCount ? parseInt(formData.reviewCount.toString()) : undefined,
          quantityPerItem: formData.quantityPerItem ? parseInt(formData.quantityPerItem.toString()) : 1,
          weight: formData.weight ? parseFloat(formData.weight.toString()) : undefined,
          minOrderQuantity: formData.minOrderQuantity ? parseInt(formData.minOrderQuantity.toString()) : 1,
          maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity.toString()) : undefined,
          dimensions: formData.dimensions ? {
            length: formData.dimensions.length ? parseFloat(formData.dimensions.length.toString()) : undefined,
            width: formData.dimensions.width ? parseFloat(formData.dimensions.width.toString()) : undefined,
            height: formData.dimensions.height ? parseFloat(formData.dimensions.height.toString()) : undefined,
            breadth: formData.dimensions.breadth ? parseFloat(formData.dimensions.breadth.toString()) : undefined,
            unit: formData.dimensions.unit || 'cm',
          } : undefined,
          cgst: formData.cgst ? parseFloat(formData.cgst.toString()) : undefined,
          sgst: formData.sgst ? parseFloat(formData.sgst.toString()) : undefined,
          igst: formData.igst ? parseFloat(formData.igst.toString()) : undefined,
          variations: variations.map(v => ({
            ...v,
            quantity: parseInt(String(v.quantity)) || 0,
            price: v.price ? parseFloat(String(v.price)) : undefined,
          })),
          features,
          specifications: Object.keys(specsObject).length > 0 ? specsObject : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <AdminLayout><p className="text-center text-gray-600">Loading product...</p></AdminLayout>;
  }

  if (!formData) {
    return <AdminLayout><p className="text-center text-red-600">{error || 'Product not found'}</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl font-bold mb-8">Edit Product</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="SKU" disabled value={formData.sku || ''} />
                      <Input label="HSN Code" value={formData.hsn || ''} onChange={(e) => setFormData({ ...formData, hsn: e.target.value })} />
                    </div>
                    <Input label="Product Name" required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Slug" required value={formData.slug || ''} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Brand" value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                      <Input label="Manufacturer" value={formData.manufacturer || ''} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows={4} />
                </div>

                {/* Category & Pricing */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Category & Pricing</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Input placeholder="Search category..." value={categorySearch}
                        onChange={(e) => { setCategorySearch(e.target.value); setShowCategoryDropdown(true); }}
                        onFocus={() => setShowCategoryDropdown(true)} />
                      {showCategoryDropdown && filteredCategories.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {filteredCategories.map((category) => (
                            <button key={category._id} type="button" onClick={() => handleSelectCategory(category)}
                              className="w-full text-left px-4 py-2 hover:bg-primary-50 border-b border-gray-100 last:border-b-0">
                              <p className="font-semibold text-gray-900">{category.name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                      {formData.category && categorySearch && (
                        <p className="text-xs text-green-600 mt-1">✓ Category selected: {categorySearch}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Price (₹)" type="number" required value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                      <Input label="Retail Price (₹)" type="number" value={formData.retailPrice || ''} onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })} />
                      <Input label="Discount Price (₹)" type="number" value={formData.discountPrice || ''} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Stock" type="number" required value={formData.stock || ''} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                      <Input label="Qty per Item" type="number" value={formData.quantityPerItem || ''} onChange={(e) => setFormData({ ...formData, quantityPerItem: e.target.value })} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <select value={formData.unit || 'piece'} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="piece">Piece</option><option value="pack">Pack</option><option value="box">Box</option>
                          <option value="set">Set</option><option value="dozen">Dozen</option><option value="kg">Kg</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select value={formData.status || 'draft'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Product Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Color" value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                      <Input label="Size" value={formData.size || ''} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Material" value={formData.material || ''} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                      <Input label="Country of Origin" value={formData.countryOfOrigin || ''} onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Weight" type="number" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight Unit</label>
                        <select value={formData.weightUnit || 'g'} onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="g">Grams</option><option value="kg">Kilograms</option><option value="ml">Milliliters</option><option value="l">Liters</option>
                        </select>
                      </div>
                      <Input label="Warranty" value={formData.warranty || ''} onChange={(e) => setFormData({ ...formData, warranty: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Min Order Qty" type="number" value={formData.minOrderQuantity || ''} onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })} />
                      <Input label="Max Order Qty" type="number" value={formData.maxOrderQuantity || ''} onChange={(e) => setFormData({ ...formData, maxOrderQuantity: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Dimensions (Optional)</h2>
                  <div className="grid grid-cols-5 gap-4">
                    <Input label="Length" type="number" step="0.01" value={formData.dimensions?.length || ''} 
                      onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: e.target.value } })} />
                    <Input label="Width" type="number" step="0.01" value={formData.dimensions?.width || ''} 
                      onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: e.target.value } })} />
                    <Input label="Height" type="number" step="0.01" value={formData.dimensions?.height || ''} 
                      onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: e.target.value } })} />
                    <Input label="Breadth" type="number" step="0.01" value={formData.dimensions?.breadth || ''} 
                      onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, breadth: e.target.value } })} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <select value={formData.dimensions?.unit || 'cm'} 
                        onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, unit: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="cm">cm</option><option value="mm">mm</option><option value="in">inches</option><option value="m">meters</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* GST Rates */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">GST Rates (Optional)</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter GST rates in percentage. Leave empty to use store default.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="CGST (%)" type="number" step="0.01" min="0" max="100" value={formData.cgst || ''} 
                      onChange={(e) => setFormData({ ...formData, cgst: e.target.value })} placeholder="e.g., 9" />
                    <Input label="SGST (%)" type="number" step="0.01" min="0" max="100" value={formData.sgst || ''} 
                      onChange={(e) => setFormData({ ...formData, sgst: e.target.value })} placeholder="e.g., 9" />
                    <Input label="IGST (%)" type="number" step="0.01" min="0" max="100" value={formData.igst || ''} 
                      onChange={(e) => setFormData({ ...formData, igst: e.target.value })} placeholder="e.g., 18" />
                  </div>
                </div>

                {/* Variations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading text-xl font-bold">Variations</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addVariation}>+ Add</Button>
                  </div>
                  {variations.length > 0 && (
                    <div className="space-y-3">
                      {variations.map((v, idx) => (
                        <div key={idx} className="grid grid-cols-6 gap-2 items-end bg-gray-50 p-3 rounded-lg">
                          <Input label="Color" value={v.color} onChange={(e) => updateVariation(idx, 'color', e.target.value)} />
                          <Input label="Size" value={v.size} onChange={(e) => updateVariation(idx, 'size', e.target.value)} />
                          <Input label="Qty" type="number" value={v.quantity} onChange={(e) => updateVariation(idx, 'quantity', e.target.value)} />
                          <Input label="SKU" value={v.sku} onChange={(e) => updateVariation(idx, 'sku', e.target.value)} />
                          <Input label="Price" type="number" value={v.price} onChange={(e) => updateVariation(idx, 'price', e.target.value)} />
                          <Button type="button" variant="outline" size="sm" onClick={() => removeVariation(idx)}>✕</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Features</h2>
                  <div className="flex gap-2 mb-3">
                    <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                    <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((f, idx) => (
                        <span key={idx} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {f}<button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-600">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading text-xl font-bold">Specifications</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addSpecification}>+ Add</Button>
                  </div>
                  {specifications.length > 0 && (
                    <div className="space-y-2">
                      {specifications.map((spec, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                          <div className="col-span-2"><Input label="Key" value={spec.key} onChange={(e) => updateSpecification(idx, 'key', e.target.value)} /></div>
                          <div className="col-span-2"><Input label="Value" value={spec.value} onChange={(e) => updateSpecification(idx, 'value', e.target.value)} /></div>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(idx)}>✕</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags & Flags */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Tags & Visibility</h2>
                  <Input label="Tags (comma-separated)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="mb-4" />
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isFeatured || false} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isNewArrival || false} onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })} />
                      <span className="text-sm font-medium">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isBestSeller || false} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} />
                      <span className="text-sm font-medium">Best Seller</span>
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Rating & Reviews</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Rating (0-5)" type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                    <Input label="Review Count" type="number" min="0" value={formData.reviewCount || ''} onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })} />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button type="submit" isLoading={saving}>Save Product</Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Images */}
          <div>
            <Card>
              <h2 className="font-heading text-xl font-bold mb-4">Product Images</h2>
              <label className="block mb-4">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500">
                  <p className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                </div>
              </label>
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                      </div>
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
