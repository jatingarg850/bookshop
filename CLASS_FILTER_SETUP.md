# Class Filter Setup Guide

## Overview

The class filter now works by extracting class information from product tags and storing it in the dedicated `class` field. This enables proper filtering and sorting by class level.

## How It Works

### 1. Tag Format
Products have tags like:
```
["Class 7", "Mathematics", "English", "NCERT", "CBSE", "Textbook", "Secondary"]
```

### 2. Extraction Process
The migration script extracts:
- **Class**: "Class 7" → "7", "Nursery" → "Nursery", etc.
- **Subject**: "Mathematics", "Science", "English", etc.
- **Board**: "NCERT", "CBSE", "ICSE", "State Board"

### 3. Storage
Extracted values are stored in the Product model:
```javascript
{
  class: "7",           // Enum: Nursery, LKG, UKG, 1-12
  subject: "Mathematics",
  board: "NCERT"
}
```

## Setup Steps

### Step 1: Run the Migration Script
```bash
node scripts/migrate-class-from-tags.js
```

This will:
- Find all products with tags but no class field
- Extract class, subject, and board from tags
- Update the database
- Show progress and summary

### Step 2: Verify the Migration
```bash
node scripts/test-class-extraction.js
```

This tests the extraction logic with sample data.

### Step 3: Test the Filter
Visit `/products` and:
1. Open the Class filter dropdown
2. Select a class (e.g., "Class 7")
3. Verify products are filtered correctly

## API Usage

### Filter by Class
```bash
GET /api/products?class=7
GET /api/products?class=10
GET /api/products?class=Nursery
```

### Sort by Class
```bash
GET /api/products?sort=class-asc    # Nursery → 12
GET /api/products?sort=class-desc   # 12 → Nursery
```

### Combined Filters
```bash
GET /api/products?class=10&subject=Mathematics&sort=class-asc
```

### Get Available Classes
The API returns available classes in the filters response:
```json
{
  "products": [...],
  "pagination": {...},
  "filters": {
    "categories": [...],
    "classes": ["Nursery", "LKG", "UKG", "1", "2", ..., "12"]
  }
}
```

## Class Values

Valid class values:
- **Pre-Primary**: Nursery, LKG, UKG
- **Primary**: 1, 2, 3, 4, 5
- **Secondary**: 6, 7, 8, 9, 10
- **Senior Secondary**: 11, 12

## Troubleshooting

### Filter Not Working
1. Verify migration ran successfully: `node scripts/migrate-class-from-tags.js`
2. Check database: Products should have `class` field populated
3. Restart dev server: `npm run dev`

### Classes Not Showing in Dropdown
1. Ensure products have `class` field set
2. Check API response: `GET /api/products`
3. Verify `filters.classes` array is populated

### Wrong Class Extracted
1. Check product tags format
2. Run test script: `node scripts/test-class-extraction.js`
3. Verify tag format matches "Class X" pattern

## Example Products After Migration

```javascript
// Before
{
  name: "NCERT Class 7 Mathematics",
  tags: ["Class 7", "Mathematics", "English", "NCERT", "CBSE", "Textbook", "Secondary"],
  class: undefined
}

// After
{
  name: "NCERT Class 7 Mathematics",
  tags: ["Class 7", "Mathematics", "English", "NCERT", "CBSE", "Textbook", "Secondary"],
  class: "7",
  subject: "Mathematics",
  board: "NCERT"
}
```

## Frontend Changes

The class filter dropdown in `/products` page now:
1. Fetches available classes from API
2. Displays them in proper order (Nursery → 12)
3. Filters products when a class is selected
4. Works with other filters (category, price, etc.)

## Notes

- Migration is safe to run multiple times (idempotent)
- Existing class values are never overwritten
- Subject and Board are only added if they don't exist
- Tags remain unchanged after migration
- Filter uses exact matching (not regex) for better performance
