# Class Migration from Tags

This document explains how to migrate class information from product tags to the dedicated `class` field.

## Overview

Many products have class information embedded in their tags (e.g., "Class 7", "Class 10", "Nursery"). This migration script extracts that information and populates the dedicated `class` field in the Product model, enabling proper filtering and sorting.

## What Gets Migrated

The script extracts and populates:
- **Class**: Nursery, LKG, UKG, 1-12
- **Subject**: Mathematics, Science, English, Hindi, History, Geography, etc.
- **Board**: NCERT, CBSE, ICSE, State Board

## How to Run

### Step 1: Ensure MongoDB Connection
Make sure your `.env` file has the correct `MONGODB_URI`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

### Step 2: Run the Migration Script
```bash
node scripts/migrate-class-from-tags.js
```

### Step 3: Verify Results
The script will output:
- Number of products found
- Details of each updated product
- Summary of updated and skipped products

## Example Output

```
Connecting to MongoDB...
✓ Connected to MongoDB

Found 150 products to migrate

✓ Updated: NCERT Class 7 Mathematics Textbook
  - Class: 7
  - Subject: Mathematics
  - Board: NCERT
✓ Updated: NCERT Class 10 Science Textbook
  - Class: 10
  - Subject: Science
  - Board: NCERT
⊘ Skipped: General Stationery Item (no class found in tags)

✓ Migration complete!
  - Updated: 148 products
  - Skipped: 2 products
✓ Disconnected from MongoDB
```

## Tag Patterns Recognized

The script recognizes these patterns in tags:

### Class Patterns
- "Nursery", "LKG", "UKG"
- "Class 1", "Class 2", ..., "Class 12"
- Case-insensitive matching

### Subject Patterns
- Mathematics, Science, English, Hindi
- History, Geography, Civics, Sanskrit
- Computer Science, Political Science, Economics
- Physics, Chemistry, Biology, Accountancy
- Business Studies, Sociology, Psychology
- Environmental Studies

### Board Patterns
- NCERT, CBSE, ICSE, State Board

## API Changes

After migration, the products API will return available classes:

```bash
GET /api/products?class=10
```

Response includes:
```json
{
  "products": [...],
  "pagination": {...},
  "filters": {
    "categories": [...],
    "brands": [...],
    "colors": [...],
    "sizes": [...],
    "classes": ["Nursery", "LKG", "UKG", "1", "2", ..., "12"]
  }
}
```

## Frontend Changes

The class filter dropdown in `/products` page will now be populated with actual classes from the database instead of hardcoded values.

## Rollback

If needed, you can rollback by:
1. Removing the `class` field from products: `db.products.updateMany({}, { $unset: { class: "" } })`
2. The tags will remain unchanged

## Notes

- The script only updates products that have tags but no class field
- Existing class values are never overwritten
- Subject and Board are only added if they don't already exist
- The script is safe to run multiple times (idempotent)
