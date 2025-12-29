import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // Fetch all products
    const products = await Product.find({}).lean();

    // Fetch all categories for reference
    const categories = await Category.find({}).lean();
    const categoryMap = new Map(categories.map(c => [c.slug, c.name]));

    // Format data for Excel
    const data = products.map((product: any) => ({
      'SKU': product.sku || '',
      'Item Name': product.name,
      'Slug': product.slug,
      'Price': product.price,
      'Retail Price': product.retailPrice || '',
      'Discount Price': product.discountPrice || '',
      'Status': product.status || 'draft',
      'Description': product.description,
      'Stock': product.stock,
      'Category': categoryMap.get(product.category) || product.category,
      'Sub Category': product.subcategory || '',
      'Tags': product.tags?.join(', ') || '',
      'Images': product.images?.map((img: any) => img.url).join('; ') || '',
      'Rating': product.rating || '',
      'Review Count': product.reviewCount || '',
      'HSN': product.hsn || '',
      'Brand': product.brand || '',
      'Manufacturer': product.manufacturer || '',
      'Qty Per Item': product.quantityPerItem || '',
      'Unit': product.unit || '',
      'Weight': product.weight || '',
      'Weight Unit': product.weightUnit || '',
      'Material': product.material || '',
      'Color': product.color || '',
      'Size': product.size || '',
      'Warranty': product.warranty || '',
      'Country Of Origin': product.countryOfOrigin || '',
      'Min Order Qty': product.minOrderQuantity || '',
      'Max Order Qty': product.maxOrderQuantity || '',
      'Is Featured': product.isFeatured ? 'true' : 'false',
      'Is New Arrival': product.isNewArrival ? 'true' : 'false',
      'Is Best Seller': product.isBestSeller ? 'true' : 'false',
      'Features': product.features?.join('; ') || '',
      'Specifications': product.specifications ? Object.entries(product.specifications).map(([k, v]) => `${k}:${v}`).join('; ') : '',
      'Length': product.dimensions?.length || '',
      'Width': product.dimensions?.width || '',
      'Height': product.dimensions?.height || '',
      'Breadth': product.dimensions?.breadth || '',
      'Dimension Unit': product.dimensions?.unit || '',
      'CGST': product.cgst || '',
      'SGST': product.sgst || '',
      'IGST': product.igst || '',
    }));

    // Create CSV content
    const headers = [
      'SKU',
      'Item Name',
      'Slug',
      'Price',
      'Retail Price',
      'Discount Price',
      'Status',
      'Description',
      'Stock',
      'Category',
      'Sub Category',
      'Tags',
      'Images',
      'Rating',
      'Review Count',
      'HSN',
      'Brand',
      'Manufacturer',
      'Qty Per Item',
      'Unit',
      'Weight',
      'Weight Unit',
      'Material',
      'Color',
      'Size',
      'Warranty',
      'Country Of Origin',
      'Min Order Qty',
      'Max Order Qty',
      'Is Featured',
      'Is New Arrival',
      'Is Best Seller',
      'Features',
      'Specifications',
      'Length',
      'Width',
      'Height',
      'Breadth',
      'Dimension Unit',
      'CGST',
      'SGST',
      'IGST',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value || '');
          return stringValue.includes(',') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(',')
      ),
    ].join('\n');

    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}
