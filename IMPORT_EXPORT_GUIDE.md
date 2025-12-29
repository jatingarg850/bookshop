# Product Import/Export Guide

## Overview
The import/export feature allows you to bulk manage products using CSV files. This guide explains how to use it.

## Features

### Export Products
- Download all products as a CSV file
- Includes all product fields: SKU, name, price, stock, categories, etc.
- File is automatically named with the current date

### Import Products
- Upload a CSV file to add or update products in bulk
- Automatically creates new products or updates existing ones (based on SKU)
- Validates all required fields and categories
- Provides detailed error reporting

## Product Status

Products now have three status levels:

### Active
- Product is live and visible in the store
- Customers can purchase the product
- Shows in search results and category listings
- Use when: Product is in stock and ready to sell

### Inactive
- Product is hidden from customers
- Typically used when stock is depleted
- Admin can still see and manage the product
- Use when: Product is out of stock but may return

### Draft
- Product is completely hidden from the store
- Only visible to admin
- Not searchable or purchasable
- Use when: Product is being prepared or not ready for sale

## CSV Format

### Required Columns
- **SKU**: Unique product identifier (uppercase, e.g., SKU001)
- **Item Name**: Product name
- **Slug**: URL-friendly name (lowercase, no spaces)
- **Price**: Selling price (number)
- **Category**: Category slug (must exist in system)
- **Stock**: Available quantity (number)
- **Status**: "active", "inactive", or "draft" (lowercase)
- **Description**: Product description

### Optional Columns
- **Retail Price**: Original/suggested retail price
- **Discount Price**: Discounted price (if applicable)
- **Sub Category**: Subcategory slug (must exist under parent category)
- **Tags**: Comma-separated tags (e.g., "notebook,stationery")
- **Images**: Semicolon-separated image URLs
- **Rating**: Product rating (0-5)
- **Review Count**: Number of reviews

## CSV Example

```csv
SKU,Item Name,Slug,Price,Retail Price,Discount Price,Status,Description,Stock,Category,Sub Category,Tags,Images,Rating,Review Count
SKU001,Notebook A4,notebook-a4,150,200,120,active,High quality A4 notebook,50,books,Notebooks,notebook;stationery,https://picsum.photos/400/300?random=1,4.5,10
SKU002,Blue Pen Set,blue-pen-set,50,75,40,active,Set of 10 blue pens,100,stationery,Pens,pen;writing,https://picsum.photos/400/300?random=2,4,5
SKU003,Color Pencils,color-pencils-24,200,300,180,draft,24 color pencil set,0,art,Color Pencils,pencil;art;colors,https://picsum.photos/400/300?random=3,5,15
```

## How to Use

### Export Products
1. Go to Admin Panel → Products
2. Click "📥 Export CSV" button
3. CSV file will download automatically
4. File name format: `products-YYYY-MM-DD.csv`

### Import Products
1. Go to Admin Panel → Products
2. Click "📤 Import CSV" button
3. Select your CSV file
4. System will validate and import
5. Success/error message will appear

## Categories & Subcategories

### Dynamic Categories
- Categories are now fully dynamic
- Create categories in Admin → Categories
- Use category slug in CSV (not name)

### Subcategories
- Subcategories are linked to parent categories via `parentId`
- When importing, specify both Category and Sub Category
- Subcategory must exist under the specified Category

### Example Category Structure
```
Books (slug: books)
├── Notebooks (slug: notebooks)
├── Diaries (slug: diaries)
└── Journals (slug: journals)

Stationery (slug: stationery)
├── Pens (slug: pens)
├── Pencils (slug: pencils)
└── Markers (slug: markers)
```

## Product Fields

### SKU (Stock Keeping Unit)
- Unique identifier for each product
- Used to determine if product should be created or updated
- Must be uppercase
- Example: SKU001, BOOK-NB-001

### Slug
- URL-friendly version of product name
- Lowercase, no spaces, use hyphens
- Example: "notebook-a4", "blue-pen-set"

### Status
- "Active" = Product is visible and purchasable
- "Inactive" = Product is hidden from store

### Tags
- Comma-separated keywords for search
- Example: "notebook,stationery,school"

### Images
- Semicolon-separated URLs
- Example: "https://example.com/img1.jpg;https://example.com/img2.jpg"

## Error Handling

### Common Errors
1. **Missing required fields**: Check SKU, Item Name, Slug, Price, Category
2. **Category not found**: Ensure category exists in system
3. **Duplicate SKU**: Update existing product or use new SKU
4. **Invalid price**: Price must be a number

### Error Messages
- Row number is provided for easy identification
- Specific error reason is shown
- Failed rows are skipped, others continue importing

## Tips & Best Practices

1. **Always export first** - Get the current format before importing
2. **Test with small batch** - Import a few products first to verify format
3. **Use consistent slugs** - Keep slugs lowercase and hyphenated
4. **Validate categories** - Ensure all categories exist before importing
5. **Backup data** - Export before bulk updates
6. **Check images** - Verify image URLs are accessible
7. **Use templates** - Start with the provided template file

## Template File
A template CSV file is available at: `/public/products-template.csv`

## Database Schema

### Product Model
```typescript
{
  sku: string (unique, required)
  name: string (required)
  slug: string (unique, required)
  description: string (required)
  category: string (required)
  subcategory?: string
  price: number (required)
  retailPrice?: number
  discountPrice?: number
  stock: number (required)
  tags: string[]
  images: Array<{url, alt}>
  isActive: boolean
  rating?: number
  reviewCount?: number
}
```

## API Endpoints

### Export
- **Endpoint**: `GET /api/admin/products/export`
- **Returns**: CSV file download
- **Format**: `products-YYYY-MM-DD.csv`

### Import
- **Endpoint**: `POST /api/admin/products/import`
- **Content-Type**: `multipart/form-data`
- **Parameter**: `file` (CSV file)
- **Returns**: Import results with success/error counts

## Troubleshooting

### Import fails silently
- Check browser console for errors
- Verify CSV format is correct
- Ensure categories exist in system

### Products not updating
- Check SKU matches exactly (case-sensitive)
- Verify all required fields are present
- Check for validation errors in response

### Images not showing
- Verify image URLs are accessible
- Check URL format (must be full URL)
- Ensure images are publicly available

## Support
For issues or questions, contact the admin team.
