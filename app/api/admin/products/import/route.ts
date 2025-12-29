import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';
import { authOptions } from '@/lib/auth/auth';

interface ImportRow {
  'SKU': string;
  'Item Name': string;
  'Slug': string;
  'Price': string;
  'Retail Price': string;
  'Discount Price': string;
  'Status': string;
  'Description': string;
  'Stock': string;
  'Category': string;
  'Sub Category': string;
  'Tags': string;
  'Images': string;
  'Rating': string;
  'Review Count': string;
  'HSN': string;
  'Brand': string;
  'Manufacturer': string;
  'Qty Per Item': string;
  'Unit': string;
  'Weight': string;
  'Weight Unit': string;
  'Material': string;
  'Color': string;
  'Size': string;
  'Warranty': string;
  'Country Of Origin': string;
  'Min Order Qty': string;
  'Max Order Qty': string;
  'Is Featured': string;
  'Is New Arrival': string;
  'Is Best Seller': string;
  'Features': string;
  'Specifications': string;
  'Length': string;
  'Width': string;
  'Height': string;
  'Breadth': string;
  'Dimension Unit': string;
  'CGST': string;
  'SGST': string;
  'IGST': string;
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null;
  }
  return session;
}

function parseCSV(csv: string): ImportRow[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing - split by comma but handle quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    // Create row object
    const row: any = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      row[header] = value;
    });

    // Only add row if it has data
    if (Object.values(row).some(v => v)) {
      rows.push(row);
    }
  }

  return rows;
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const csv = await file.text();
    const rows = parseCSV(csv);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Fetch all categories for validation
    const categories = await Category.find({}).lean();
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.slug]));

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        console.log(`Row ${i + 2} data:`, row);

        // Validate required fields (SKU can be auto-generated)
        if (!row['Item Name'] || !row['Slug'] || !row['Price'] || !row['Category']) {
          const missing = [];
          if (!row['Item Name']) missing.push('Item Name');
          if (!row['Slug']) missing.push('Slug');
          if (!row['Price']) missing.push('Price');
          if (!row['Category']) missing.push('Category');
          results.errors.push(`Row ${i + 2}: Missing required fields (${missing.join(', ')})`);
          results.failed++;
          continue;
        }

        // Auto-generate SKU if missing
        let sku = row['SKU']?.trim();
        if (!sku) {
          // Generate SKU from slug: convert to uppercase and replace hyphens with underscores
          sku = row['Slug'].toUpperCase().replace(/-/g, '_');
          // Add timestamp to make it unique
          sku = `${sku}_${Date.now()}`;
        }

        // Validate category exists
        const categorySlug = categoryMap.get(row['Category'].toLowerCase());
        if (!categorySlug) {
          results.errors.push(`Row ${i + 2}: Category "${row['Category']}" not found`);
          results.failed++;
          continue;
        }

        const productData = {
          sku: sku.toUpperCase(),
          name: row['Item Name'],
          slug: row['Slug'].toLowerCase(),
          description: row['Description'] || '',
          category: categorySlug,
          subcategory: row['Sub Category'] || undefined,
          price: parseFloat(row['Price']),
          retailPrice: row['Retail Price'] ? parseFloat(row['Retail Price']) : undefined,
          discountPrice: row['Discount Price'] ? parseFloat(row['Discount Price']) : undefined,
          stock: parseInt(row['Stock']) || 0,
          tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
          status: (row['Status']?.toLowerCase().trim() || 'draft') as 'active' | 'inactive' | 'draft',
          images: row['Images']
            ? row['Images'].split(';').map(url => ({
                url: url.trim(),
                alt: row['Item Name'],
              }))
            : [],
          rating: row['Rating'] ? parseFloat(row['Rating']) : undefined,
          reviewCount: row['Review Count'] ? parseInt(row['Review Count']) : 0,
          // New fields
          hsn: row['HSN'] || undefined,
          brand: row['Brand'] || undefined,
          manufacturer: row['Manufacturer'] || undefined,
          quantityPerItem: row['Qty Per Item'] ? parseInt(row['Qty Per Item']) : undefined,
          unit: row['Unit'] || undefined,
          weight: row['Weight'] ? parseFloat(row['Weight']) : undefined,
          weightUnit: row['Weight Unit'] || undefined,
          material: row['Material'] || undefined,
          color: row['Color'] || undefined,
          size: row['Size'] || undefined,
          warranty: row['Warranty'] || undefined,
          countryOfOrigin: row['Country Of Origin'] || 'India',
          minOrderQuantity: row['Min Order Qty'] ? parseInt(row['Min Order Qty']) : undefined,
          maxOrderQuantity: row['Max Order Qty'] ? parseInt(row['Max Order Qty']) : undefined,
          isFeatured: row['Is Featured']?.toLowerCase() === 'true',
          isNewArrival: row['Is New Arrival']?.toLowerCase() === 'true',
          isBestSeller: row['Is Best Seller']?.toLowerCase() === 'true',
          features: row['Features'] ? row['Features'].split(';').map(f => f.trim()).filter(Boolean) : undefined,
          specifications: row['Specifications'] ? Object.fromEntries(
            row['Specifications'].split(';').map(s => {
              const [key, value] = s.split(':').map(p => p.trim());
              return [key, value];
            }).filter(([k, v]) => k && v)
          ) : undefined,
          dimensions: (row['Length'] || row['Width'] || row['Height'] || row['Breadth']) ? {
            length: row['Length'] ? parseFloat(row['Length']) : undefined,
            width: row['Width'] ? parseFloat(row['Width']) : undefined,
            height: row['Height'] ? parseFloat(row['Height']) : undefined,
            breadth: row['Breadth'] ? parseFloat(row['Breadth']) : undefined,
            unit: row['Dimension Unit'] || 'cm',
          } : undefined,
          cgst: row['CGST'] ? parseFloat(row['CGST']) : undefined,
          sgst: row['SGST'] ? parseFloat(row['SGST']) : undefined,
          igst: row['IGST'] ? parseFloat(row['IGST']) : undefined,
        };

        console.log(`Row ${i + 2} - SKU: ${productData.sku}, Status from CSV: "${row['Status']}", Parsed Status: "${productData.status}"`);

        // Check if product exists by SKU (primary match)
        let existingProduct = await Product.findOne({ sku: productData.sku });

        // If not found by SKU, try to find by slug (fallback for updates)
        if (!existingProduct) {
          existingProduct = await Product.findOne({ slug: productData.slug });
        }

        if (existingProduct) {
          // Update existing product - update ALL fields
          const updateData: any = {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            tags: productData.tags,
            status: productData.status,
            images: productData.images,
            sku: productData.sku,
            subcategory: productData.subcategory || null,
            retailPrice: productData.retailPrice || null,
            discountPrice: productData.discountPrice || null,
            rating: productData.rating || null,
            reviewCount: productData.reviewCount || 0,
            // New fields
            hsn: productData.hsn || null,
            brand: productData.brand || null,
            manufacturer: productData.manufacturer || null,
            quantityPerItem: productData.quantityPerItem || null,
            unit: productData.unit || null,
            weight: productData.weight || null,
            weightUnit: productData.weightUnit || null,
            material: productData.material || null,
            color: productData.color || null,
            size: productData.size || null,
            warranty: productData.warranty || null,
            countryOfOrigin: productData.countryOfOrigin || 'India',
            minOrderQuantity: productData.minOrderQuantity || null,
            maxOrderQuantity: productData.maxOrderQuantity || null,
            isFeatured: productData.isFeatured,
            isNewArrival: productData.isNewArrival,
            isBestSeller: productData.isBestSeller,
            features: productData.features || null,
            specifications: productData.specifications || null,
            dimensions: productData.dimensions || null,
            cgst: productData.cgst || null,
            sgst: productData.sgst || null,
            igst: productData.igst || null,
          };

          console.log(`Row ${i + 2} - Updating product ${existingProduct._id}`, updateData);

          const updatedProduct = await Product.findByIdAndUpdate(existingProduct._id, updateData, { new: true });
          console.log(`Row ${i + 2} - Updated product:`, updatedProduct);
          results.updated++;
        } else {
          // Create new product only if neither SKU nor slug exists
          console.log(`Row ${i + 2} - Creating new product`, productData);
          const newProduct = await Product.create(productData);
          console.log(`Row ${i + 2} - Created product:`, newProduct);
          results.imported++;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Row ${i + 2} error:`, errorMsg, error);
        results.errors.push(`Row ${i + 2}: ${errorMsg}`);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${results.imported} imported, ${results.updated} updated, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import products' },
      { status: 500 }
    );
  }
}
