# CSV Import Troubleshooting Guide

## Quick Checklist

Before importing, verify:
- [ ] You are logged in as an admin
- [ ] CSV file has correct headers (exact match required)
- [ ] All categories exist in the system
- [ ] SKU values are unique
- [ ] Status values are lowercase: "active", "inactive", or "draft"
- [ ] Price is a valid number
- [ ] Stock is a valid number

## Common Issues & Solutions

### 1. "Unauthorized" Error
**Problem**: Import fails with 401 Unauthorized
**Solution**: 
- Ensure you're logged in as an admin user
- Check that your user role is set to 'admin' in the database
- Try logging out and logging back in

### 2. "No file provided" Error
**Problem**: File upload fails
**Solution**:
- Ensure you selected a CSV file
- File size should be reasonable (< 10MB)
- Try a different file

### 3. "No data found in file" Error
**Problem**: CSV file is empty or has no data rows
**Solution**:
- Ensure CSV has header row
- Ensure CSV has at least one data row
- Check file encoding is UTF-8

### 4. "Category not found" Error
**Problem**: Row fails with "Category 'X' not found"
**Solution**:
- Go to Admin → Categories
- Create the missing category
- Use the category NAME (not slug) in CSV
- Category names are case-insensitive in import

### 5. "Missing required fields" Error
**Problem**: Row fails with missing required fields
**Solution**:
- Verify CSV has all required columns:
  - SKU
  - Item Name
  - Slug
  - Price
  - Category
  - Stock
  - Status
  - Description
- Ensure no cells are empty for required fields
- Check for extra spaces in headers

### 6. Import Shows 0 Imported, All Failed
**Problem**: All rows fail to import
**Solution**:
- Check browser console (F12) for detailed errors
- Verify CSV format matches template exactly
- Try importing just 1 row first
- Check that categories exist

### 7. Duplicate SKU Error
**Problem**: Product with same SKU already exists
**Solution**:
- If you want to update: Use same SKU (will update existing product)
- If you want new product: Use different SKU
- Check existing products in Admin → Products

## CSV Format Verification

### Required Headers (Exact Match)
```
SKU,Item Name,Slug,Price,Retail Price,Discount Price,Status,Description,Stock,Category,Sub Category,Tags,Images,Rating,Review Count
```

### Data Format Rules

| Field | Format | Example |
|-------|--------|---------|
| SKU | Uppercase, unique | SKU001, BOOK-NB-001 |
| Item Name | Any text | Notebook A4 |
| Slug | Lowercase, hyphens | notebook-a4 |
| Price | Number | 150 |
| Retail Price | Number or empty | 200 |
| Discount Price | Number or empty | 120 |
| Status | lowercase | active, inactive, draft |
| Description | Any text | High quality notebook |
| Stock | Number | 50 |
| Category | Category name | books, stationery |
| Sub Category | Subcategory name or empty | Notebooks |
| Tags | Comma-separated | notebook,stationery,school |
| Images | Semicolon-separated URLs | https://example.com/img1.jpg;https://example.com/img2.jpg |
| Rating | Number 0-5 or empty | 4.5 |
| Review Count | Number or empty | 10 |

## Testing Import

### Step 1: Create Test Categories
1. Go to Admin → Categories
2. Create: "books", "stationery", "art"
3. Create subcategories under each

### Step 2: Use Template File
1. Download template: `/public/products-template.csv`
2. Edit with your data
3. Save as CSV (UTF-8)

### Step 3: Test Import
1. Go to Admin → Products
2. Click "📤 Import CSV"
3. Select your CSV file
4. Check browser console (F12) for detailed logs
5. Review success/error message

### Step 4: Verify Results
1. Check Admin → Products
2. Filter by status to see imported products
3. Verify product details are correct

## Browser Console Debugging

To see detailed import logs:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for messages like:
   - "Starting import for file: products.csv"
   - "Import response status: 200"
   - "Import successful: {imported: 3, updated: 0, failed: 0}"

## Database Verification

To check if categories exist:

1. Open MongoDB Compass or similar tool
2. Connect to your database
3. Check `categories` collection
4. Verify category names match CSV

## Socket.io 404 Errors

The 404 errors for `/socket.io` are NOT from this application. They're likely from:
- Browser extensions
- Third-party scripts
- CDN services
- Chrome DevTools

**These can be safely ignored** - they don't affect CSV import functionality.

## Still Having Issues?

1. **Check browser console** (F12) for detailed error messages
2. **Verify CSV format** matches template exactly
3. **Test with template file** first
4. **Check categories exist** in Admin → Categories
5. **Ensure you're logged in as admin**
6. **Try a smaller CSV** with just 1-2 rows

## Example Working CSV

```csv
SKU,Item Name,Slug,Price,Retail Price,Discount Price,Status,Description,Stock,Category,Sub Category,Tags,Images,Rating,Review Count
SKU001,Notebook A4,notebook-a4,150,200,120,active,High quality A4 notebook,50,books,Notebooks,notebook;stationery,https://picsum.photos/400/300?random=1,4.5,10
SKU002,Blue Pen Set,blue-pen-set,50,75,40,active,Set of 10 blue pens,100,stationery,Pens,pen;writing,https://picsum.photos/400/300?random=2,4,5
SKU003,Color Pencils,color-pencils-24,200,300,180,draft,24 color pencil set,0,art,Color Pencils,pencil;art;colors,https://picsum.photos/400/300?random=3,5,15
```

## Support

For additional help:
1. Check the IMPORT_EXPORT_GUIDE.md
2. Review the template file at `/public/products-template.csv`
3. Check browser console for error messages
4. Verify all prerequisites are met
