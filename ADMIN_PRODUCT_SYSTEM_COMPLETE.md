# COMPLETE ADMIN PRODUCT CREATION SYSTEM DOCUMENTATION

## ROUTE: http://localhost:3000/admin/products/new

### FILE LOCATION
- **Main Form**: `app/admin/products/new/page.tsx`
- **Product Model**: `lib/db/models/Product.ts`
- **Validation Schema**: `lib/validations/product.ts`
- **API Endpoints**: `app/api/admin/products/route.ts`, `app/api/admin/products/[id]/route.ts`
- **CSV Template**: `public/products-template.csv`
- **Import/Export**: `app/api/admin/products/import/route.ts`, `app/api/admin/products/export/route.ts`

---

## PRODUCT MODEL SCHEMA (MongoDB)

### Core Fields
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| sku | String | Yes | - | Unique, uppercase, auto-generated if empty |
| name | String | Yes | - | Product name |
| slug | String | Yes | - | Unique, lowercase, URL-friendly |
| description | String | Yes | - | Min 10 characters |
| category | String | Yes | - | Category ID/slug |
| subcategory | String | No | - | Subcategory slug |

### Pricing Fields
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| price | Number | Yes | - | Min 0, selling price |
| retailPrice | Number | No | - | MRP, min 0 |
| discountPrice | Number | No | - | Discounted price, min 0 |

### Inventory Fields
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| stock | Number | Yes | 0 | Min 0 |
| minOrderQuantity | Number | No | 1 | Min 1 |
| maxOrderQuantity | Number | No | - | Min 1, no limit if empty |
| quantityPerItem | Number | No | 1 | Min 1 |
| unit | String | No | 'piece' | piece, pack, box, set, dozen, kg, g |

### Product Details
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| brand | String | No | - | Brand name |
| manufacturer | String | No | - | Manufacturer name |
| hsn | String | No | - | HSN Code for tax |
| material | String | No | - | Material composition |
| color | String | No | - | Product color |
| size | String | No | - | Product size |
| warranty | String | No | - | Warranty period |
| countryOfOrigin | String | No | 'India' | Country of origin |
| weight | Number | No | - | Product weight |
| weightUnit | String | No | 'g' | g, kg, ml, l |

### Dimensions (Nested Object)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| dimensions.length | Number | No | - | Length value |
| dimensions.width | Number | No | - | Width value |
| dimensions.height | Number | No | - | Height value |
| dimensions.breadth | Number | No | - | Breadth value |
| dimensions.unit | String | No | 'cm' | cm, mm, inches, meters |

### GST/Tax Fields
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| cgst | Number | No | - | Central GST %, 0-100 |
| sgst | Number | No | - | State GST %, 0-100 |
| igst | Number | No | - | Integrated GST %, 0-100 |

### Variations (Array of Objects)
Each variation object contains:
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| color | String | No | - | Variation color |
| size | String | No | - | Variation size |
| quantity | Number | No | 0 | Stock for this variation |
| sku | String | No | - | SKU for this variation |
| price | Number | No | - | Price for this variation |

### Media & Content
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| images | Array | No | - | Array of {url, alt} objects |
| tags | Array | No | - | Array of tag strings |
| features | Array | No | - | Array of feature strings |
| specifications | Map | No | - | Key-value pairs of specs |

### Rating & Reviews
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| rating | Number | No | - | 0-5 rating |
| reviewCount | Number | No | 0 | Number of reviews |

### Status & Visibility
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| status | Enum | No | 'draft' | active, inactive, draft |
| isFeatured | Boolean | No | false | Featured product flag |
| isNewArrival | Boolean | No | false | New arrival flag |
| isBestSeller | Boolean | No | false | Best seller flag |

### Timestamps
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| createdAt | Date | Auto | - | Creation timestamp |
| updatedAt | Date | Auto | - | Last update timestamp |

---

## ADMIN FORM STRUCTURE (12 Sections)

### SECTION 1: BASIC INFORMATION
**Fields:**
- SKU (text, optional, auto-generated if empty, uppercase)
- HSN Code (text, optional, e.g., "4820")
- Product Name (text, required)
- Slug (text, required, e.g., "product-name")
- Brand (text, optional, e.g., "Classmate")
- Manufacturer (text, optional, e.g., "ITC Limited")

**Layout:** 2-column grid for SKU/HSN, full-width for name, full-width for slug, 2-column for Brand/Manufacturer

### SECTION 2: DESCRIPTION
**Fields:**
- Description (textarea, required, min 10 chars)

**Layout:** Full-width textarea, 4 rows

### SECTION 3: CATEGORY & PRICING
**Fields:**
- Category (searchable dropdown with autocomplete, required)
- Sub Category (conditional dropdown, appears after category selected)
- Price (number, required, step 0.01, currency ₹)
- Retail Price / MRP (number, optional, step 0.01)
- Discount Price (number, optional, step 0.01)
- Stock (number, required)
- Qty per Item (number, optional)
- Unit (dropdown: piece, pack, box, set, dozen, kg, g)
- Status (dropdown: draft, active, inactive)

**Layout:** 
- Full-width category search with dropdown
- Conditional subcategory select
- 3-column grid for Price/Retail/Discount
- 3-column grid for Stock/Qty/Unit
- Full-width status select

### SECTION 4: PRODUCT DETAILS
**Fields:**
- Color (text, optional, e.g., "Blue")
- Size (text, optional, e.g., "A4, Large")
- Material (text, optional, e.g., "Paper, Plastic")
- Country of Origin (text, optional, default "India")
- Weight (number, optional, step 0.01)
- Weight Unit (dropdown: g, kg, ml, l)
- Warranty (text, optional, e.g., "1 Year")
- Min Order Qty (number, optional)
- Max Order Qty (number, optional, "Leave empty for no limit")

**Layout:**
- 2-column grid for Color/Size
- 2-column grid for Material/Country
- 3-column grid for Weight/WeightUnit/Warranty
- 2-column grid for Min/Max Order Qty

### SECTION 5: DIMENSIONS (Optional)
**Fields:**
- Length (number, optional, step 0.01)
- Width (number, optional, step 0.01)
- Height (number, optional, step 0.01)
- Breadth (number, optional, step 0.01)
- Dimension Unit (dropdown: cm, mm, inches, meters)

**Layout:** 5-column grid (4 inputs + 1 unit select)

### SECTION 6: GST RATES (Optional)
**Fields:**
- CGST (%) (number, optional, step 0.01, min 0, max 100, e.g., "9")
- SGST (%) (number, optional, step 0.01, min 0, max 100, e.g., "9")
- IGST (%) (number, optional, step 0.01, min 0, max 100, e.g., "18")

**Note:** "Enter GST rates in percentage. Leave empty to use store default."

**Layout:** 3-column grid

### SECTION 7: VARIATIONS (Color/Size)
**Fields (Dynamic Array):**
- Color (text, optional)
- Size (text, optional)
- Qty (number, optional)
- SKU (text, optional)
- Price (number, optional)
- Remove button (✕)

**Controls:**
- "+ Add Variation" button to add new variation
- Each variation in gray box with 6-column grid
- Remove button for each variation

**Layout:** Dynamic rows with 6-column grid per variation

### SECTION 8: FEATURES
**Fields:**
- Feature input (text, optional, "Add a feature...")
- Add button
- Display as tags with remove buttons

**Controls:**
- Text input with "Add" button
- Enter key triggers add
- Features display as colored tags with ✕ remove button

**Layout:** Input + button row, then flex wrap for tags

### SECTION 9: SPECIFICATIONS
**Fields (Dynamic Array):**
- Key (text, optional, e.g., "Pages")
- Value (text, optional, e.g., "200")
- Remove button (✕)

**Controls:**
- "+ Add Spec" button
- Each spec in 5-column grid (2 cols key, 2 cols value, 1 col remove)

**Layout:** Dynamic rows with 5-column grid

### SECTION 10: TAGS & VISIBILITY
**Fields:**
- Tags (text, comma-separated, e.g., "tag1, tag2, tag3")
- isFeatured (checkbox, "Featured Product")
- isNewArrival (checkbox, "New Arrival")
- isBestSeller (checkbox, "Best Seller")

**Layout:** Full-width tags input, then flex wrap for 3 checkboxes

### SECTION 11: RATING & REVIEWS (Optional)
**Fields:**
- Rating (number, optional, step 0.1, min 0, max 5, e.g., "4.5")
- Review Count (number, optional, min 0, e.g., "25")

**Layout:** 2-column grid

### SECTION 12: PRODUCT IMAGES (Sidebar)
**Features:**
- Drag-and-drop or click to upload
- Multiple file support
- Max 5MB per image
- Accepts PNG, JPG
- Shows upload status ("Uploading..." or "Click to upload images")
- Displays uploaded images with preview
- Remove button (✕) on hover
- Shows count of uploaded images

**Layout:** 
- Dashed border upload area
- Uploaded images grid with 32 height (h-32)
- Remove button appears on hover

---

## FORM STATE MANAGEMENT

### State Variables
```typescript
const [loading, setLoading] = useState(false);                    // Submit loading
const [uploading, setUploading] = useState(false);                // Image upload loading
const [error, setError] = useState('');                           // Error messages
const [uploadedImages, setUploadedImages] = useState<any[]>([]);  // Uploaded images array
const [categories, setCategories] = useState<Category[]>([]);     // All categories
const [categorySearch, setCategorySearch] = useState('');         // Category search input
const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // Dropdown visibility
const [filteredCategories, setFilteredCategories] = useState<Category[]>([]); // Filtered categories
const [subcategories, setSubcategories] = useState<Category[]>([]); // Subcategories
const [variations, setVariations] = useState<Variation[]>([]);    // Product variations
const [features, setFeatures] = useState<string[]>([]);           // Product features
const [newFeature, setNewFeature] = useState('');                 // New feature input
const [specifications, setSpecifications] = useState<{key: string; value: string}[]>([]); // Specs
```

### Form Data Object
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

## FORM FUNCTIONS

### fetchCategories()
- Fetches parent categories from `/api/admin/categories?limit=100&parentId=null`
- Sets categories and filteredCategories state
- Called on component mount

### fetchSubcategories(categoryId)
- Fetches subcategories from `/api/admin/categories?limit=100&parentId={categoryId}`
- Sets subcategories state
- Called when category is selected

### handleSelectCategory(category)
- Sets formData.category to category._id
- Clears subcategory
- Updates categorySearch display
- Closes dropdown
- Fetches subcategories

### handleImageUpload(e)
- Accepts multiple files
- Validates max 5MB per file
- Uploads to `/api/admin/upload` via FormData
- Adds uploaded images to uploadedImages array
- Shows error if upload fails

### removeImage(index)
- Removes image from uploadedImages array by index

### addVariation()
- Adds new empty variation object to variations array

### updateVariation(index, field, value)
- Updates specific field in variation at index

### removeVariation(index)
- Removes variation from array by index

### addFeature()
- Adds newFeature to features array if not empty
- Clears newFeature input

### removeFeature(index)
- Removes feature from array by index

### addSpecification()
- Adds new empty spec object {key: '', value: ''} to specifications

### updateSpecification(index, field, value)
- Updates key or value in specification at index

### removeSpecification(index)
- Removes specification from array by index

### handleSubmit(e)
- Validates at least one image uploaded
- Validates category selected
- Builds specifications object from array
- Converts string values to appropriate types:
  - price, retailPrice, discountPrice, weight, cgst, sgst, igst → parseFloat
  - stock, quantityPerItem, minOrderQuantity, maxOrderQuantity → parseInt
  - tags → split by comma, trim, filter empty
  - dimensions → only included if any dimension has value
  - variations → converts quantity and price to numbers
- POSTs to `/api/admin/products`
- Redirects to `/admin/products` on success
- Shows error message on failure

---

## API ENDPOINTS

### POST /api/admin/products (Create Product)
**Authentication:** Admin only
**Validation:** productSchema (Zod)
**Checks:**
- Duplicate slug validation
**Returns:** Created product object
**Status:** 201 on success, 400/401/500 on error

### PUT /api/admin/products/[id] (Update Product)
**Authentication:** Admin only
**Validation:** Full productSchema validation
**Returns:** Updated product object
**Status:** 200 on success, 400/401/404/500 on error

### PATCH /api/admin/products/[id] (Partial Update)
**Authentication:** Admin only
**Validation:** No schema validation (partial update)
**Returns:** Updated product object
**Status:** 200 on success, 400/401/404/500 on error

### DELETE /api/admin/products/[id] (Soft Delete)
**Authentication:** Admin only
**Action:** Sets status to 'inactive'
**Returns:** {message: 'Product deactivated'}
**Status:** 200 on success, 401/404/500 on error

### GET /api/admin/products (List Products)
**Authentication:** Admin only
**Query Params:**
- search (optional) - searches name and SKU
- status (optional) - filters by status
- page (optional, default 1)
- limit (optional, default 10)
**Returns:** {products: [], pagination: {total, page, limit, pages}}

### GET /api/admin/products/[id] (Get Single Product)
**Authentication:** Admin only
**Returns:** Complete product object
**Status:** 200 on success, 401/404/500 on error

### POST /api/admin/products/import (CSV Import)
**Authentication:** Admin only
**Input:** FormData with 'file' field (CSV)
**CSV Headers:** SKU, Item Name, Slug, Price, Retail Price, Discount Price, Status, Description, Stock, Category, Sub Category, Tags, Images, Rating, Review Count, HSN, Brand, Manufacturer, Qty Per Item, Unit, Weight, Weight Unit, Material, Color, Size, Warranty, Country Of Origin, Min Order Qty, Max Order Qty, Is Featured, Is New Arrival, Is Best Seller, Features, Specifications, Length, Width, Height, Breadth, Dimension Unit, CGST, SGST, IGST
**Features:**
- Auto-generates SKU if missing (format: SLUG_TIMESTAMP)
- Validates required fields: Item Name, Slug, Price, Category
- Updates existing by SKU (primary) or slug (fallback)
- Returns detailed results with error messages
**Returns:** {success: true, message: string, results: {imported, updated, failed, errors}}

### GET /api/admin/products/export (CSV Export)
**Authentication:** Admin only
**Returns:** CSV file download
**Filename:** products-{date}.csv
**Content:** All products with mapped category names

---

## VALIDATION SCHEMA (Zod)

### Required Fields
- name: min 1 char
- slug: min 1 char
- description: min 10 chars
- category: min 1 char
- price: min 0
- stock: min 0

### Optional Fields with Constraints
- rating: 0-5 range
- weight: min 0
- quantityPerItem: min 1
- minOrderQuantity: min 1
- maxOrderQuantity: min 1
- cgst, sgst, igst: min 0

### Unique Constraints
- SKU (uppercase)
- Slug (lowercase)

### Type Coercion
- Numbers coerced from strings
- Arrays validated for string elements
- Nested objects validated recursively

---

## CSV TEMPLATE STRUCTURE

**File:** `public/products-template.csv`

**Headers (40 columns):**
1. SKU
2. Item Name
3. Slug
4. Price
5. Retail Price
6. Discount Price
7. Status
8. Description
9. Stock
10. Category
11. Sub Category
12. Tags
13. Images
14. Rating
15. Review Count
16. HSN
17. Brand
18. Manufacturer
19. Qty Per Item
20. Unit
21. Weight
22. Weight Unit
23. Material
24. Color
25. Size
26. Warranty
27. Country Of Origin
28. Min Order Qty
29. Max Order Qty
30. Is Featured
31. Is New Arrival
32. Is Best Seller
33. Features
34. Specifications
35. Length
36. Width
37. Height
38. Breadth
39. Dimension Unit
40. CGST
41. SGST
42. IGST

**Example Row:**
```
SKU001,Classmate Notebook 200 Pages,classmate-notebook-200-pages,120,150,99,active,Premium quality ruled notebook with 200 pages. Perfect for school and college students.,100,books,notebooks,notebook; classmate; school,https://picsum.photos/400/500?random=1,4.5,125,4820,Classmate,ITC Limited,1,piece,250,g,Paper,Blue,A4,1 Year,India,1,10,true,true,false,Single line ruled; Smooth paper; Durable binding; Eco-friendly,Pages:200;Ruling:Single Line;Paper GSM:70,29.7,21,1,,cm,9,9,
```

**Delimiters:**
- Tags: semicolon (;)
- Images: semicolon (;)
- Features: semicolon (;)
- Specifications: key:value pairs separated by semicolon

---

## IMAGE UPLOAD

### Endpoint: POST /api/admin/upload
**Input:** FormData with 'file' field
**Output:** {secure_url: string}
**Provider:** Cloudinary
**Constraints:**
- Max 5MB per file
- Accepts PNG, JPG
- Multiple files supported

---

## DATABASE INDEXES

Indexes created on Product model:
- category
- subcategory
- tags
- status
- brand
- manufacturer
- color
- size
- isFeatured
- isNewArrival
- isBestSeller

---

## COMPONENT DEPENDENCIES

**UI Components:**
- `Input.tsx` - Text input with label and error support
- `Button.tsx` - Button with variants (primary, secondary, outline) and sizes (sm, md, lg)
- `Card.tsx` - Container component
- `AdminLayout.tsx` - Admin page wrapper

**Hooks:**
- useRouter (next/navigation)
- useState (react)
- useEffect (react)

---

## DATA FLOW

### Create Product Flow
1. User fills form in admin panel
2. User uploads images (Cloudinary)
3. User submits form
4. Form validates:
   - At least one image
   - Category selected
   - All required fields
5. Form data converted to API format
6. POST to `/api/admin/products`
7. Server validates with Zod schema
8. Server checks for duplicate slug
9. Product created in MongoDB
10. Redirect to `/admin/products`

### Update Product Flow
1. Fetch product from `/api/admin/products/[id]`
2. Populate form with existing data
3. User modifies fields
4. User uploads new images (optional)
5. User submits form
6. Form data converted to API format
7. PUT to `/api/admin/products/[id]`
8. Server validates with Zod schema
9. Product updated in MongoDB
10. Redirect to `/admin/products`

### CSV Import Flow
1. User selects CSV file
2. POST to `/api/admin/products/import`
3. Server parses CSV
4. For each row:
   - Validate required fields
   - Auto-generate SKU if missing
   - Validate category exists
   - Check if product exists by SKU or slug
   - Create new or update existing
5. Return detailed results with error messages

### CSV Export Flow
1. User clicks export
2. GET `/api/admin/products/export`
3. Server fetches all products
4. Maps category slugs to names
5. Formats arrays as delimited strings
6. Generates CSV content
7. Returns as downloadable file

---

## KEY FEATURES

### Auto-Generation
- SKU: Generated from slug if not provided (format: SLUG_TIMESTAMP)
- Slug: Should be manually provided or auto-generated from name

### Soft Delete
- Products not hard deleted
- Status set to 'inactive'
- Can be reactivated

### Hierarchical Categories
- Parent categories and subcategories
- Subcategories load dynamically based on selected category
- Searchable category selection with autocomplete

### Variations System
- Supports color and size combinations
- Each variation can have unique SKU and price
- Quantity tracking per variation

### Dimensions Handling
- Optional nested object
- Only stored if at least one dimension provided
- Configurable unit (cm, mm, inches, meters)

### GST Rates
- Three separate fields: CGST, SGST, IGST
- Stored as percentages
- Optional - can use store defaults if not specified
- Supports decimal values

### Status Management
- Three statuses: draft, active, inactive
- Default: draft
- Filterable in list view

### Bulk Operations
- CSV import with auto-generation and update logic
- CSV export with proper formatting
- Detailed error reporting

---

## VALIDATION RULES SUMMARY

**Required for Creation:**
- Product Name
- Slug
- Description (min 10 chars)
- Category
- Price (min 0)
- Stock (min 0)
- At least one image

**Optional but Constrained:**
- Rating: 0-5
- Weight: min 0
- Order Quantities: min 1
- GST Rates: 0-100%

**Unique:**
- SKU (case-insensitive, stored uppercase)
- Slug (case-insensitive, stored lowercase)

---

## FORM SUBMISSION DATA STRUCTURE

```json
{
  "sku": "string or undefined",
  "name": "string",
  "slug": "string",
  "description": "string",
  "category": "string (ID)",
  "subcategory": "string or undefined",
  "price": "number",
  "retailPrice": "number or undefined",
  "discountPrice": "number or undefined",
  "stock": "number",
  "tags": ["string"],
  "images": [{"url": "string", "alt": "string"}],
  "rating": "number or undefined",
  "reviewCount": "number or undefined",
  "hsn": "string or undefined",
  "brand": "string or undefined",
  "manufacturer": "string or undefined",
  "quantityPerItem": "number",
  "unit": "string",
  "weight": "number or undefined",
  "weightUnit": "string",
  "material": "string or undefined",
  "color": "string or undefined",
  "size": "string or undefined",
  "warranty": "string or undefined",
  "countryOfOrigin": "string",
  "minOrderQuantity": "number",
  "maxOrderQuantity": "number or undefined",
  "isFeatured": "boolean",
  "isNewArrival": "boolean",
  "isBestSeller": "boolean",
  "dimensions": {
    "length": "number or undefined",
    "width": "number or undefined",
    "height": "number or undefined",
    "breadth": "number or undefined",
    "unit": "string"
  } or undefined,
  "cgst": "number or undefined",
  "sgst": "number or undefined",
  "igst": "number or undefined",
  "variations": [
    {
      "color": "string",
      "size": "string",
      "quantity": "number",
      "sku": "string",
      "price": "number or undefined"
    }
  ],
  "features": ["string"],
  "specifications": {"key": "value"}
}
```

---

## COMPLETE SYSTEM SUMMARY

This is a comprehensive product management system with:
- **50+ product fields** organized into logical sections
- **12-section form** with dynamic arrays for variations, features, and specs
- **Image upload** with Cloudinary integration
- **Category hierarchy** with searchable autocomplete
- **CSV import/export** with auto-generation and bulk updates
- **Validation** at form and API levels
- **Soft delete** for data preservation
- **Status management** (draft, active, inactive)
- **Tax handling** with GST rates
- **Variation support** for color/size combinations
- **Dimension tracking** with configurable units
- **SEO-friendly** with slug and tags
- **Admin authentication** required for all operations

