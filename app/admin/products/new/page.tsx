'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  price: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [specifications, setSpecifications] = useState<{key: string; value: string}[]>([]);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    slug: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    retailPrice: '',
    discountPrice: '',
    stock: '',
    tags: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
    rating: '',
    reviewCount: '',
    // New fields
    hsn: '',
    brand: '',
    manufacturer: '',
    quantityPerItem: '1',
    unit: 'piece',
    weight: '',
    weightUnit: 'g',
    material: '',
    color: '',
    size: '',
    warranty: '',
    countryOfOrigin: 'India',
    minOrderQuantity: '1',
    maxOrderQuantity: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    // Dimensions
    length: '',
    width: '',
    height: '',
    breadth: '',
    dimensionUnit: 'cm',
    // GST
    cgst: '',
    sgst: '',
    igst: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySearch.trim()) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.slug.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categorySearch, categories]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories?limit=100&parentId=null');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchSubcategories(categoryId: string) {
    try {
      const res = await fetch(`/api/admin/categories?limit=100&parentId=${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        setSubcategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  }

  function handleSelectCategory(category: Category) {
    setFormData({ ...formData, category: category.slug, subcategory: '' });
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
    fetchSubcategories(category._id);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setError(`Image "${file.name}" is too large. Maximum is 5MB.`);
          continue;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        if (res.ok) {
          const data = await res.json();
          setUploadedImages((prev) => [...prev, { url: data.secure_url, alt: file.name }]);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Image upload failed');
        }
      }
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addVariation() {
    setVariations([...variations, { color: '', size: '', quantity: 0, sku: '', price: '' }]);
  }

  function updateVariation(index: number, field: keyof Variation, value: string | number) {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  }

  function removeVariation(index: number) {
    setVariations(variations.filter((_, i) => i !== index));
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index));
  }

  function addSpecification() {
    setSpecifications([...specifications, { key: '', value: '' }]);
  }

  function updateSpecification(index: number, field: 'key' | 'value', value: string) {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  }

  function removeSpecification(index: number) {
    setSpecifications(specifications.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (uploadedImages.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      if (!formData.category) {
        setError('Please select a category');
        setLoading(false);
        return;
      }

      const specsObject: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key.trim()) {
          specsObject[spec.key.trim()] = spec.value.trim();
        }
      });

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sku: formData.sku || undefined,
          price: parseFloat(formData.price),
          retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice) : undefined,
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
          stock: parseInt(formData.stock),
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          images: uploadedImages,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : undefined,
          quantityPerItem: formData.quantityPerItem ? parseInt(formData.quantityPerItem) : 1,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          minOrderQuantity: formData.minOrderQuantity ? parseInt(formData.minOrderQuantity) : 1,
          maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : undefined,
          dimensions: (formData.length || formData.width || formData.height || formData.breadth) ? {
            length: formData.length ? parseFloat(formData.length) : undefined,
            width: formData.width ? parseFloat(formData.width) : undefined,
            height: formData.height ? parseFloat(formData.height) : undefined,
            breadth: formData.breadth ? parseFloat(formData.breadth) : undefined,
            unit: formData.dimensionUnit,
          } : undefined,
          cgst: formData.cgst ? parseFloat(formData.cgst) : undefined,
          sgst: formData.sgst ? parseFloat(formData.sgst) : undefined,
          igst: formData.igst ? parseFloat(formData.igst) : undefined,
          variations: variations.map(v => ({
            ...v,
            quantity: parseInt(String(v.quantity)) || 0,
            price: v.price ? parseFloat(v.price) : undefined,
          })),
          features,
          specifications: Object.keys(specsObject).length > 0 ? specsObject : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl font-bold mb-8">Add New Product</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="SKU"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                        placeholder="Auto-generated if empty"
                      />
                      <Input
                        label="HSN Code"
                        value={formData.hsn}
                        onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                        placeholder="e.g., 4820"
                      />
                    </div>
                    <Input
                      label="Product Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Slug"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="product-name"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="e.g., Classmate"
                      />
                      <Input
                        label="Manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="e.g., ITC Limited"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                  />
                </div>

                {/* Category & Pricing */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Category & Pricing</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Input
                        placeholder="Search and select category..."
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                      />
                      {showCategoryDropdown && filteredCategories.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {filteredCategories.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => handleSelectCategory(category)}
                              className="w-full text-left px-4 py-2 hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
                            >
                              <p className="font-semibold text-gray-900">{category.name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                      {formData.category && <p className="text-xs text-green-600 mt-1">✓ Category selected</p>}
                    </div>

                    {subcategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select a subcategory...</option>
                          {subcategories.map((subcat) => (
                            <option key={subcat._id} value={subcat.slug}>{subcat.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Price (₹)" type="number" step="0.01" required value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                      <Input label="Retail Price / MRP (₹)" type="number" step="0.01" value={formData.retailPrice}
                        onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })} />
                      <Input label="Discount Price (₹)" type="number" step="0.01" value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Stock" type="number" required value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                      <Input label="Qty per Item" type="number" value={formData.quantityPerItem}
                        onChange={(e) => setFormData({ ...formData, quantityPerItem: e.target.value })} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="piece">Piece</option>
                          <option value="pack">Pack</option>
                          <option value="box">Box</option>
                          <option value="set">Set</option>
                          <option value="dozen">Dozen</option>
                          <option value="kg">Kg</option>
                          <option value="g">Gram</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Product Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Color" value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., Blue" />
                      <Input label="Size" value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="e.g., A4, Large" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Material" value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })} placeholder="e.g., Paper, Plastic" />
                      <Input label="Country of Origin" value={formData.countryOfOrigin}
                        onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Weight" type="number" step="0.01" value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight Unit</label>
                        <select value={formData.weightUnit} onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="g">Grams (g)</option>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="ml">Milliliters (ml)</option>
                          <option value="l">Liters (l)</option>
                        </select>
                      </div>
                      <Input label="Warranty" value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })} placeholder="e.g., 1 Year" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Min Order Qty" type="number" value={formData.minOrderQuantity}
                        onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })} />
                      <Input label="Max Order Qty" type="number" value={formData.maxOrderQuantity}
                        onChange={(e) => setFormData({ ...formData, maxOrderQuantity: e.target.value })} placeholder="Leave empty for no limit" />
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Dimensions (Optional)</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4">
                      <Input label="Length" type="number" step="0.01" value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
                      <Input label="Width" type="number" step="0.01" value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })} />
                      <Input label="Height" type="number" step="0.01" value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                      <Input label="Breadth" type="number" step="0.01" value={formData.breadth}
                        onChange={(e) => setFormData({ ...formData, breadth: e.target.value })} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <select value={formData.dimensionUnit} onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                          <option value="in">inches</option>
                          <option value="m">meters</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GST Rates */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">GST Rates (Optional)</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter GST rates in percentage. Leave empty to use store default.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="CGST (%)" type="number" step="0.01" min="0" max="100" value={formData.cgst}
                      onChange={(e) => setFormData({ ...formData, cgst: e.target.value })} placeholder="e.g., 9" />
                    <Input label="SGST (%)" type="number" step="0.01" min="0" max="100" value={formData.sgst}
                      onChange={(e) => setFormData({ ...formData, sgst: e.target.value })} placeholder="e.g., 9" />
                    <Input label="IGST (%)" type="number" step="0.01" min="0" max="100" value={formData.igst}
                      onChange={(e) => setFormData({ ...formData, igst: e.target.value })} placeholder="e.g., 18" />
                  </div>
                </div>

                {/* Variations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading text-xl font-bold">Variations (Color/Size)</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addVariation}>+ Add Variation</Button>
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
                          {f}
                          <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-600">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading text-xl font-bold">Specifications</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addSpecification}>+ Add Spec</Button>
                  </div>
                  {specifications.length > 0 && (
                    <div className="space-y-2">
                      {specifications.map((spec, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                          <div className="col-span-2">
                            <Input label="Key" value={spec.key} onChange={(e) => updateSpecification(idx, 'key', e.target.value)} placeholder="e.g., Pages" />
                          </div>
                          <div className="col-span-2">
                            <Input label="Value" value={spec.value} onChange={(e) => updateSpecification(idx, 'value', e.target.value)} placeholder="e.g., 200" />
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(idx)}>✕</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags & Flags */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Tags & Visibility</h2>
                  <Input label="Tags (comma-separated)" value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="tag1, tag2, tag3" className="mb-4" />
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                      <span className="text-sm font-medium">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })} />
                      <span className="text-sm font-medium">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} />
                      <span className="text-sm font-medium">Best Seller</span>
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h2 className="font-heading text-xl font-bold mb-4">Rating & Reviews (Optional)</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Rating (0-5)" type="number" step="0.1" min="0" max="5" value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })} placeholder="e.g., 4.5" />
                    <Input label="Review Count" type="number" min="0" value={formData.reviewCount}
                      onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })} placeholder="e.g., 25" />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button type="submit" isLoading={loading}>Create Product</Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Image Upload Sidebar */}
          <div>
            <Card>
              <h2 className="font-heading text-xl font-bold mb-4">Product Images</h2>
              <div className="mb-6">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    <p className="text-sm font-semibold text-gray-700">{uploading ? 'Uploading...' : 'Click to upload images'}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                  </div>
                </label>
              </div>
              {uploadedImages.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Uploaded ({uploadedImages.length})</p>
                  <div className="space-y-3">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <Image src={img.url} alt={img.alt} fill className="object-cover" />
                        </div>
                        <button type="button" onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
