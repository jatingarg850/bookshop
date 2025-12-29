# ADMIN PRODUCT SYSTEM - CODE REFERENCE & EXAMPLES

## PRODUCT MODEL INTERFACE (TypeScript)

```typescript
export interface IProduct extends Document {
  // Core
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Pricing
  price: number;
  retailPrice?: number;
  discountPrice?: number;
  
  // Inventory
  stock: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  quantityPerItem?: number;
  unit?: string;
  
  // Images
  images: Array<{
    url: string;
    alt?: string;
  }>;
  
  // Product Details
  brand?: string;
  manufacturer?: string;
  hsn?: string;
  material?: string;
  color?: string;
  size?: string;
  warranty?: string;
  countryOfOrigin?: string;
  weight?: number;
  weightUnit?: string;
  
  // Dimensions
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    breadth?: number;
    unit?: string;
  };
  
  // GST
  cgst?: number;
  sgst?: number;
  igst?: number;
  
  // Variations
  variations?: Array<{
    color?: string;
    size?: string;
    quantity: number;
    sku?: string;
    price?: number;
  }>;
  
  // Content
  tags: string[];
  features?: string[];
  specifications?: Record<string, string>;
  
  // Rating
  rating?: number;
  reviewCount?: number;
  
  // Status
  status: 'active' | 'inactive' | 'draft';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## VALIDATION SCHEMA (Zod)

```typescript
import { z } from 'zod';

const variationSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().min(0).default(0),
  sku: z.string().optional(),
  price: z.number().min(0).optional(),
});

export const productSchema = z.object({
  // Core
  sku: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  
  // Pricing
  price: z.number().min(0, 'Price must be positive'),
  retailPrice: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional(),
  
  // Inventory
  stock: z.number().min(0, 'Stock must be non-negative'),
  minOrderQuantity: z.number().min(1).optional(),
  maxOrderQuantity: z.number().min(1).optional(),
  quantityPerItem: z.number().min(1).optional(),
  unit: z.string().optional(),
  
  // Images
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  })).optional(),
  
  // Product Details
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  hsn: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  warranty: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.string().optional(),
  
  // Dimensions
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    breadth: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  
  // GST
  cgst: z.number().min(0).optional(),
  sgst: z.number().min(0).optional(),
  igst: z.number().min(0).optional(),
  
  // Variations
  variations: z.array(variationSchema).optional(),
  
  // Content
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  
  // Rating
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  
  // Status
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
```

---

## FORM STATE INITIALIZATION

```typescript
const [formData, setFormData] = useState({
  // Basic
  sku: '',
  name: '',
  slug: '',
  description: '',
  category: '',
  subcategory: '',
  
  // Pricing
  price: '',
  retailPrice: '',
  discountPrice: '',
  
  // Inventory
  stock: '',
  tags: '',
  status: 'draft' as 'active' | 'inactive' | 'draft',
  rating: '',
  reviewCount: '',
  
  // Product Details
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
```

---

## FORM SUBMISSION HANDLER

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // Validation
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

    // Build specifications object
    const specsObject: Record<string, string> = {};
    specifications.forEach(spec => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });

    // Prepare payload
    const payload = {
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
    };

    // Submit
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
```

---

## IMAGE UPLOAD HANDLER

```typescript
async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const files = e.target.files;
  if (!files) return;

  setUploading(true);
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
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
        setUploadedImages((prev) => [...prev, { 
          url: data.secure_url, 
          alt: file.name 
        }]);
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
```

---

## CATEGORY AUTOCOMPLETE HANDLER

```typescript
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
  setFormData({ ...formData, category: category._id, subcategory: '' });
  setCategorySearch(category.name);
  setShowCategoryDropdown(false);
  fetchSubcategories(category._id);
}

// Filter categories as user types
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
```

---

## VARIATIONS MANAGEMENT

```typescript
function addVariation() {
  setVariations([...variations, { 
    color: '', 
    size: '', 
    quantity: 0, 
    sku: '', 
    price: '' 
  }]);
}

function updateVariation(index: number, field: keyof Variation, value: string | number) {
  const updated = [...variations];
  updated[index] = { ...updated[index], [field]: value };
  setVariations(updated);
}

function removeVariation(index: number) {
  setVariations(variations.filter((_, i) => i !== index));
}
```

---

## FEATURES MANAGEMENT

```typescript
function addFeature() {
  if (newFeature.trim()) {
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  }
}

function removeFeature(index: number) {
  setFeatures(features.filter((_, i) => i !== index));
}

// In JSX for Enter key support:
<Input 
  value={newFeature} 
  onChange={(e) => setNewFeature(e.target.value)} 
  placeholder="Add a feature..." 
  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} 
/>
```

---

## SPECIFICATIONS MANAGEMENT

```typescript
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
```

---

## API ENDPOINT: CREATE PRODUCT

```typescript
// POST /api/admin/products
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/auth';
import { productSchema } from '@/lib/validations/product';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null;
  }
  return session;
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    await connectDB();

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug: validatedData.slug });
    if (existingProduct) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Create product
    const product = await Product.create({
      ...validatedData,
      status: validatedData.status || 'draft',
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}
```

---

## API ENDPOINT: UPDATE PRODUCT

```typescript
// PUT /api/admin/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    await connectDB();

    const product = await Product.findByIdAndUpdate(params.id, validatedData, {
      new: true,
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 400 }
    );
  }
}
```

---

## CSV IMPORT LOGIC

```typescript
// POST /api/admin/products/import
function parseCSV(csv: string): ImportRow[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV with quoted field support
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    // Create row object
    const row: any = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      row[header] = value;
    });

    if (Object.values(row).some(v => v)) {
      rows.push(row);
    }
  }

  return rows;
}

// Auto-generate SKU if missing
let sku = row['SKU']?.trim();
if (!sku) {
  sku = row['Slug'].toUpperCase().replace(/-/g, '_');
  sku = `${sku}_${Date.now()}`;
}

// Check if product exists
let existingProduct = await Product.findOne({ sku: productData.sku });
if (!existingProduct) {
  existingProduct = await Product.findOne({ slug: productData.slug });
}

if (existingProduct) {
  // Update existing
  await Product.findByIdAndUpdate(existingProduct._id, updateData, { new: true });
  results.updated++;
} else {
  // Create new
  await Product.create(productData);
  results.imported++;
}
```

---

## CSV EXPORT LOGIC

```typescript
// GET /api/admin/products/export
const products = await Product.find({}).lean();
const categories = await Category.find({}).lean();
const categoryMap = new Map(categories.map(c => [c.slug, c.name]));

const data = products.map((product: any) => ({
  'SKU': product.sku || '',
  'Item Name': product.name,
  'Slug': product.slug,
  'Price': product.price,
  'Retail Price': product.retailPrice || '',
  'Discount Price': product.discountPrice || '',
  'Status': product.status || 'draft',
  'Description': product.description,
  'Stock': product.stock,
  'Category': categoryMap.get(product.category) || product.category,
  'Sub Category': product.subcategory || '',
  'Tags': product.tags?.join(', ') || '',
  'Images': product.images?.map((img: any) => img.url).join('; ') || '',
  'Rating': product.rating || '',
  'Review Count': product.reviewCount || '',
}));

// Create CSV
const headers = ['SKU', 'Item Name', 'Slug', 'Price', ...];
const csvContent = [
  headers.join(','),
  ...data.map(row =>
    headers.map(header => {
      const value = row[header as keyof typeof row];
      const stringValue = String(value || '');
      return stringValue.includes(',') || stringValue.includes('"')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    }).join(',')
  ),
].join('\n');

return new NextResponse(csvContent, {
  headers: {
    'Content-Type': 'text/csv;charset=utf-8',
    'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`,
  },
});
```

---

## FORM RENDERING EXAMPLES

### Basic Input Field
```typescript
<Input
  label="Product Name"
  required
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

### Number Input with Step
```typescript
<Input 
  label="Price (₹)" 
  type="number" 
  step="0.01" 
  required 
  value={formData.price}
  onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
/>
```

### Dropdown Select
```typescript
<select 
  value={formData.unit} 
  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  <option value="piece">Piece</option>
  <option value="pack">Pack</option>
  <option value="box">Box</option>
  <option value="set">Set</option>
  <option value="dozen">Dozen</option>
  <option value="kg">Kg</option>
  <option value="g">Gram</option>
</select>
```

### Checkbox
```typescript
<label className="flex items-center gap-2 cursor-pointer">
  <input 
    type="checkbox" 
    checked={formData.isFeatured} 
    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
  />
  <span className="text-sm font-medium">Featured Product</span>
</label>
```

### Textarea
```typescript
<textarea
  required
  value={formData.description}
  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
  rows={4}
/>
```

### Dynamic Array (Variations)
```typescript
{variations.length > 0 && (
  <div className="space-y-3">
    {variations.map((v, idx) => (
      <div key={idx} className="grid grid-cols-6 gap-2 items-end bg-gray-50 p-3 rounded-lg">
        <Input 
          label="Color" 
          value={v.color} 
          onChange={(e) => updateVariation(idx, 'color', e.target.value)} 
        />
        <Input 
          label="Size" 
          value={v.size} 
          onChange={(e) => updateVariation(idx, 'size', e.target.value)} 
        />
        <Input 
          label="Qty" 
          type="number" 
          value={v.quantity} 
          onChange={(e) => updateVariation(idx, 'quantity', e.target.value)} 
        />
        <Input 
          label="SKU" 
          value={v.sku} 
          onChange={(e) => updateVariation(idx, 'sku', e.target.value)} 
        />
        <Input 
          label="Price" 
          type="number" 
          value={v.price} 
          onChange={(e) => updateVariation(idx, 'price', e.target.value)} 
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => removeVariation(idx)}
        >
          ✕
        </Button>
      </div>
    ))}
  </div>
)}
```

---

## COMMON PATTERNS

### Conditional Rendering
```typescript
{subcategories.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
    <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}>
      <option value="">Select a subcategory...</option>
      {subcategories.map((subcat) => (
        <option key={subcat._id} value={subcat.slug}>{subcat.name}</option>
      ))}
    </select>
  </div>
)}
```

### Grid Layout
```typescript
<div className="grid grid-cols-3 gap-4">
  <Input label="Price (₹)" type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
  <Input label="Retail Price / MRP (₹)" type="number" step="0.01" value={formData.retailPrice} onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })} />
  <Input label="Discount Price (₹)" type="number" step="0.01" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} />
</div>
```

### Error Display
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
    {error}
  </div>
)}
```

### Loading State
```typescript
<Button type="submit" isLoading={loading}>Create Product</Button>
```

