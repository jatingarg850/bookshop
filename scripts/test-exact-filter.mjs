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

    // Test the exact filter from the API
    const filter = {
      status: 'active',
      $and: [
        {
          $or: [
            { class: '10' },
            { class: 10 }
          ]
        }
      ]
    };

    console.log('Filter:', JSON.stringify(filter));
    const results = await Product.find(filter).limit(5);
    console.log('Results:', results.length);
    if (results.length > 0) {
      console.log('First product:', { name: results[0].name, class: results[0].class });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
