import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

// Comprehensive extraction patterns
const CLASS_PATTERNS = [
  // Explicit class/grade patterns
  { pattern: /class\s+(\d+|nursery|lkg|ukg)/i, map: (m) => mapClass(m[1]) },
  { pattern: /grade\s+(\d+|nursery|lkg|ukg)/i, map: (m) => mapClass(m[1]) },
  { pattern: /\b(nursery|lkg|ukg)\b/i, map: (m) => mapClass(m[1]) },
  
  // For Class 10 and 12 (board exams)
  { pattern: /class\s+10|board\s+exam|10th|tenth/i, map: () => '10' },
  { pattern: /class\s+12|12th|twelfth|senior\s+secondary/i, map: () => '12' },
];

const SUBJECT_PATTERNS = [
  'Mathematics', 'Math', 'Maths',
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

function mapClass(value) {
  const v = String(value).toLowerCase();
  if (v === 'nursery') return 'Nursery';
  if (v === 'lkg') return 'LKG';
  if (v === 'ukg') return 'UKG';
  const num = parseInt(v);
  if (!isNaN(num) && num >= 1 && num <= 12) return String(num);
  return null;
}

function extractClassFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  // Try each pattern
  for (const { pattern, map } of CLASS_PATTERNS) {
    const match = searchText.match(pattern);
    if (match) {
      const result = map(match);
      if (result) return result;
    }
  }

  return null;
}

function extractSubjectFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const subject of SUBJECT_PATTERNS) {
    if (searchText.includes(subject.toLowerCase())) {
      return subject;
    }
  }

  return null;
}

function extractBoardFromProduct(product) {
  const searchText = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  if (searchText.includes('ncert')) return 'NCERT';
  if (searchText.includes('cbse')) return 'CBSE';
  if (searchText.includes('icse')) return 'ICSE';
  if (searchText.includes('state board')) return 'State Board';

  return null;
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Find all products without class
    const productsNeedingClass = await Product.find({
      $or: [
        { class: { $exists: false } },
        { class: null },
      ],
    });

    console.log(`Found ${productsNeedingClass.length} products without class\n`);

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

    console.log(`✓ Extraction complete!`);
    console.log(`  - Updated: ${updated} products`);
    console.log(`  - Skipped (no class found): ${skipped} products\n`);

    // Show summary of classes found
    const classDistribution = await Product.aggregate([
      { $match: { class: { $exists: true, $ne: null } } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log('Class distribution in database:');
    const classOrder = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    for (const cls of classOrder) {
      const item = classDistribution.find(d => d._id === cls);
      if (item) {
        console.log(`  ${cls}: ${item.count} products`);
      }
    }

    // Show products without class
    const productsStillWithoutClass = await Product.find({
      $or: [
        { class: { $exists: false } },
        { class: null },
      ],
    }).select('name category');

    if (productsStillWithoutClass.length > 0) {
      console.log(`\n${productsStillWithoutClass.length} products still without class (likely non-textbook items):`);
      for (const product of productsStillWithoutClass.slice(0, 10)) {
        console.log(`  - ${product.name} (${product.category})`);
      }
      if (productsStillWithoutClass.length > 10) {
        console.log(`  ... and ${productsStillWithoutClass.length - 10} more`);
      }
    }

    await mongoose.connection.close();
    console.log('\n✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
