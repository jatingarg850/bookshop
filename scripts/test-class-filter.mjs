import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test 1: Find products with class = 10 (number)
    const test1 = await Product.find({ class: 10, status: 'active' }).limit(3);
    console.log('\nTest 1 - class: 10 (number):', test1.length, 'products');
    if (test1.length > 0) {
      console.log('  Sample:', { name: test1[0].name, class: test1[0].class, classType: typeof test1[0].class });
    }

    // Test 2: Find products with class = "10" (string)
    const test2 = await Product.find({ class: '10', status: 'active' }).limit(3);
    console.log('\nTest 2 - class: "10" (string):', test2.length, 'products');
    if (test2.length > 0) {
      console.log('  Sample:', { name: test2[0].name, class: test2[0].class, classType: typeof test2[0].class });
    }

    // Test 3: Find with $or
    const test3 = await Product.find({
      status: 'active',
      $or: [
        { class: '10' },
        { class: 10 }
      ]
    }).limit(3);
    console.log('\nTest 3 - $or with both types:', test3.length, 'products');
    if (test3.length > 0) {
      console.log('  Sample:', { name: test3[0].name, class: test3[0].class, classType: typeof test3[0].class });
    }

    // Test 4: Find with $and and $or
    const test4 = await Product.find({
      status: 'active',
      $and: [
        {
          $or: [
            { class: '10' },
            { class: 10 }
          ]
        }
      ]
    }).limit(3);
    console.log('\nTest 4 - $and with $or:', test4.length, 'products');
    if (test4.length > 0) {
      console.log('  Sample:', { name: test4[0].name, class: test4[0].class, classType: typeof test4[0].class });
    }

    // Test 5: Get all distinct class values
    const classes = await Product.distinct('class', { status: 'active', class: { $exists: true, $ne: null } });
    console.log('\nTest 5 - All distinct classes:', classes);

    // Test 6: Get a sample product with class 10
    const sample = await Product.findOne({ class: 10, status: 'active' });
    console.log('\nTest 6 - Sample product with class 10:');
    if (sample) {
      console.log('  Name:', sample.name);
      console.log('  Class:', sample.class);
      console.log('  Class type:', typeof sample.class);
      console.log('  Full doc class field:', JSON.stringify({ class: sample.class }));
    } else {
      console.log('  Not found');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
