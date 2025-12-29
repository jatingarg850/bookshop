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
