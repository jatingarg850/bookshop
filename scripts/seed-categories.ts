import { connectDB } from '../lib/db/connect';
import Category from '../lib/db/models/Category';

async function seedCategories() {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany({});

    // Create main categories
    const mainCategories = [
      {
        name: 'Books',
        slug: 'books',
        description: 'Educational and reference books',
        isActive: true,
      },
      {
        name: 'Stationery',
        slug: 'stationery',
        description: 'Writing and office supplies',
        isActive: true,
      },
      {
        name: 'Art',
        slug: 'art',
        description: 'Art and craft supplies',
        isActive: true,
      },
      {
        name: 'Craft',
        slug: 'craft',
        description: 'Craft materials and supplies',
        isActive: true,
      },
    ];

    const createdCategories = await Category.insertMany(mainCategories);
    console.log(`✓ Created ${createdCategories.length} main categories`);

    // Create subcategories
    const subcategories = [
      // Books subcategories
      { name: 'Notebooks', slug: 'notebooks', parentId: createdCategories[0]._id, isActive: true },
      { name: 'Diaries', slug: 'diaries', parentId: createdCategories[0]._id, isActive: true },
      { name: 'Planners', slug: 'planners', parentId: createdCategories[0]._id, isActive: true },
      { name: 'Journals', slug: 'journals', parentId: createdCategories[0]._id, isActive: true },
      { name: 'Textbooks', slug: 'textbooks', parentId: createdCategories[0]._id, isActive: true },

      // Stationery subcategories
      { name: 'Pens', slug: 'pens', parentId: createdCategories[1]._id, isActive: true },
      { name: 'Pencils', slug: 'pencils', parentId: createdCategories[1]._id, isActive: true },
      { name: 'Markers', slug: 'markers', parentId: createdCategories[1]._id, isActive: true },
      { name: 'Highlighters', slug: 'highlighters', parentId: createdCategories[1]._id, isActive: true },
      { name: 'Erasers', slug: 'erasers', parentId: createdCategories[1]._id, isActive: true },

      // Art subcategories
      { name: 'Color Pencils', slug: 'color-pencils', parentId: createdCategories[2]._id, isActive: true },
      { name: 'Paints', slug: 'paints', parentId: createdCategories[2]._id, isActive: true },
      { name: 'Brushes', slug: 'brushes', parentId: createdCategories[2]._id, isActive: true },
      { name: 'Sketch Pads', slug: 'sketch-pads', parentId: createdCategories[2]._id, isActive: true },
      { name: 'Canvas', slug: 'canvas', parentId: createdCategories[2]._id, isActive: true },

      // Craft subcategories
      { name: 'Paper', slug: 'paper', parentId: createdCategories[3]._id, isActive: true },
      { name: 'Scissors', slug: 'scissors', parentId: createdCategories[3]._id, isActive: true },
      { name: 'Glue', slug: 'glue', parentId: createdCategories[3]._id, isActive: true },
      { name: 'Tape', slug: 'tape', parentId: createdCategories[3]._id, isActive: true },
      { name: 'Craft Supplies', slug: 'craft-supplies', parentId: createdCategories[3]._id, isActive: true },
    ];

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log(`✓ Created ${createdSubcategories.length} subcategories`);

    console.log('✓ Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
