# ADMIN PRODUCT FORM - VISUAL REFERENCE & QUICK LOOKUP

## FORM LAYOUT OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADD NEW PRODUCT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────┐  ┌──────────────────────┐ │
│  │ MAIN FORM (2/3 width)                        │  │ SIDEBAR (1/3 width)  │ │
│  │                                              │  │                      │ │
│  │ 1. BASIC INFORMATION                         │  │ PRODUCT IMAGES       │ │
│  │    [SKU] [HSN Code]                          │  │                      │ │
│  │    [Product Name]                            │  │ ┌──────────────────┐ │ │
│  │    [Slug]                                    │  │ │ Upload Area      │ │ │
│  │    [Brand] [Manufacturer]                    │  │ │ (Drag & Drop)    │ │ │
│  │                                              │  │ └──────────────────┘ │ │
│  │ 2. DESCRIPTION                               │  │                      │ │
│  │    [Textarea - 4 rows]                       │  │ Uploaded (0):        │ │
│  │                                              │  │ [Image 1] [x]        │ │
│  │ 3. CATEGORY & PRICING                        │  │ [Image 2] [x]        │ │
│  │    [Category Search ▼]                       │  │ [Image 3] [x]        │ │
│  │    [Sub Category ▼]                          │  │                      │ │
│  │    [Price] [Retail] [Discount]               │  │                      │ │
│  │    [Stock] [Qty/Item] [Unit ▼]               │  │                      │ │
│  │    [Status ▼]                                │  │                      │ │
│  │                                              │  │                      │ │
│  │ 4. PRODUCT DETAILS                           │  │                      │ │
│  │    [Color] [Size]                            │  │                      │ │
│  │    [Material] [Country]                      │  │                      │ │
│  │    [Weight] [Unit ▼] [Warranty]              │  │                      │ │
│  │    [Min Qty] [Max Qty]                       │  │                      │ │
│  │                                              │  │                      │ │
│  │ 5. DIMENSIONS (Optional)                     │  │                      │ │
│  │    [Length] [Width] [Height] [Breadth] [Unit]│  │                      │ │
│  │                                              │  │                      │ │
│  │ 6. GST RATES (Optional)                      │  │                      │ │
│  │    [CGST %] [SGST %] [IGST %]                │  │                      │ │
│  │                                              │  │                      │ │
│  │ 7. VARIATIONS (Color/Size)                   │  │                      │ │
│  │    + Add Variation                           │  │                      │ │
│  │    [Color] [Size] [Qty] [SKU] [Price] [x]    │  │                      │ │
│  │    [Color] [Size] [Qty] [SKU] [Price] [x]    │  │                      │ │
│  │                                              │  │                      │ │
│  │ 8. FEATURES                                  │  │                      │ │
│  │    [Feature Input] [Add]                     │  │                      │ │
│  │    [Feature 1] [x] [Feature 2] [x]           │  │                      │ │
│  │                                              │  │                      │ │
│  │ 9. SPECIFICATIONS                            │  │                      │ │
│  │    + Add Spec                                │  │                      │ │
│  │    [Key] [Value] [x]                         │  │                      │ │
│  │    [Key] [Value] [x]                         │  │                      │ │
│  │                                              │  │                      │ │
│  │ 10. TAGS & VISIBILITY                        │  │                      │ │
│  │     [Tags (comma-separated)]                 │  │                      │ │
│  │     ☐ Featured Product                       │  │                      │ │
│  │     ☐ New Arrival                            │  │                      │ │
│  │     ☐ Best Seller                            │  │                      │ │
│  │                                              │  │                      │ │
│  │ 11. RATING & REVIEWS (Optional)              │  │                      │ │
│  │     [Rating 0-5] [Review Count]              │  │                      │ │
│  │                                              │  │                      │ │
│  │ ─────────────────────────────────────────    │  │                      │ │
│  │ [Create Product] [Cancel]                    │  │                      │ │
│  │                                              │  │                      │ │
│  └──────────────────────────────────────────────┘  └──────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## FIELD REFERENCE QUICK LOOKUP

### SECTION 1: BASIC INFORMATION
```
┌─ SKU (Optional, Auto-generated)
│  Type: Text Input
│  Placeholder: "Auto-generated if empty"
│  Behavior: Converts to UPPERCASE
│  Format: If empty, generated as SLUG_TIMESTAMP
│
├─ HSN Code (Optional)
│  Type: Text Input
│  Placeholder: "e.g., 4820"
│  Purpose: Tax classification code
│
├─ Product Name (Required)
│  Type: Text Input
│  Validation: Min 1 character
│
├─ Slug (Required)
│  Type: Text Input
│  Placeholder: "product-name"
│  Validation: Min 1 character, must be unique
│  Format: Lowercase, URL-friendly
│
├─ Brand (Optional)
│  Type: Text Input
│  Placeholder: "e.g., Classmate"
│
└─ Manufacturer (Optional)
   Type: Text Input
   Placeholder: "e.g., ITC Limited"
```

### SECTION 2: DESCRIPTION
```
┌─ Description (Required)
   Type: Textarea
   Rows: 4
   Validation: Min 10 characters
   Purpose: Detailed product description
```

### SECTION 3: CATEGORY & PRICING
```
┌─ Category (Required)
│  Type: Searchable Dropdown with Autocomplete
│  Source: /api/admin/categories?limit=100&parentId=null
│  Behavior: 
│    - Shows filtered list as user types
│    - Clicking category loads subcategories
│    - Shows "✓ Category selected" when chosen
│
├─ Sub Category (Conditional)
│  Type: Dropdown Select
│  Appears: Only if category selected
│  Source: /api/admin/categories?limit=100&parentId={categoryId}
│
├─ Price (Required)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│  Label: "Price (₹)"
│  Purpose: Selling price
│
├─ Retail Price / MRP (Optional)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│  Label: "Retail Price / MRP (₹)"
│
├─ Discount Price (Optional)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│  Label: "Discount Price (₹)"
│
├─ Stock (Required)
│  Type: Number Input
│  Min: 0
│  Purpose: Available quantity
│
├─ Qty per Item (Optional)
│  Type: Number Input
│  Default: 1
│  Purpose: Items per pack/box
│
├─ Unit (Optional)
│  Type: Dropdown Select
│  Default: "piece"
│  Options: piece, pack, box, set, dozen, kg, g
│
└─ Status (Optional)
   Type: Dropdown Select
   Default: "draft"
   Options: draft, active, inactive
```

### SECTION 4: PRODUCT DETAILS
```
┌─ Color (Optional)
│  Type: Text Input
│  Placeholder: "e.g., Blue"
│
├─ Size (Optional)
│  Type: Text Input
│  Placeholder: "e.g., A4, Large"
│
├─ Material (Optional)
│  Type: Text Input
│  Placeholder: "e.g., Paper, Plastic"
│
├─ Country of Origin (Optional)
│  Type: Text Input
│  Default: "India"
│
├─ Weight (Optional)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│
├─ Weight Unit (Optional)
│  Type: Dropdown Select
│  Default: "g"
│  Options: g, kg, ml, l
│
├─ Warranty (Optional)
│  Type: Text Input
│  Placeholder: "e.g., 1 Year"
│
├─ Min Order Qty (Optional)
│  Type: Number Input
│  Default: 1
│  Min: 1
│
└─ Max Order Qty (Optional)
   Type: Number Input
   Min: 1
   Placeholder: "Leave empty for no limit"
```

### SECTION 5: DIMENSIONS (Optional)
```
┌─ Length (Optional)
│  Type: Number Input
│  Step: 0.01
│
├─ Width (Optional)
│  Type: Number Input
│  Step: 0.01
│
├─ Height (Optional)
│  Type: Number Input
│  Step: 0.01
│
├─ Breadth (Optional)
│  Type: Number Input
│  Step: 0.01
│
└─ Dimension Unit (Optional)
   Type: Dropdown Select
   Default: "cm"
   Options: cm, mm, inches, meters
   Note: Only stored if at least one dimension provided
```

### SECTION 6: GST RATES (Optional)
```
Note: "Enter GST rates in percentage. Leave empty to use store default."

┌─ CGST (%) (Optional)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│  Max: 100
│  Placeholder: "e.g., 9"
│
├─ SGST (%) (Optional)
│  Type: Number Input
│  Step: 0.01
│  Min: 0
│  Max: 100
│  Placeholder: "e.g., 9"
│
└─ IGST (%) (Optional)
   Type: Number Input
   Step: 0.01
   Min: 0
   Max: 100
   Placeholder: "e.g., 18"
```

### SECTION 7: VARIATIONS (Color/Size)
```
Dynamic Array - Each variation has:

┌─ Color (Optional)
│  Type: Text Input
│
├─ Size (Optional)
│  Type: Text Input
│
├─ Qty (Optional)
│  Type: Number Input
│
├─ SKU (Optional)
│  Type: Text Input
│
├─ Price (Optional)
│  Type: Number Input
│
└─ Remove Button (✕)
   Type: Button
   Action: Removes this variation

Controls:
- "+ Add Variation" button to add new row
- Each variation in gray box (bg-gray-50)
- 6-column grid layout
```

### SECTION 8: FEATURES
```
Input Row:
┌─ Feature Input (Optional)
│  Type: Text Input
│  Placeholder: "Add a feature..."
│  Behavior: Enter key triggers add
│
└─ Add Button
   Type: Button
   Action: Adds feature to list

Display:
- Features shown as colored tags (bg-primary-100, text-primary-700)
- Each tag has remove button (✕)
- Flex wrap layout
```

### SECTION 9: SPECIFICATIONS
```
Dynamic Array - Each spec has:

┌─ Key (Optional)
│  Type: Text Input
│  Placeholder: "e.g., Pages"
│  Span: 2 columns
│
├─ Value (Optional)
│  Type: Text Input
│  Placeholder: "e.g., 200"
│  Span: 2 columns
│
└─ Remove Button (✕)
   Type: Button
   Action: Removes this spec
   Span: 1 column

Controls:
- "+ Add Spec" button to add new row
- 5-column grid layout per row
```

### SECTION 10: TAGS & VISIBILITY
```
┌─ Tags (Optional)
│  Type: Text Input
│  Placeholder: "tag1, tag2, tag3"
│  Format: Comma-separated
│  Processing: Split by comma, trimmed, filtered
│
├─ Featured Product (Optional)
│  Type: Checkbox
│  Default: false
│
├─ New Arrival (Optional)
│  Type: Checkbox
│  Default: false
│
└─ Best Seller (Optional)
   Type: Checkbox
   Default: false
```

### SECTION 11: RATING & REVIEWS (Optional)
```
┌─ Rating (Optional)
│  Type: Number Input
│  Step: 0.1
│  Min: 0
│  Max: 5
│  Placeholder: "e.g., 4.5"
│
└─ Review Count (Optional)
   Type: Number Input
   Min: 0
   Placeholder: "e.g., 25"
```

### SECTION 12: PRODUCT IMAGES (Sidebar)
```
Upload Area:
┌─ Dashed Border Box
│  Type: File Input (hidden)
│  Accept: image/*
│  Multiple: true
│  Max Size: 5MB per file
│  Disabled: During upload
│  Text: "Click to upload images" or "Uploading..."
│  Subtext: "PNG, JPG up to 5MB each"
│
Uploaded Images:
├─ Count Display: "Uploaded (n)"
│
└─ Image Grid:
   - Each image: h-32 (128px height)
   - Relative positioning for hover
   - Remove button (✕) appears on hover
   - Shows image preview
```

---

## FORM SUBMISSION BUTTON

```
┌─ Create Product Button
│  Type: Primary Button
│  Size: Large
│  State: Shows loading spinner when submitting
│  Action: Submits form to /api/admin/products
│
└─ Cancel Button
   Type: Outline Button
   Size: Large
   Action: Goes back to previous page
```

---

## VALIDATION FLOW

```
CLIENT-SIDE VALIDATION:
1. At least one image uploaded? → Error: "Please upload at least one image"
2. Category selected? → Error: "Please select a category"

SERVER-SIDE VALIDATION (Zod Schema):
1. name: min 1 char
2. slug: min 1 char
3. description: min 10 chars
4. category: min 1 char
5. price: min 0
6. stock: min 0
7. rating: 0-5 range (if provided)
8. weight: min 0 (if provided)
9. quantityPerItem: min 1 (if provided)
10. minOrderQuantity: min 1 (if provided)
11. maxOrderQuantity: min 1 (if provided)
12. cgst, sgst, igst: min 0 (if provided)
13. Unique: SKU, Slug

DUPLICATE CHECK:
- Slug must be unique in database
```

---

## DATA TYPE CONVERSIONS ON SUBMIT

```
String → Number:
- price → parseFloat
- retailPrice → parseFloat
- discountPrice → parseFloat
- weight → parseFloat
- cgst → parseFloat
- sgst → parseFloat
- igst → parseFloat
- stock → parseInt
- quantityPerItem → parseInt
- minOrderQuantity → parseInt
- maxOrderQuantity → parseInt
- rating → parseFloat
- reviewCount → parseInt

String → Array:
- tags → split(',').map(trim).filter(Boolean)

Array Processing:
- variations: quantity → parseInt, price → parseFloat
- features: kept as-is
- specifications: converted to object {key: value}

Conditional Inclusion:
- dimensions: only if any dimension has value
- retailPrice: only if provided
- discountPrice: only if provided
- rating: only if provided
- reviewCount: only if provided
- specifications: only if has keys
```

---

## ERROR HANDLING

```
Upload Errors:
- File too large: "Image '{filename}' is too large. Maximum is 5MB."
- Upload failed: "Image upload failed"

Form Errors:
- No images: "Please upload at least one image"
- No category: "Please select a category"
- API error: Shows error message from server

Success:
- Redirects to /admin/products
```

---

## KEYBOARD SHORTCUTS

```
- Enter in Feature input: Adds feature
- Tab: Moves to next field
- Shift+Tab: Moves to previous field
```

---

## RESPONSIVE BEHAVIOR

```
Desktop (lg):
- Main form: 2/3 width
- Sidebar: 1/3 width
- Side-by-side layout

Mobile/Tablet:
- Main form: Full width
- Sidebar: Full width below form
- Stacked layout
```

---

## CATEGORY AUTOCOMPLETE BEHAVIOR

```
1. User types in category search
2. Dropdown shows filtered categories
3. User clicks category
4. Category name displayed in search field
5. Dropdown closes
6. Subcategories fetched and loaded
7. Subcategory dropdown becomes available
8. Green checkmark shows "✓ Category selected"
```

---

## IMAGE UPLOAD BEHAVIOR

```
1. User clicks upload area or drags files
2. File input dialog opens (if clicked)
3. User selects multiple images
4. For each image:
   - Check size (max 5MB)
   - Upload to /api/admin/upload
   - Get secure_url from Cloudinary
   - Add to uploadedImages array
5. Images display with preview
6. User can remove images by clicking ✕
7. Removed images not sent to server
```

---

## FORM STATE PERSISTENCE

```
Form data persists while:
- Uploading images
- Adding/removing variations
- Adding/removing features
- Adding/removing specifications

Form data cleared on:
- Successful submission (redirect)
- Page refresh
- Navigation away
```

