// Quick test to verify class extraction from tags

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

// Test cases
const testCases = [
  {
    name: 'NCERT Class 7 Mathematics',
    tags: ['Class 7', 'Mathematics', 'English', 'NCERT', 'CBSE', 'Textbook', 'Secondary'],
    expected: '7'
  },
  {
    name: 'NCERT Class 10 Science',
    tags: ['Class 10', 'Science', 'English', 'NCERT', 'CBSE', 'Textbook', 'Secondary'],
    expected: '10'
  },
  {
    name: 'Nursery Book',
    tags: ['Nursery', 'English', 'Alphabet', 'Learning'],
    expected: 'Nursery'
  },
  {
    name: 'LKG Book',
    tags: ['LKG', 'Numbers', 'Learning'],
    expected: 'LKG'
  },
  {
    name: 'No class tag',
    tags: ['Stationery', 'Notebook', 'Paper'],
    expected: null
  },
];

console.log('Testing class extraction from tags:\n');

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = extractClassFromTags(test.tags);
  const success = result === test.expected;
  
  if (success) {
    console.log(`✓ ${test.name}`);
    console.log(`  Tags: ${test.tags.join(', ')}`);
    console.log(`  Extracted: ${result}\n`);
    passed++;
  } else {
    console.log(`✗ ${test.name}`);
    console.log(`  Tags: ${test.tags.join(', ')}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}\n`);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
