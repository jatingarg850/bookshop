# Quick Start: Dynamic Categories

## 5-Minute Setup

### 1. Seed Default Categories (1 minute)
```bash
npm run seed:categories
```

Output:
```
Connected to MongoDB
Cleared existing categories
Created 4 default categories
✓ Books (books)
✓ Art & Craft (art)
✓ Craft Supplies (craft)
✓ Stationery (stationery)
Seeding completed successfully
```

### 2. Access Admin Panel (1 minute)
1. Go to `http://localhost:3000/admin`
2. Click "🏷️ Categories" in the sidebar
3. You should see the 4 default categories

### 3. Add a New Category (1 minute)
1. Click "+ Add Category" button
2. Fill in the form:
   - **Name**: "Notebooks"
   - **Slug**: "notebooks"
   - **Description**: "All types of notebooks"
   - **Icon**: "📓"
3. Click "Add Category"

### 4. Create a Product with New Category (1 minute)
1. Go to `/admin/products/new`
2. Fill in basic info (name, slug, description)
3. In the Category field, type "note" to search
4. Select "Notebooks" from dropdown
5. Fill in price, stock, upload images
6. Click "Create Product"

### 5. View Products with Category Filter (1 minute)
1. Go to `/products`
2. Open Category dropdown
3. Select "Notebooks"
4. See products filtered by category

## Common Tasks

### Add Multiple Categories at Once
1. Go to `/admin/categories`
2. Click "+ Add Category"
3. Add first category, then repeat for others

### Search for a Category
1. Go to `/admin/categories`
2. Type in search box
3. Results filter in real-time

### Edit a Category
1. Go to `/admin/categories`
2. Find category in list
3. Click "Edit" button
4. Update fields
5. Click "Update Category"

### Delete a Category
1. Go to `/admin/categories`
2. Find category in list
3. Click "Delete" button
4. Confirm deletion

### Filter Products by Category
1. Go to `/products`
2. Select category from dropdown
3. Products automatically filter

## What Changed

### Before (Hardcoded)
```typescript
category: z.enum(['books', 'art', 'craft', 'stationery'])
```

### After (Dynamic)
```typescript
category: z.string().min(1, 'Category is required')
```

## Database Changes

### New Collection: Categories
```json
{
  "_id": ObjectId,
  "name": "Books",
  "slug": "books",
  "description": "School books and novels",
  "icon": "📚",
  "isActive": true,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Updated Products Collection
```json
{
  "_id": ObjectId,
  "name": "Product Name",
  "category": "books",  // Now a string, not enum
  // ... other fields
}
```

## API Endpoints

### List Categories
```
GET /api/admin/categories?search=books&page=1&limit=10
```

### Create Category
```
POST /api/admin/categories
{
  "name": "Books",
  "slug": "books",
  "description": "...",
  "icon": "📚"
}
```

### Update Category
```
PATCH /api/admin/categories/:id
{
  "name": "Updated Name",
  "description": "..."
}
```

### Delete Category
```
DELETE /api/admin/categories/:id
```

## Features

✅ Add unlimited categories
✅ Search categories in real-time
✅ Edit category details
✅ Soft delete (deactivate) categories
✅ Add icons/emojis to categories
✅ Searchable dropdown when creating products
✅ Dynamic product filtering
✅ Pagination support
✅ Admin authentication required

## Troubleshooting

### "No categories found" in dropdown
**Solution**: Run `npm run seed:categories`

### Categories not showing in filter
**Solution**: 
1. Check categories are marked `isActive: true`
2. Refresh the page
3. Check browser console for errors

### Search not working
**Solution**:
1. Verify MongoDB is running
2. Check network tab in browser
3. Ensure category names match search term

### Can't create product
**Solution**:
1. Select a category from dropdown
2. Ensure all required fields are filled
3. Check browser console for errors

## Next Steps

1. ✅ Run seed script
2. ✅ Add custom categories
3. ✅ Create products with categories
4. ✅ Test product filtering
5. ✅ Monitor and adjust as needed

## Support

- Full documentation: See `CATEGORY_MANAGEMENT.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`
- API routes: Check `app/api/admin/categories/`
- Admin page: Check `app/admin/categories/page.tsx`

---

**You're all set!** Start managing categories and creating products with dynamic categories.
