import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

// Comprehensive list of class patterns to match
const CLASS_KEYWORDS = {
  'nursery': 'Nursery',
  'lkg': 'LKG',
  'ukg': 'UKG',
  'class 1': '1',
  'class 2': '2',
  'class 3': '3',
  'class 4': '4',
  'class 5': '5',
  'class 6': '6',
  'class 7': '7',
  'class 8': '8',
  'class 9': '9',
  'class 10': '10',
  'class 11': '11',
  'class 12': '12',
  'grade 1': '1',
  'grade 2': '2',
  'grade 3': '3',
  'grade 4': '4',
  'grade 5': '5',
  'grade 6': '6',
  'grade 7': '7',
  'grade 8': '8',
  'grade 9': '9',
  'grade 10': '10',
  'grade 11': '11',
  'grade 12': '12',
};

const SUBJECT_KEYWORDS = [
  'Mathematics', 'Math',
  'Science',
  'English',
  'Hindi',
  'History',
  'Geography',
  'Civics',
  'Sanskrit',
  'Computer Science',
  'Political Science',
  'Economics',
  'Physics',
  'Chemistry',
  'Biology',
  'Accountancy',
  'Business Studies',
  'Sociology',
  'Psychology',
  'Environmental Studies',
  'Urdu',
];

const BOARD_KEYWORDS = ['NCERT', 'CBSE', 'ICSE', 'State Board'];

// Extract class from product name, description, or tags
function extractClassFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  // Check each class keyword
  for (const [keyword, classValue] of Object.entries(CLASS_KEYWORDS)) {
    if (searchText.includes(keyword)) {
      return classValue;
    }
  }

  return null;
}

// Extract subject from product name, description, or tags
function extractSubjectFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const subject of SUBJECT_KEYWORDS) {
    if (searchText.toLowerCase().includes(subject.toLowerCase())) {
      return subject;
    }
  }

  return null;
}

// Extract board from product name, description, or tags
function extractBoardFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const board of BOARD_KEYWORDS) {
    if (searchText.toLowerCase().includes(board.toLowerCase())) {
      return board;
    }
  }

  return null;
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Find all products
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} total products in database\n`);

    // Find products that need class extraction
    const productsNeedingClass = allProducts.filter(p => !p.class);
    console.log(`${productsNeedingClass.length} products need class extraction\n`);

    let updated = 0;
    let skipped = 0;
    const updates = [];

    for (const product of productsNeedingClass) {
      const extractedClass = extractClassFromProduct(product);
      const extractedSubject = extractSubjectFromProduct(product);
      const extractedBoard = extractBoardFromProduct(product);

      if (extractedClass) {
        const updateData = { class: extractedClass };

        if (extractedSubject && !product.subject) {
          updateData.subject = extractedSubject;
        }

        if (extractedBoard && !product.board) {
          updateData.board = extractedBoard;
        }

        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: updateData },
          },
        });

        updated++;

        console.log(`✓ ${product.name}`);
        console.log(`  Class: ${extractedClass}`);
        if (extractedSubject) console.log(`  Subject: ${extractedSubject}`);
        if (extractedBoard) console.log(`  Board: ${extractedBoard}`);
        console.log();
      } else {
        skipped++;
        console.log(`⊘ ${product.name} (no class found)\n`);
      }
    }

    // Perform bulk update
    if (updates.length > 0) {
      console.log(`\nPerforming bulk update of ${updates.length} products...`);
      const result = await Product.bulkWrite(updates);
      console.log(`✓ Bulk update complete`);
      console.log(`  - Modified: ${result.modifiedCount}`);
      console.log(`  - Matched: ${result.matchedCount}\n`);
    }

    console.log(`✓ Migration complete!`);
    console.log(`  - Updated: ${updated} products`);
    console.log(`  - Skipped: ${skipped} products`);
    console.log(`  - Already had class: ${allProducts.length - productsNeedingClass.length} products\n`);

    // Show summary of classes found
    const classDistribution = await Product.aggregate([
      { $match: { class: { $exists: true, $ne: null } } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log('Class distribution in database:');
    for (const item of classDistribution) {
      console.log(`  ${item._id}: ${item.count} products`);
    }

    await mongoose.connection.close();
    console.log('\n✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
