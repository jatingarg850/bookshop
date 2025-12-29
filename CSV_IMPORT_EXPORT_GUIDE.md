# CSV Import/Export Guide - Updated with New Columns

## Overview
The CSV import/export functionality now includes all product fields including weight, dimensions, and tax information.

## CSV Columns

### Basic Information
- **SKU**: Stock Keeping Unit (auto-generated if empty)
- **Item Name**: Product name (required)
- **Slug**: URL-friendly product identifier (required)
- **Price**: Base price in rupees (required)
- **Retail Price**: Original retail price (optional)
- **Discount Price**: Discounted price (optional)
- **Status**: Product status - `active`, `inactive`, or `draft` (required)
- **Description**: Product description (required)
- **Stock**: Available quantity (required)

### Category & Classification
- **Category**: Product category name (required) - must match existing category
- **Sub Category**: Sub-category name (optional)
- **Tags**: Comma-separated tags (optional)
- **HSN**: HSN code for tax purposes (optional)
- **Brand**: Brand name (optional)
- **Manufacturer**: Manufacturer name (optional)

### Pricing & Quantity
- **Qty Per Item**: Quantity per unit (optional, default: 1)
- **Unit**: Unit type - `piece`, `pack`, `box`, `set`, `dozen`, `kg` (optional)
- **Min Order Qty**: Minimum order quantity (optional)
- **Max Order Qty**: Maximum order quantity (optional)

### Physical Properties
- **Weight**: Product weight (optional)
- **Weight Unit**: Weight unit - `g`, `kg`, `ml`, `l` (optional, default: g)
- **Material**: Material composition (optional)
- **Color**: Product color (optional)
- **Size**: Product size (optional)
- **Warranty**: Warranty information (optional)
- **Country Of Origin**: Country of origin (optional, default: India)

### Dimensions
- **Length**: Length in specified unit (optional)
- **Width**: Width in specified unit (optional)
- **Height**: Height in specified unit (optional)
- **Breadth**: Breadth in specified unit (optional)
- **Dimension Unit**: Dimension unit - `cm`, `mm`, `in`, `m` (optional, default: cm)

### Tax Information
- **CGST**: Central GST percentage (optional, e.g., 5)
- **SGST**: State GST percentage (optional, e.g., 5)
- **IGST**: Integrated GST percentage (optional, e.g., 18)

### Media & Content
- **Images**: Semicolon-separated image URLs (optional)
- **Rating**: Product rating 0-5 (optional)
- **Review Count**: Number of reviews (optional)
- **Features**: Semicolon-separated features (optional)
- **Specifications**: Key:value pairs separated by semicolons (optional, e.g., `Pages:200;Ruling:Single Line`)

### Visibility & Flags
- **Is Featured**: `true` or `false` (optional, default: false)
- **Is New Arrival**: `true` or `false` (optional, default: false)
- **Is Best Seller**: `true` or `false` (optional, default: false)

## CSV Format Examples

### Minimal Product (Required Fields Only)
```csv
SKU,Item Name,Slug,Price,Status,Description,Stock,Category
SKU001,My Product,my-product,100,active,A great product,50,books
```

### Complete Product (All Fields)
```csv
SKU,Item Name,Slug,Price,Retail Price,Discount Price,Status,Description,Stock,Category,Sub Category,Tags,Images,Rating,Review Count,HSN,Brand,Manufacturer,Qty Per Item,Unit,Weight,Weight Unit,Material,Color,Size,Warranty,Country Of Origin,Min Order Qty,Max Order Qty,Is Featured,Is New Arrival,Is Best Seller,Features,Specifications,Length,Width,Height,Breadth,Dimension Unit,CGST,SGST,IGST
SKU001,Classmate Notebook,classmate-notebook,120,150,99,active,Premium notebook,100,books,notebooks,notebook; school,https://example.com/image.jpg,4.5,125,4820,Classmate,ITC Limited,1,piece,250,g,Paper,Blue,A4,1 Year,India,1,10,true,true,false,Single line ruled; Smooth paper,Pages:200;Ruling:Single Line,29.7,21,1,0.5,cm,5,5,8
```

## Import Instructions

### Step 1: Prepare CSV File
1. Download the template from `/public/products-template.csv`
2. Fill in your product data
3. Ensure all required fields are populated
4. Use correct format for special fields (see below)

### Step 2: Format Special Fields

#### Tags (Comma-Separated)
```
notebook; school; stationery
```

#### Images (Semicolon-Separated URLs)
```
https://example.com/image1.jpg; https://example.com/image2.jpg
```

#### Features (Semicolon-Separated)
```
Single line ruled; Smooth paper; Durable binding
```

#### Specifications (Key:Value Pairs, Semicolon-Separated)
```
Pages:200; Ruling:Single Line; Paper GSM:70
```

#### Boolean Fields (Is Featured, Is New Arrival, Is Best Seller)
```
true
false
```

#### Dimensions (All Optional, Separate Fields)
```
Length: 29.7
Width: 21
Height: 1
Breadth: 0.5
Dimension Unit: cm
```

#### Tax Rates (Percentage Values)
```
CGST: 5
SGST: 5
IGST: 18
```

### Step 3: Upload CSV
1. Go to Admin Panel → Products
2. Click "Import Products"
3. Select your CSV file
4. Click "Upload"
5. Review results

### Step 4: Review Results
- **Imported**: New products created
- **Updated**: Existing products updated
- **Failed**: Products with errors
- **Errors**: Detailed error messages

## Export Instructions

### Step 1: Export Products
1. Go to Admin Panel → Products
2. Click "Export Products"
3. CSV file downloads automatically

### Step 2: File Contents
The exported CSV includes:
- All product information
- Current values for all fields
- Ready for re-import or editing

### Step 3: Edit & Re-import
1. Edit the exported CSV
2. Make changes to products
3. Re-import to update database

## Data Validation Rules

### Required Fields
- Item Name: Must not be empty
- Slug: Must not be empty, must be unique
- Price: Must be a valid number
- Category: Must match existing category
- Stock: Must be a valid number
- Description: Must not be empty

### Optional Fields with Validation
- Price fields: Must be valid numbers if provided
- Quantity fields: Must be valid integers if provided
- Weight: Must be a valid number if provided
- Dimensions: Must be valid numbers if provided
- Tax rates: Must be 0-100 if provided
- Rating: Must be 0-5 if provided
- Boolean fields: Must be `true` or `false`

### Auto-Generated Values
- SKU: Auto-generated from slug if empty
- Country Of Origin: Defaults to "India" if empty
- Weight Unit: Defaults to "g" if empty
- Dimension Unit: Defaults to "cm" if empty
- Unit: Defaults to "piece" if empty
- Status: Defaults to "draft" if empty

## Common Issues & Solutions

### Issue: "Category not found"
**Solution**: Ensure category name matches exactly (case-insensitive). Check admin panel for available categories.

### Issue: "Missing required fields"
**Solution**: Verify Item Name, Slug, Price, Category, Stock, and Description are all filled.

### Issue: "SKU already exists"
**Solution**: Either provide a unique SKU or leave empty for auto-generation.

### Issue: "Invalid price format"
**Solution**: Use numbers only, no currency symbols. Use decimal point for decimals (e.g., 99.99).

### Issue: "Slug already exists"
**Solution**: Provide a unique slug or the product will be updated if SKU matches.

### Issue: "Invalid boolean value"
**Solution**: Use `true` or `false` (lowercase) for Is Featured, Is New Arrival, Is Best Seller.

## Best Practices

### 1. Always Backup
- Export current products before importing
- Keep backup copies of CSV files

### 2. Test First
- Test with a small batch before bulk import
- Verify results before proceeding

### 3. Use Consistent Formatting
- Use semicolons for lists (Features, Specifications)
- Use commas for tags
- Use colons for key:value pairs

### 4. Validate Data
- Check for typos in category names
- Verify all prices are correct
- Ensure images URLs are valid

### 5. Handle Special Characters
- Wrap fields with commas in quotes: `"Field, with comma"`
- Escape quotes by doubling: `"Field with ""quotes"""`

### 6. Organize Specifications
- Use consistent key names
- Keep values concise
- Example: `Pages:200; Ruling:Single Line; GSM:70`

## CSV Template Download

Download the template from:
```
/public/products-template.csv
```

Or access via API:
```
GET /api/admin/products/export
```

## API Endpoints

### Export Products
```
GET /api/admin/products/export
```
Returns: CSV file download

### Import Products
```
POST /api/admin/products/import
Content-Type: multipart/form-data

Body:
- file: CSV file
```
Returns: Import results with success/error counts

## Column Reference Table

| Column | Type | Required | Format | Example |
|--------|------|----------|--------|---------|
| SKU | String | No | Alphanumeric | SKU001 |
| Item Name | String | Yes | Text | Notebook |
| Slug | String | Yes | Lowercase with hyphens | my-notebook |
| Price | Number | Yes | Decimal | 99.99 |
| Retail Price | Number | No | Decimal | 150.00 |
| Discount Price | Number | No | Decimal | 79.99 |
| Status | String | Yes | active/inactive/draft | active |
| Description | String | Yes | Text | Product description |
| Stock | Number | Yes | Integer | 100 |
| Category | String | Yes | Existing category name | books |
| Sub Category | String | No | Text | notebooks |
| Tags | String | No | Comma-separated | tag1, tag2 |
| Images | String | No | Semicolon-separated URLs | url1; url2 |
| Rating | Number | No | 0-5 | 4.5 |
| Review Count | Number | No | Integer | 125 |
| HSN | String | No | Numeric | 4820 |
| Brand | String | No | Text | Classmate |
| Manufacturer | String | No | Text | ITC Limited |
| Qty Per Item | Number | No | Integer | 1 |
| Unit | String | No | piece/pack/box/set/dozen/kg | piece |
| Weight | Number | No | Decimal | 250 |
| Weight Unit | String | No | g/kg/ml/l | g |
| Material | String | No | Text | Paper |
| Color | String | No | Text | Blue |
| Size | String | No | Text | A4 |
| Warranty | String | No | Text | 1 Year |
| Country Of Origin | String | No | Text | India |
| Min Order Qty | Number | No | Integer | 1 |
| Max Order Qty | Number | No | Integer | 100 |
| Is Featured | Boolean | No | true/false | true |
| Is New Arrival | Boolean | No | true/false | false |
| Is Best Seller | Boolean | No | true/false | true |
| Features | String | No | Semicolon-separated | Feature1; Feature2 |
| Specifications | String | No | Key:Value pairs | Key1:Value1; Key2:Value2 |
| Length | Number | No | Decimal | 29.7 |
| Width | Number | No | Decimal | 21 |
| Height | Number | No | Decimal | 1 |
| Breadth | Number | No | Decimal | 0.5 |
| Dimension Unit | String | No | cm/mm/in/m | cm |
| CGST | Number | No | 0-100 | 5 |
| SGST | Number | No | 0-100 | 5 |
| IGST | Number | No | 0-100 | 18 |

## Summary

The CSV import/export system now supports all product fields including:
- ✅ Weight and weight units
- ✅ Dimensions (length, width, height, breadth)
- ✅ Tax rates (CGST, SGST, IGST)
- ✅ All other product properties

Use this guide to efficiently manage your product catalog through CSV files.
