const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  sku: String,
  name: String,
  price: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

async function updateProductTax() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find products without tax rates
    const productsWithoutTax = await Product.find({
      $or: [
        { cgst: { $exists: false } },
        { sgst: { $exists: false } },
        { igst: { $exists: false } },
        { cgst: null },
        { sgst: null },
        { igst: null },
      ],
    });

    console.log(`Found ${productsWithoutTax.length} products without tax rates\n`);

    if (productsWithoutTax.length > 0) {
      console.log('Products without tax rates:');
      productsWithoutTax.forEach((p) => {
        console.log(`  - ${p.name} (SKU: ${p.sku})`);
        console.log(`    Current: CGST=${p.cgst}, SGST=${p.sgst}, IGST=${p.igst}`);
      });
      console.log();

      // Update all products without tax rates to default 5% CGST, 5% SGST, 10% IGST
      const result = await Product.updateMany(
        {
          $or: [
            { cgst: { $exists: false } },
            { sgst: { $exists: false } },
            { igst: { $exists: false } },
            { cgst: null },
            { sgst: null },
            { igst: null },
          ],
        },
        {
          $set: {
            cgst: 5,
            sgst: 5,
            igst: 10,
          },
        }
      );

      console.log(`✓ Updated ${result.modifiedCount} products with default tax rates`);
      console.log('  CGST: 5%');
      console.log('  SGST: 5%');
      console.log('  IGST: 10%\n');
    } else {
      console.log('✓ All products already have tax rates set\n');
    }

    // Show all products with their tax rates
    const allProducts = await Product.find({}).select('name sku cgst sgst igst');
    console.log('All products with tax rates:');
    allProducts.forEach((p) => {
      console.log(`  - ${p.name} (SKU: ${p.sku}): CGST=${p.cgst}%, SGST=${p.sgst}%, IGST=${p.igst}%`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateProductTax();
