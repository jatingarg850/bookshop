# ADMIN PRODUCT SYSTEM - QUICK REFERENCE GUIDE

## ROUTE & FILES
- **URL**: http://localhost:3000/admin/products/new
- **Main File**: `app/admin/products/new/page.tsx` (678 lines)
- **Model**: `lib/db/models/Product.ts`
- **Validation**: `lib/validations/product.ts`
- **APIs**: `app/api/admin/products/route.ts`, `app/api/admin/products/[id]/route.ts`
- **Import/Export**: `app/api/admin/products/import/route.ts`, `app/api/admin/products/export/route.ts`

---

## PRODUCT FIELDS CHECKLIST

### REQUIRED FIELDS
- [ ] Product Name (min 1 char)
- [ ] Slug (min 1 char, unique, lowercase)
- [ ] Description (min 10 chars)
- [ ] Category (required)
- [ ] Price (min 0)
- [ ] Stock (min 0)
- [ ] At least 1 Image

### OPTIONAL BUT IMPORTANT
- [ ] SKU (auto-generated if empty)
- [ ] HSN Code (tax classification)
- [ ] Brand
- [ ] Manufacturer
- [ ] Retail Price / MRP
- [ ] Discount Price
- [ ] Status (draft/active/inactive)

### PRODUCT DETAILS
- [ ] Color
- [ ] Size
- [ ] Material
- [ ] Country of Origin (default: India)
- [ ] Weight & Unit
- [ ] Warranty
- [ ] Min Order Qty (default: 1)
- [ ] Max Order Qty

### INVENTORY
- [ ] Qty per Item (default: 1)
- [ ] Unit (piece/pack/box/set/dozen/kg/g)

### DIMENSIONS (Optional)
- [ ] Length
- [ ] Width
- [ ] Height
- [ ] Breadth
- [ ] Dimension Unit (cm/mm/inches/meters)

### GST (Optional)
- [ ] CGST (%)
- [ ] SGST (%)
- [ ] IGST (%)

### VARIATIONS (Optional)
- [ ] Color
- [ ] Size
- [ ] Quantity per variation
- [ ] SKU per variation
- [ ] Price per variation

### CONTENT
- [ ] Features (array)
- [ ] Specifications (key-value pairs)
- [ ] Tags (comma-separated)

### VISIBILITY
- [ ] Featured Product (checkbox)
- [ ] New Arrival (checkbox)
- [ ] Best Seller (checkbox)

### RATING (Optional)
- [ ] Rating (0-5)
- [ ] Review Count

---

## FORM SECTIONS QUICK MAP

| Section | Fields | Required | Type |
|---------|--------|----------|------|
| 1. Basic Info | SKU, HSN, Name, Slug, Brand, Manufacturer | Name, Slug | Text |
| 2. Description | Description | Yes | Textarea |
| 3. Category & Pricing | Category, SubCat, Price, Retail, Discount, Stock, Qty, Unit, Status | Category, Price, Stock | Mixed |
| 4. Product Details | Color, Size, Material, Country, Weight, Unit, Warranty, Min/Max Qty | No | Text/Number |
| 5. Dimensions | Length, Width, Height, Breadth, Unit | No | Number |
| 6. GST Rates | CGST, SGST, IGST | No | Number |
| 7. Variations | Color, Size, Qty, SKU, Price (dynamic) | No | Dynamic Array |
| 8. Features | Feature input (dynamic) | No | Array |
| 9. Specifications | Key-Value pairs (dynamic) | No | Object |
| 10. Tags & Visibility | Tags, Featured, NewArrival, BestSeller | No | Mixed |
| 11. Rating & Reviews | Rating, ReviewCount | No | Number |
| 12. Images | Image upload (sidebar) | Yes | File Upload |

---

## FORM STATE VARIABLES

```
Core State:
- loading: boolean (submit loading)
- uploading: boolean (image upload loading)
- error: string (error messages)

Data State:
- formData: object (all form fields)
- uploadedImages: array (uploaded images)
- variations: array (product variations)
- features: array (product features)
- specifications: array (key-value specs)

UI State:
- categories: array (all categories)
- filteredCategories: array (filtered categories)
- subcategories: array (subcategories)
- categorySearch: string (search input)
- showCategoryDropdown: boolean (dropdown visibility)
- newFeature: string (new feature input)
```

---

## KEY FUNCTIONS

| Function | Purpose | Triggers |
|----------|---------|----------|
| fetchCategories() | Load parent categories | Component mount |
| fetchSubcategories(id) | Load subcategories | Category selected |
| handleSelectCategory(cat) | Set category & load subs | Category clicked |
| handleImageUpload(e) | Upload images to Cloudinary | File selected |
| removeImage(idx) | Remove uploaded image | Remove button clicked |
| addVariation() | Add new variation row | Add button clicked |
| updateVariation(idx, field, val) | Update variation field | Input changed |
| removeVariation(idx) | Remove variation row | Remove button clicked |
| addFeature() | Add feature to list | Add button or Enter |
| removeFeature(idx) | Remove feature | Remove button clicked |
| addSpecification() | Add spec row | Add button clicked |
| updateSpecification(idx, field, val) | Update spec field | Input changed |
| removeSpecification(idx) | Remove spec row | Remove button clicked |
| handleSubmit(e) | Submit form to API | Form submitted |

---

## API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/admin/products | Create product | Admin |
| GET | /api/admin/products | List products | Admin |
| GET | /api/admin/products/[id] | Get single product | Admin |
| PUT | /api/admin/products/[id] | Update product | Admin |
| PATCH | /api/admin/products/[id] | Partial update | Admin |
| DELETE | /api/admin/products/[id] | Soft delete (set inactive) | Admin |
| POST | /api/admin/products/import | CSV import | Admin |
| GET | /api/admin/products/export | CSV export | Admin |
| POST | /api/admin/upload | Upload image | Admin |
| GET | /api/admin/categories | Get categories | Admin |

---

## VALIDATION RULES

### String Fields
- name: min 1 char
- slug: min 1 char, unique, lowercase
- description: min 10 chars
- category: min 1 char

### Number Fields
- price: min 0
- stock: min 0
- rating: 0-5 range
- weight: min 0
- quantityPerItem: min 1
- minOrderQuantity: min 1
- maxOrderQuantity: min 1
- cgst, sgst, igst: 0-100%

### Unique Constraints
- SKU (uppercase)
- Slug (lowercase)

### Array Fields
- images: required (min 1)
- tags: optional, comma-separated
- features: optional
- specifications: optional key-value pairs
- variations: optional

---

## DATA TYPE CONVERSIONS

```
String → Number:
price, retailPrice, discountPrice, weight, cgst, sgst, igst → parseFloat
stock, quantityPerItem, minOrderQuantity, maxOrderQuantity, rating, reviewCount → parseInt

String → Array:
tags → split(',').map(trim).filter(Boolean)

Array Processing:
variations: quantity → parseInt, price → parseFloat
features: kept as-is
specifications: converted to object {key: value}

Conditional:
dimensions: only if any dimension has value
retailPrice, discountPrice, rating, reviewCount: only if provided
specifications: only if has keys
```

---

## ERROR MESSAGES

| Error | Cause | Solution |
|-------|-------|----------|
| "Please upload at least one image" | No images uploaded | Upload at least 1 image |
| "Please select a category" | Category not selected | Select category from dropdown |
| "Image '{name}' is too large" | File > 5MB | Use smaller image (max 5MB) |
| "Image upload failed" | Upload error | Check file format (PNG/JPG) |
| "Slug already exists" | Duplicate slug | Use unique slug |
| "Product name is required" | Empty name | Enter product name |
| "Slug is required" | Empty slug | Enter slug |
| "Description must be at least 10 characters" | Short description | Add more details (min 10 chars) |
| "Category is required" | Empty category | Select category |
| "Price must be positive" | Negative price | Enter positive price |
| "Stock must be non-negative" | Negative stock | Enter non-negative stock |

---

## FORM SUBMISSION FLOW

```
1. User fills form
2. User uploads images
3. User clicks "Create Product"
4. handleSubmit() called
5. Validate: images uploaded? ✓
6. Validate: category selected? ✓
7. Build specifications object
8. Convert data types
9. POST to /api/admin/products
10. Server validates with Zod schema
11. Server checks duplicate slug
12. Product created in MongoDB
13. Redirect to /admin/products
```

---

## CSV IMPORT/EXPORT

### CSV Headers (40 columns)
SKU, Item Name, Slug, Price, Retail Price, Discount Price, Status, Description, Stock, Category, Sub Category, Tags, Images, Rating, Review Count, HSN, Brand, Manufacturer, Qty Per Item, Unit, Weight, Weight Unit, Material, Color, Size, Warranty, Country Of Origin, Min Order Qty, Max Order Qty, Is Featured, Is New Arrival, Is Best Seller, Features, Specifications, Length, Width, Height, Breadth, Dimension Unit, CGST, SGST, IGST

### CSV Delimiters
- Tags: semicolon (;)
- Images: semicolon (;)
- Features: semicolon (;)
- Specifications: key:value pairs separated by semicolon

### Import Features
- Auto-generates SKU if missing (SLUG_TIMESTAMP)
- Updates existing by SKU (primary) or slug (fallback)
- Validates required fields
- Returns detailed error report

### Export Features
- Maps category slugs to names
- Joins arrays with delimiters
- Escapes CSV special characters
- Downloads as products-{date}.csv

---

## KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Enter (in Feature input) | Add feature |
| Tab | Move to next field |
| Shift+Tab | Move to previous field |

---

## RESPONSIVE DESIGN

| Breakpoint | Layout |
|------------|--------|
| Desktop (lg) | 2-column: form (2/3) + sidebar (1/3) |
| Tablet/Mobile | 1-column: form full width, sidebar below |

---

## CATEGORY AUTOCOMPLETE FLOW

```
1. User types in category search
2. Categories filtered in real-time
3. Dropdown shows filtered results
4. User clicks category
5. Category name displayed in search
6. Dropdown closes
7. Subcategories fetched
8. Subcategory dropdown enabled
9. Green checkmark shows "✓ Category selected"
```

---

## IMAGE UPLOAD FLOW

```
1. User clicks upload area or drags files
2. File dialog opens (if clicked)
3. User selects multiple images
4. For each image:
   a. Check size (max 5MB)
   b. Upload to /api/admin/upload
   c. Get secure_url from Cloudinary
   d. Add to uploadedImages array
5. Images display with preview
6. User can remove images
7. Removed images not sent to server
```

---

## VARIATIONS MANAGEMENT FLOW

```
1. User clicks "+ Add Variation"
2. New empty variation row added
3. User fills: Color, Size, Qty, SKU, Price
4. User can add more variations
5. User can remove variations with ✕
6. On submit, variations converted to numbers
7. Sent to server as array
```

---

## FEATURES MANAGEMENT FLOW

```
1. User types feature in input
2. User clicks "Add" or presses Enter
3. Feature added to list as tag
4. User can add more features
5. User can remove features with ✕
6. On submit, features sent as array
```

---

## SPECIFICATIONS MANAGEMENT FLOW

```
1. User clicks "+ Add Spec"
2. New empty spec row added (Key, Value)
3. User fills Key and Value
4. User can add more specs
5. User can remove specs with ✕
6. On submit, specs converted to object {key: value}
```

---

## COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| Form won't submit | Missing required field | Check all required fields filled |
| Images not uploading | File too large | Use images < 5MB |
| Category dropdown empty | API error | Check /api/admin/categories endpoint |
| Slug already exists error | Duplicate slug | Use unique slug |
| Form data lost on refresh | No persistence | Form data only in memory |
| Variations not saving | Type conversion error | Check quantity/price are numbers |
| Specifications not saving | Empty keys | Fill both key and value |

---

## PERFORMANCE TIPS

1. **Image Optimization**: Compress images before upload
2. **Batch Operations**: Use CSV import for bulk products
3. **Category Caching**: Categories fetched once on mount
4. **Lazy Loading**: Subcategories loaded on demand
5. **Debouncing**: Category search filters in real-time

---

## SECURITY NOTES

1. **Authentication**: Admin role required for all operations
2. **Validation**: Zod schema validates all data server-side
3. **File Upload**: Max 5MB, PNG/JPG only
4. **SQL Injection**: MongoDB prevents injection attacks
5. **CSRF**: NextAuth handles CSRF protection

---

## DATABASE INDEXES

Indexes created for performance:
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

## RELATED PAGES

- **Products List**: /admin/products
- **Edit Product**: /admin/products/[id]
- **Categories**: /admin/categories
- **Dashboard**: /admin

---

## USEFUL LINKS

- **Product Model**: lib/db/models/Product.ts
- **Validation Schema**: lib/validations/product.ts
- **API Routes**: app/api/admin/products/
- **CSV Template**: public/products-template.csv
- **UI Components**: components/ui/

---

## COMPLETE FIELD COUNT

- **Total Fields**: 50+
- **Required Fields**: 6 (name, slug, description, category, price, stock, images)
- **Optional Fields**: 44+
- **Dynamic Arrays**: 3 (variations, features, specifications)
- **Nested Objects**: 1 (dimensions)

---

## FORM SUBMISSION PAYLOAD STRUCTURE

```json
{
  "sku": "string or undefined",
  "name": "string",
  "slug": "string",
  "description": "string",
  "category": "string",
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

## SUMMARY

This is a comprehensive product management system with:
- **12 form sections** organized logically
- **50+ product fields** covering all aspects
- **Dynamic arrays** for variations, features, specs
- **Image upload** with Cloudinary
- **Category hierarchy** with autocomplete
- **CSV import/export** with bulk operations
- **Full validation** at form and API levels
- **Admin authentication** required
- **Soft delete** for data preservation
- **Status management** (draft/active/inactive)
- **Tax handling** with GST rates
- **Variation support** for color/size
- **Dimension tracking** with units
- **SEO-friendly** with slugs and tags

