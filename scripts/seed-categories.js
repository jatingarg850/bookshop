require('dotenv').config();
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: String,
  icon: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

const defaultCategories = [
  {
    name: 'Books',
    slug: 'books',
    description: 'School books, novels, and educational materials',
    icon: '📚',
  },
  {
    name: 'Art & Craft',
    slug: 'art',
    description: 'Art supplies and craft materials',
    icon: '🎨',
  },
  {
    name: 'Craft Supplies',
    slug: 'craft',
    description: 'DIY craft supplies and materials',
    icon: '✂️',
  },
  {
    name: 'Stationery',
    slug: 'stationery',
    description: 'Pens, pencils, notebooks, and office supplies',
    icon: '✏️',
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert default categories
    const created = await Category.insertMany(defaultCategories);
    console.log(`Created ${created.length} default categories`);

    created.forEach((cat) => {
      console.log(`✓ ${cat.name} (${cat.slug})`);
    });

    await mongoose.connection.close();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedCategories();
