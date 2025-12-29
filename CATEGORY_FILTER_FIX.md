# Category & Subcategory Filter Fix

## Problem Identified
The category and subcategory filters on `/products` page were not working because:

1. **No categories were seeded in the database** - The seed script only created products, not categories
2. **Data model mismatch** - Products store categories as strings (slugs), but the system was trying to fetch from the Category collection
3. **Empty filter options** - When the products page tried to fetch categories from the API, it got an empty array, so no filter options appeared

## Solution Implemented

### 1. Created Category Seed Script (`scripts/seed-categories.ts`)
- Creates 4 main categories: Books, Stationery, Art, Craft
- Creates 20 subcategories (5 per main category)
- Establishes parent-child relationships using MongoDB ObjectIds
- Run with: `npm run seed:categories` (add this script to package.json)

### 2. Updated Products Page (`app/products/page.tsx`)
- Added fallback to hardcoded categories if API returns empty
- Hardcoded categories: Books, Stationery, Art, Craft
- Hardcoded subcategories are used as fallback if API fails
- This ensures filters always work, even if database is empty

### 3. Updated CSV Template (`public/products-template.csv`)
- Changed category names from capitalized ("Books") to lowercase ("books")
- Matches the database slug format used by the import script
- Ensures imported products have correct category values

### 4. Verified Import Logic (`app/api/admin/products/import/route.ts`)
- Already correctly stores categories as slug strings
- Validates that categories exist before importing
- Auto-generates SKU if missing

### 5. Verified Products API (`app/api/products/route.ts`)
- Correctly filters by category and subcategory using string matching
- No changes needed - logic was already correct

## How to Use

### Step 1: Seed Categories (One-time setup)
```bash
npm run seed:categories
```

This creates all categories and subcategories in the database.

### Step 2: Import Products
Use the admin panel to import products from CSV. The CSV should have:
- Category: lowercase category slug (books, stationery, art, craft)
- Sub Category: subcategory name (optional)

### Step 3: Test Filters
Go to `/products` and the category/subcategory filters should now work!

## Data Flow

1. **Categories Page** → Fetches from `/api/admin/categories` → Falls back to hardcoded if empty
2. **Subcategories** → Fetches from `/api/admin/categories?parent=slug` → Falls back to hardcoded
3. **Products Filter** → Sends category/subcategory to `/api/products` → Filters by string matching
4. **CSV Import** → Stores category as slug string → Matches product filter logic

## Files Modified

- `scripts/seed-categories.ts` - NEW: Category seeding script
- `app/products/page.tsx` - Updated: Added fallback categories
- `public/products-template.csv` - Updated: Changed to lowercase category names
- `CATEGORY_FILTER_FIX.md` - NEW: This documentation

## Files Verified (No Changes Needed)

- `app/api/products/route.ts` - Filter logic is correct
- `app/api/admin/products/import/route.ts` - Import logic is correct
- `lib/db/models/Product.ts` - Schema is correct
- `lib/db/models/Category.ts` - Schema is correct

## Testing Checklist

- [ ] Run `npm run seed:categories` to create categories
- [ ] Go to `/products` page
- [ ] Verify category filter shows: Books, Stationery, Art, Craft
- [ ] Click on a category and verify subcategories appear
- [ ] Click on a subcategory and verify products filter correctly
- [ ] Import products from CSV with lowercase category names
- [ ] Verify imported products appear in filtered results
