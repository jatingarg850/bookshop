# ADMIN PRODUCT SYSTEM - DATA STRUCTURES & SCHEMAS

## COMPLETE PRODUCT OBJECT STRUCTURE

```typescript
{
  // MongoDB ID
  _id: ObjectId,
  
  // CORE FIELDS
  sku: "SKU001",                    // Unique, uppercase
  name: "Product Name",              // Required
  slug: "product-name",              // Unique, lowercase, URL-friendly
  description: "Detailed description", // Min 10 chars
  category: "books",                 // Category ID/slug
  subcategory: "notebooks",          // Optional subcategory
  
  // PRICING
  price: 120,                        // Required, selling price
  retailPrice: 150,                  // Optional, MRP
  discountPrice: 99,                 // Optional, discounted price
  
  // INVENTORY
  stock: 100,                        // Required, available quantity
  minOrderQuantity: 1,               // Optional, default 1
  maxOrderQuantity: 10,              // Optional, no limit if undefined
  quantityPerItem: 1,                // Optional, items per pack
  unit: "piece",                     // piece, pack, box, set, dozen, kg, g
  
  // IMAGES
  images: [
    {
      url: "https://cloudinary.com/...",
      alt: "Product image"
    }
  ],
  
  // PRODUCT DETAILS
  brand: "Classmate",                // Optional
  manufacturer: "ITC Limited",       // Optional
  hsn: "4820",                       // Optional, HSN code
  material: "Paper",                 // Optional
  color: "Blue",                     // Optional
  size: "A4",                        // Optional
  warranty: "1 Year",                // Optional
  countryOfOrigin: "India",          // Optional, default "India"
  weight: 250,                       // Optional
  weightUnit: "g",                   // g, kg, ml, l
  
  // DIMENSIONS
  dimensions: {
    length: 29.7,                    // Optional
    width: 21,                       // Optional
    height: 1,                       // Optional
    breadth: undefined,              // Optional
    unit: "cm"                       // cm, mm, inches, meters
  },
  
  // GST/TAX
  cgst: 9,                           // Optional, Central GST %
  sgst: 9,                           // Optional, State GST %
  igst: 18,                          // Optional, Integrated GST %
  
  // VARIATIONS
  variations: [
    {
      color: "Blue",
      size: "A4",
      quantity: 50,
      sku: "SKU001-BLUE-A4",
      price: 120
    },
    {
      color: "Red",
      size: "A4",
      quantity: 30,
      sku: "SKU001-RED-A4",
      price: 120
    }
  ],
  
  // CONTENT
  tags: ["notebook", "classmate", "school"],
  features: [
    "Single line ruled",
    "Smooth paper",
    "Durable binding",
    "Eco-friendly"
  ],
  specifications: {
    "Pages": "200",
    "Ruling": "Single Line",
    "Paper GSM": "70"
  },
  
  // RATING & REVIEWS
  rating: 4.5,                       // Optional, 0-5
  reviewCount: 125,                  // Optional
  
  // STATUS & VISIBILITY
  status: "active",                  // active, inactive, draft
  isFeatured: true,                  // Optional, default false
  isNewArrival: true,                // Optional, default false
  isBestSeller: false,               // Optional, default false
  
  // TIMESTAMPS
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

---

## FORM DATA STATE OBJECT

```typescript
{
  // Basic Information
  sku: "",                           // String, auto-generated if empty
  name: "",                          // String, required
  slug: "",                          // String, required
  description: "",                   // String, required (min 10)
  category: "",                      // String, required
  subcategory: "",                   // String, optional
  
  // Pricing
  price: "",                         // String (converted to number)
  retailPrice: "",                   // String (converted to number)
  discountPrice: "",                 // String (converted to number)
  
  // Inventory
  stock: "",                         // String (converted to number)
  tags: "",                          // String (comma-separated)
  status: "draft",                   // Enum: draft, active, inactive
  rating: "",                        // String (converted to number)
  reviewCount: "",                   // String (converted to number)
  
  // Product Details
  hsn: "",                           // String
  brand: "",                         // String
  manufacturer: "",                  // String
  quantityPerItem: "1",              // String (converted to number)
  unit: "piece",                     // String
  weight: "",                        // String (converted to number)
  weightUnit: "g",                   // String
  material: "",                      // String
  color: "",                         // String
  size: "",                          // String
  warranty: "",                      // String
  countryOfOrigin: "India",          // String
  minOrderQuantity: "1",             // String (converted to number)
  maxOrderQuantity: "",              // String (converted to number)
  isFeatured: false,                 // Boolean
  isNewArrival: false,               // Boolean
  isBestSeller: false,               // Boolean
  
  // Dimensions
  length: "",                        // String (converted to number)
  width: "",                         // String (converted to number)
  height: "",                        // String (converted to number)
  breadth: "",                       // String (converted to number)
  dimensionUnit: "cm",               // String
  
  // GST
  cgst: "",                          // String (converted to number)
  sgst: "",                          // String (converted to number)
  igst: ""                           // String (converted to number)
}
```

---

## VARIATION OBJECT STRUCTURE

```typescript
interface Variation {
  color: string;                     // Optional, e.g., "Blue"
  size: string;                      // Optional, e.g., "A4"
  quantity: number;                  // Required, stock for this variation
  sku: string;                       // Optional, SKU for this variation
  price: string;                     // Optional, price for this variation (form)
}

// After conversion:
{
  color: "Blue",
  size: "A4",
  quantity: 50,
  sku: "SKU001-BLUE-A4",
  price: 120                         // Converted to number
}
```

---

## FEATURE ARRAY STRUCTURE

```typescript
// Form state
features: ["Single line ruled", "Smooth paper", "Durable binding"]

// Submitted as
features: ["Single line ruled", "Smooth paper", "Durable binding"]

// Stored in DB
features: ["Single line ruled", "Smooth paper", "Durable binding"]
```

---

## SPECIFICATION OBJECT STRUCTURE

```typescript
// Form state (array of objects)
specifications: [
  { key: "Pages", value: "200" },
  { key: "Ruling", value: "Single Line" },
  { key: "Paper GSM", value: "70" }
]

// Converted to object on submit
specifications: {
  "Pages": "200",
  "Ruling": "Single Line",
  "Paper GSM": "70"
}

// Stored in DB
specifications: {
  "Pages": "200",
  "Ruling": "Single Line",
  "Paper GSM": "70"
}
```

---

## IMAGE OBJECT STRUCTURE

```typescript
// Uploaded image
{
  url: "https://res.cloudinary.com/...",
  alt: "filename.jpg"
}

// Array of images
images: [
  {
    url: "https://res.cloudinary.com/image1.jpg",
    alt: "image1.jpg"
  },
  {
    url: "https://res.cloudinary.com/image2.jpg",
    alt: "image2.jpg"
  }
]
```

---

## DIMENSION OBJECT STRUCTURE

```typescript
// Form state (individual fields)
{
  length: "29.7",
  width: "21",
  height: "1",
  breadth: "",
  dimensionUnit: "cm"
}

// Converted on submit
{
  length: 29.7,
  width: 21,
  height: 1,
  breadth: undefined,
  unit: "cm"
}

// Stored in DB (only if at least one dimension provided)
{
  length: 29.7,
  width: 21,
  height: 1,
  unit: "cm"
}
```

---

## CATEGORY OBJECT STRUCTURE

```typescript
interface Category {
  _id: string;                       // MongoDB ID
  name: string;                      // Category name
  slug: string;                      // URL-friendly slug
}

// Example
{
  _id: "507f1f77bcf86cd799439011",
  name: "Books",
  slug: "books"
}
```

---

## API REQUEST PAYLOAD

```typescript
// POST /api/admin/products
{
  sku: "SKU001" | undefined,
  name: "Classmate Notebook",
  slug: "classmate-notebook",
  description: "Premium quality ruled notebook...",
  category: "books",
  subcategory: "notebooks" | undefined,
  price: 120,
  retailPrice: 150 | undefined,
  discountPrice: 99 | undefined,
  stock: 100,
  tags: ["notebook", "classmate"],
  images: [
    { url: "https://...", alt: "image.jpg" }
  ],
  rating: 4.5 | undefined,
  reviewCount: 125 | undefined,
  hsn: "4820" | undefined,
  brand: "Classmate" | undefined,
  manufacturer: "ITC Limited" | undefined,
  quantityPerItem: 1,
  unit: "piece",
  weight: 250 | undefined,
  weightUnit: "g",
  material: "Paper" | undefined,
  color: "Blue" | undefined,
  size: "A4" | undefined,
  warranty: "1 Year" | undefined,
  countryOfOrigin: "India",
  minOrderQuantity: 1,
  maxOrderQuantity: 10 | undefined,
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: false,
  dimensions: {
    length: 29.7 | undefined,
    width: 21 | undefined,
    height: 1 | undefined,
    breadth: undefined,
    unit: "cm"
  } | undefined,
  cgst: 9 | undefined,
  sgst: 9 | undefined,
  igst: 18 | undefined,
  variations: [
    {
      color: "Blue",
      size: "A4",
      quantity: 50,
      sku: "SKU001-BLUE",
      price: 120 | undefined
    }
  ],
  features: ["Single line ruled", "Smooth paper"],
  specifications: {
    "Pages": "200",
    "Ruling": "Single Line"
  } | undefined
}
```

---

## API RESPONSE PAYLOAD

```typescript
// 201 Created
{
  _id: "507f1f77bcf86cd799439012",
  sku: "SKU001",
  name: "Classmate Notebook",
  slug: "classmate-notebook",
  description: "Premium quality ruled notebook...",
  category: "books",
  subcategory: "notebooks",
  price: 120,
  retailPrice: 150,
  discountPrice: 99,
  stock: 100,
  tags: ["notebook", "classmate"],
  images: [
    { url: "https://...", alt: "image.jpg" }
  ],
  rating: 4.5,
  reviewCount: 125,
  hsn: "4820",
  brand: "Classmate",
  manufacturer: "ITC Limited",
  quantityPerItem: 1,
  unit: "piece",
  weight: 250,
  weightUnit: "g",
  material: "Paper",
  color: "Blue",
  size: "A4",
  warranty: "1 Year",
  countryOfOrigin: "India",
  minOrderQuantity: 1,
  maxOrderQuantity: 10,
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: false,
  dimensions: {
    length: 29.7,
    width: 21,
    height: 1,
    unit: "cm"
  },
  cgst: 9,
  sgst: 9,
  igst: 18,
  variations: [
    {
      color: "Blue",
      size: "A4",
      quantity: 50,
      sku: "SKU001-BLUE",
      price: 120
    }
  ],
  features: ["Single line ruled", "Smooth paper"],
  specifications: {
    "Pages": "200",
    "Ruling": "Single Line"
  },
  status: "draft",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

---

## CSV IMPORT ROW STRUCTURE

```typescript
interface ImportRow {
  'SKU': string;
  'Item Name': string;
  'Slug': string;
  'Price': string;
  'Retail Price': string;
  'Discount Price': string;
  'Status': string;
  'Description': string;
  'Stock': string;
  'Category': string;
  'Sub Category': string;
  'Tags': string;                    // Semicolon-separated
  'Images': string;                  // Semicolon-separated URLs
  'Rating': string;
  'Review Count': string;
  'HSN': string;
  'Brand': string;
  'Manufacturer': string;
  'Qty Per Item': string;
  'Unit': string;
  'Weight': string;
  'Weight Unit': string;
  'Material': string;
  'Color': string;
  'Size': string;
  'Warranty': string;
  'Country Of Origin': string;
  'Min Order Qty': string;
  'Max Order Qty': string;
  'Is Featured': string;
  'Is New Arrival': string;
  'Is Best Seller': string;
  'Features': string;                // Semicolon-separated
  'Specifications': string;          // key:value pairs separated by semicolon
  'Length': string;
  'Width': string;
  'Height': string;
  'Breadth': string;
  'Dimension Unit': string;
  'CGST': string;
  'SGST': string;
  'IGST': string;
}

// Example row
{
  'SKU': 'SKU001',
  'Item Name': 'Classmate Notebook 200 Pages',
  'Slug': 'classmate-notebook-200-pages',
  'Price': '120',
  'Retail Price': '150',
  'Discount Price': '99',
  'Status': 'active',
  'Description': 'Premium quality ruled notebook...',
  'Stock': '100',
  'Category': 'books',
  'Sub Category': 'notebooks',
  'Tags': 'notebook; classmate; school',
  'Images': 'https://picsum.photos/400/500?random=1; https://picsum.photos/400/500?random=2',
  'Rating': '4.5',
  'Review Count': '125',
  'HSN': '4820',
  'Brand': 'Classmate',
  'Manufacturer': 'ITC Limited',
  'Qty Per Item': '1',
  'Unit': 'piece',
  'Weight': '250',
  'Weight Unit': 'g',
  'Material': 'Paper',
  'Color': 'Blue',
  'Size': 'A4',
  'Warranty': '1 Year',
  'Country Of Origin': 'India',
  'Min Order Qty': '1',
  'Max Order Qty': '10',
  'Is Featured': 'true',
  'Is New Arrival': 'true',
  'Is Best Seller': 'false',
  'Features': 'Single line ruled; Smooth paper; Durable binding',
  'Specifications': 'Pages:200; Ruling:Single Line; Paper GSM:70',
  'Length': '29.7',
  'Width': '21',
  'Height': '1',
  'Breadth': '',
  'Dimension Unit': 'cm',
  'CGST': '9',
  'SGST': '9',
  'IGST': '18'
}
```

---

## CSV IMPORT RESULT STRUCTURE

```typescript
{
  success: true,
  message: "Import completed: 5 imported, 3 updated, 1 failed",
  results: {
    imported: 5,                     // New products created
    updated: 3,                      // Existing products updated
    failed: 1,                       // Failed rows
    errors: [
      "Row 2: Missing required fields (Item Name, Price)",
      "Row 5: Category 'invalid' not found"
    ]
  }
}
```

---

## ERROR RESPONSE STRUCTURE

```typescript
// 400 Bad Request
{
  error: "Slug already exists"
}

// 401 Unauthorized
{
  error: "Unauthorized"
}

// 404 Not Found
{
  error: "Product not found"
}

// 500 Internal Server Error
{
  error: "Failed to create product"
}
```

---

## UPLOAD RESPONSE STRUCTURE

```typescript
// POST /api/admin/upload
{
  secure_url: "https://res.cloudinary.com/..."
}
```

---

## CATEGORIES RESPONSE STRUCTURE

```typescript
// GET /api/admin/categories
{
  categories: [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Books",
      slug: "books"
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Stationery",
      slug: "stationery"
    }
  ]
}
```

---

## PRODUCTS LIST RESPONSE STRUCTURE

```typescript
// GET /api/admin/products
{
  products: [
    {
      _id: "507f1f77bcf86cd799439012",
      sku: "SKU001",
      name: "Classmate Notebook",
      slug: "classmate-notebook",
      price: 120,
      stock: 100,
      status: "active",
      createdAt: "2024-01-15T10:30:00Z"
      // ... other fields
    }
  ],
  pagination: {
    total: 150,
    page: 1,
    limit: 10,
    pages: 15
  }
}
```

---

## FORM VALIDATION ERROR STRUCTURE

```typescript
// Zod validation error
{
  error: "Validation error",
  details: [
    {
      path: ["name"],
      message: "Product name is required"
    },
    {
      path: ["price"],
      message: "Price must be positive"
    }
  ]
}
```

---

## STATE UPDATE PATTERNS

### Update Single Field
```typescript
setFormData({ ...formData, name: e.target.value })
```

### Update Nested Field
```typescript
setFormData({ 
  ...formData, 
  dimensions: {
    ...formData.dimensions,
    length: e.target.value
  }
})
```

### Update Array Item
```typescript
const updated = [...variations];
updated[index] = { ...updated[index], color: value };
setVariations(updated);
```

### Add to Array
```typescript
setVariations([...variations, { color: '', size: '', quantity: 0, sku: '', price: '' }])
```

### Remove from Array
```typescript
setVariations(variations.filter((_, i) => i !== index))
```

---

## TYPE DEFINITIONS

```typescript
type ProductStatus = 'active' | 'inactive' | 'draft';

type Unit = 'piece' | 'pack' | 'box' | 'set' | 'dozen' | 'kg' | 'g';

type WeightUnit = 'g' | 'kg' | 'ml' | 'l';

type DimensionUnit = 'cm' | 'mm' | 'in' | 'm';

interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  retailPrice?: number;
  discountPrice?: number;
  images: Array<{ url: string; alt?: string }>;
  stock: number;
  tags: string[];
  status: ProductStatus;
  rating?: number;
  reviewCount?: number;
  hsn?: string;
  brand?: string;
  manufacturer?: string;
  quantityPerItem?: number;
  unit?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    breadth?: number;
    unit?: string;
  };
  cgst?: number;
  sgst?: number;
  igst?: number;
  material?: string;
  color?: string;
  size?: string;
  variations?: Array<{
    color?: string;
    size?: string;
    quantity: number;
    sku?: string;
    price?: number;
  }>;
  warranty?: string;
  countryOfOrigin?: string;
  features?: string[];
  specifications?: Record<string, string>;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## COMPLETE DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PRODUCT FORM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Input → Form State (formData, variations, features, etc) │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  handleSubmit() → Validation                                   │
│  - Images uploaded?                                            │
│  - Category selected?                                          │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Data Conversion                                               │
│  - String → Number (price, stock, etc)                         │
│  - String → Array (tags)                                       │
│  - Array → Object (specifications)                             │
│  - Conditional inclusion (dimensions, etc)                     │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  POST /api/admin/products                                      │
│  ├─ Request Body: Converted data                               │
│  ├─ Headers: Content-Type: application/json                    │
│  └─ Auth: Admin session required                               │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Server-Side Processing                                        │
│  ├─ Zod Schema Validation                                      │
│  ├─ Duplicate Slug Check                                       │
│  ├─ MongoDB Create                                             │
│  └─ Return Created Product                                     │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Response: 201 Created + Product Object                        │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Redirect to /admin/products                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

