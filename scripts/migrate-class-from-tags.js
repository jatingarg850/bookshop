import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

// Class patterns to match in tags
const CLASS_PATTERNS = {
  'Nursery': 'Nursery',
  'LKG': 'LKG',
  'UKG': 'UKG',
  'Class 1': '1',
  'Class 2': '2',
  'Class 3': '3',
  'Class 4': '4',
  'Class 5': '5',
  'Class 6': '6',
  'Class 7': '7',
  'Class 8': '8',
  'Class 9': '9',
  'Class 10': '10',
  'Class 11': '11',
  'Class 12': '12',
};

// Function to extract class from tags
function extractClassFromTags(tags) {
  if (!Array.isArray(tags)) return null;

  for (const tag of tags) {
    const tagStr = String(tag).trim();
    
    // Check for patterns like "Class 7", "class 10", etc. (most common format)
    const classMatch = tagStr.match(/^class\s+(\d+|nursery|lkg|ukg)$/i);
    if (classMatch) {
      const matched = classMatch[1].toLowerCase();
      if (matched === 'nursery') return 'Nursery';
      if (matched === 'lkg') return 'LKG';
      if (matched === 'ukg') return 'UKG';
      return matched;
    }
    
    // Check exact matches
    for (const [pattern, classValue] of Object.entries(CLASS_PATTERNS)) {
      if (tagStr.toLowerCase() === pattern.toLowerCase()) {
        return classValue;
      }
    }
  }

  return null;
}

// Function to extract subject from tags
function extractSubjectFromTags(tags) {
  if (!Array.isArray(tags)) return null;

  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography',
    'Civics', 'Sanskrit', 'Computer Science', 'Political Science', 'Economics',
    'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies',
    'Sociology', 'Psychology', 'Environmental Studies'
  ];

  for (const tag of tags) {
    const tagStr = String(tag).trim();
    for (const subject of subjects) {
      if (tagStr.toLowerCase() === subject.toLowerCase()) {
        return subject;
      }
    }
  }

  return null;
}

// Function to extract board from tags
function extractBoardFromTags(tags) {
  if (!Array.isArray(tags)) return null;

  const boards = ['NCERT', 'CBSE', 'ICSE', 'State Board'];

  for (const tag of tags) {
    const tagStr = String(tag).trim();
    for (const board of boards) {
      if (tagStr.toLowerCase() === board.toLowerCase()) {
        return board;
      }
    }
  }

  return null;
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Find all products with tags but no class
    const products = await Product.find({
      tags: { $exists: true, $ne: [] },
      $or: [
        { class: { $exists: false } },
        { class: null }
      ]
    });

    console.log(`\nFound ${products.length} products to migrate`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const extractedClass = extractClassFromTags(product.tags);
      const extractedSubject = extractSubjectFromTags(product.tags);
      const extractedBoard = extractBoardFromTags(product.tags);

      if (extractedClass) {
        const updateData = { class: extractedClass };
        
        if (extractedSubject && !product.subject) {
          updateData.subject = extractedSubject;
        }
        
        if (extractedBoard && !product.board) {
          updateData.board = extractedBoard;
        }

        await Product.findByIdAndUpdate(product._id, updateData);
        updated++;

        console.log(`✓ Updated: ${product.name}`);
        console.log(`  - Class: ${extractedClass}`);
        if (extractedSubject) console.log(`  - Subject: ${extractedSubject}`);
        if (extractedBoard) console.log(`  - Board: ${extractedBoard}`);
      } else {
        skipped++;
        console.log(`⊘ Skipped: ${product.name} (no class found in tags)`);
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Updated: ${updated} products`);
    console.log(`  - Skipped: ${skipped} products`);

    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
