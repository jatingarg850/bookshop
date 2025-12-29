# Product Search Feature

## Overview

The products page now includes a comprehensive search functionality that allows users to find products quickly and easily.

## Features

### 1. Search Bar
- **Location**: Top of `/products` page
- **Placeholder**: "🔍 Search products by name, description, or tags..."
- **Real-time**: Results update as you type
- **Resets pagination**: Automatically goes to page 1 when searching

### 2. Search Scope
The search looks through:
- **Product Name**: Exact and partial matches
- **Description**: Full text search
- **Tags**: Searches product tags
- **Case-insensitive**: "BOOK" = "book" = "Book"

### 3. Combined Filtering
Search works together with:
- Category filter
- Price range filter
- Sorting options
- All filters can be combined

### 4. Clear Filters Button
- Appears when any filter is active
- Clears all filters at once
- Resets to default view

## How to Use

### Basic Search
1. Go to `/products`
2. Type in the search bar
3. Results filter in real-time
4. Results show matching products

### Search Examples
- **"notebook"** → Shows all notebooks
- **"art"** → Shows art supplies and art-related products
- **"blue"** → Shows products with "blue" in name/description
- **"pen"** → Shows all pen products

### Combined Search
1. Type search term: "notebook"
2. Select category: "Stationery"
3. Set price range: ₹100 - ₹500
4. Results show notebooks in stationery category within price range

### Clear Search
1. Click "Clear Filters" button
2. All filters reset
3. Shows all products again

## API Implementation

### Search Parameter
```
GET /api/products?search=notebook&category=stationery&page=1
```

### Search Logic
```typescript
if (search) {
  filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { tags: { $in: [new RegExp(search, 'i')] } },
  ];
}
```

### Response
```json
{
  "products": [...],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 12,
    "pages": 1
  }
}
```

## Features

✅ Real-time search
✅ Case-insensitive matching
✅ Search by name, description, tags
✅ Combine with other filters
✅ Pagination support
✅ Clear filters button
✅ Responsive design
✅ Fast performance

## Performance

- Search is performed server-side
- MongoDB regex search with indexing
- Results paginated (12 per page)
- Efficient query execution

## User Experience

- Search bar at top for easy access
- Placeholder text explains what can be searched
- Results update instantly
- Clear filters button for quick reset
- Pagination for large result sets
- Empty state message when no results

## Testing

### Test Cases

1. **Basic Search**
   - Type "book" → See book products
   - Type "pen" → See pen products
   - Type "xyz" → See "No products found"

2. **Case Insensitive**
   - Type "BOOK" → Same as "book"
   - Type "BoOk" → Same as "book"

3. **Combined Filters**
   - Search "notebook" + Category "Stationery"
   - Search "art" + Price ₹100-₹500
   - Search "pen" + Sort "Price: Low to High"

4. **Clear Filters**
   - Apply multiple filters
   - Click "Clear Filters"
   - All filters reset

5. **Pagination**
   - Search with many results
   - Navigate pages
   - Results stay consistent

## Troubleshooting

### Search not working
- Ensure MongoDB is running
- Check browser console for errors
- Verify API endpoint is accessible
- Try refreshing page

### No results found
- Check spelling
- Try different search term
- Remove other filters
- Check if products exist

### Slow search
- Reduce search term length
- Check MongoDB connection
- Verify database indexes
- Check server performance

## Future Enhancements

Potential improvements:
- Search suggestions/autocomplete
- Search history
- Advanced search filters
- Search analytics
- Saved searches
- Search highlighting in results
- Fuzzy matching
- Search by SKU/ID

## API Endpoint

### Search Products
```
GET /api/products?search=query&category=slug&minPrice=100&maxPrice=500&sort=-createdAt&page=1&limit=12
```

**Parameters**:
- `search` (optional): Search term
- `category` (optional): Category slug
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `sort` (optional): Sort order (-createdAt, price, -price)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response**:
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Product Name",
      "slug": "product-slug",
      "description": "...",
      "category": "books",
      "price": 299,
      "discountPrice": 249,
      "images": [...],
      "stock": 10,
      "tags": ["tag1", "tag2"]
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 12,
    "pages": 1
  }
}
```

## Implementation Details

### Frontend (app/products/page.tsx)
- Search state management
- Real-time search input
- Combined filter logic
- Clear filters functionality
- Pagination handling

### Backend (app/api/products/route.ts)
- MongoDB regex search
- Case-insensitive matching
- Multi-field search ($or operator)
- Filter combination
- Pagination support

## Files Modified

- `app/products/page.tsx` - Added search state and UI
- `app/api/products/route.ts` - Added search parameter handling

## Testing Checklist

- [ ] Search by product name
- [ ] Search by description
- [ ] Search by tags
- [ ] Case-insensitive search
- [ ] Combine search with category filter
- [ ] Combine search with price filter
- [ ] Combine search with sorting
- [ ] Clear filters button works
- [ ] Pagination works with search
- [ ] Empty state displays correctly
- [ ] Search resets pagination
- [ ] Performance is acceptable

---

**Search feature is now live on the products page!** 🔍
