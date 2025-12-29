# Dynamic Category Management System

## Overview

The e-commerce platform now supports dynamic category management. Admins can create, edit, and delete product categories without modifying code. Categories are stored in MongoDB and can be managed through the admin panel.

## Features

### 1. Admin Category Management
- **Location**: `/admin/categories`
- **Features**:
  - View all categories with pagination
  - Search categories by name or slug
  - Add new categories with name, slug, description, and icon
  - Edit existing categories
  - Soft delete categories (mark as inactive)
  - Display category icon (emoji or URL)

### 2. Dynamic Product Creation
- **Location**: `/admin/products/new`
- **Features**:
  - Searchable category dropdown
  - Real-time category filtering as you type
  - Shows category name and slug in dropdown
  - Validates category selection before product creation
  - Supports unlimited categories

### 3. Product Filtering
- **Location**: `/products`
- **Features**:
  - Dynamically populated category filter
  - Loads all active categories from database
  - Filters products by selected category
  - Works with price range and sorting filters

## Database Models

### Category Model
```typescript
interface ICategory extends Document {
  name: string;              // Category name (e.g., "Books")
  slug: string;              // URL-friendly slug (e.g., "books")
  description?: string;      // Optional description
  icon?: string;             // Emoji or icon URL
  isActive: boolean;         // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model (Updated)
```typescript
interface IProduct extends Document {
  // ... other fields
  category: string;          // Changed from enum to string (references category slug)
  // ... other fields
}
```

## API Endpoints

### Get Categories
```
GET /api/admin/categories?search=books&page=1&limit=10
```
**Response**:
```json
{
  "categories": [
    {
      "_id": "...",
      "name": "Books",
      "slug": "books",
      "description": "School books and novels",
      "icon": "📚",
      "isActive": true
    }
  ],
  "pagination": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Create Category
```
POST /api/admin/categories
Content-Type: application/json

{
  "name": "Books",
  "slug": "books",
  "description": "School books and novels",
  "icon": "📚"
}
```

### Update Category
```
PATCH /api/admin/categories/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": true
}
```

### Delete Category (Soft Delete)
```
DELETE /api/admin/categories/:id
```

## Setup Instructions

### 1. Seed Default Categories
Run the seed script to create default categories:

```bash
npm run seed:categories
```

This creates 4 default categories:
- Books (📚)
- Art & Craft (🎨)
- Craft Supplies (✂️)
- Stationery (✏️)

### 2. Access Category Management
1. Go to Admin Panel (`/admin`)
2. Click on "🏷️ Categories" in the sidebar
3. Add, edit, or delete categories as needed

### 3. Create Products with Dynamic Categories
1. Go to `/admin/products/new`
2. In the Category field, start typing to search
3. Select a category from the dropdown
4. Fill in other product details and submit

## Migration from Hardcoded Categories

If you have existing products with hardcoded categories (books, art, craft, stationery):

1. Run the seed script to create default categories:
   ```bash
   npm run seed:categories
   ```

2. Products will continue to work as the category field now accepts any string value

3. Existing category values (books, art, craft, stationery) will still work

## Usage Examples

### Adding a New Category
1. Navigate to `/admin/categories`
2. Click "+ Add Category"
3. Fill in:
   - **Category Name**: "Educational Books"
   - **Slug**: "educational-books"
   - **Description**: "Books for educational purposes"
   - **Icon**: "📖"
4. Click "Add Category"

### Searching for Categories
1. In the category list, use the search bar
2. Type to filter by name or slug
3. Results update in real-time

### Creating a Product with Custom Category
1. Go to `/admin/products/new`
2. In the Category field, type "educational"
3. Select "Educational Books" from the dropdown
4. Fill in other product details
5. Submit the form

### Filtering Products by Category
1. Go to `/products`
2. Open the Category dropdown
3. Select any available category
4. Products filter automatically

## Best Practices

1. **Slug Format**: Use lowercase, hyphen-separated slugs (e.g., "art-supplies")
2. **Icons**: Use emojis for better visual appeal
3. **Descriptions**: Add meaningful descriptions for admin reference
4. **Naming**: Use clear, descriptive category names
5. **Organization**: Group related products in the same category

## Troubleshooting

### Categories not showing in dropdown
- Ensure categories are marked as `isActive: true`
- Check that categories are created in the database
- Verify API endpoint is accessible

### Products not filtering by category
- Confirm product's category field matches a category slug
- Check that the category is active
- Verify the category exists in the database

### Search not working
- Ensure search term matches category name or slug
- Check MongoDB connection
- Verify API endpoint is responding

## Future Enhancements

Potential improvements:
- Category hierarchy (parent/child categories)
- Category images/banners
- Category-specific discounts
- Category analytics and statistics
- Bulk category operations
- Category reordering/sorting
