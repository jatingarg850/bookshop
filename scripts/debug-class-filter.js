import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../lib/db/models/Product.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Get all distinct class values
    const classes = await Product.distinct('class', { status: 'active', class: { $exists: true, $ne: null } });
    console.log('Classes in DB:', classes);
    
    // Get a sample product with class 10
    const sample = await Product.findOne({ class: '10', status: 'active' });
    console.log('Sample product with class 10:', sample ? { name: sample.name, class: sample.class, classType: typeof sample.class } : 'Not found');
    
    // Count products by class
    const counts = await Product.aggregate([
      { $match: { status: 'active', class: { $exists: true, $ne: null } } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('Products by class:', counts);
    
    // Test the filter directly
    console.log('\n--- Testing filter ---');
    const testClass = '10';
    const filtered = await Product.find({ class: testClass, status: 'active' }).limit(3);
    console.log(`Products with class="${testClass}":`, filtered.length);
    if (filtered.length > 0) {
      console.log('First product:', { name: filtered[0].name, class: filtered[0].class });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
