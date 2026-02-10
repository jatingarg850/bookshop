/**
 * Check and fix product weights in database
 * Run: node scripts/check-product-weights.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

async function checkProducts() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Find products without weight
    console.log('📊 Checking products...\n');
    
    const productsWithoutWeight = await productsCollection
      .find({ $or: [{ weight: null }, { weight: undefined }, { weight: { $exists: false } }] })
      .toArray();

    const productsWithWeight = await productsCollection
      .find({ weight: { $exists: true, $ne: null } })
      .toArray();

    console.log(`✓ Products WITH weight: ${productsWithWeight.length}`);
    console.log(`✗ Products WITHOUT weight: ${productsWithoutWeight.length}\n`);

    if (productsWithoutWeight.length > 0) {
      console.log('📝 Products without weight:\n');
      productsWithoutWeight.slice(0, 10).forEach(p => {
        console.log(`  - ${p.name} (ID: ${p._id})`);
      });
      
      if (productsWithoutWeight.length > 10) {
        console.log(`  ... and ${productsWithoutWeight.length - 10} more\n`);
      }

      console.log('🔧 FIXING: Setting default weight to 300g for all products without weight...\n');
      
      const result = await productsCollection.updateMany(
        { $or: [{ weight: null }, { weight: undefined }, { weight: { $exists: false } }] },
        { $set: { weight: 300, weightUnit: 'g' } }
      );

      console.log(`✓ Updated ${result.modifiedCount} products with default weight (300g)\n`);
    }

    // Show sample products with weight
    console.log('📋 Sample products with weight:\n');
    const samples = await productsCollection
      .find({ weight: { $exists: true, $ne: null } })
      .limit(5)
      .toArray();

    samples.forEach(p => {
      console.log(`  ✓ ${p.name}: ${p.weight}${p.weightUnit || 'g'}`);
    });

    console.log('\n' + '='.repeat(80) + '\n');
    console.log('✓ Product weight check complete!\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
