// data/ncertCatalog.js
// Static, metadata-only NCERT catalog generator (no PDFs/chapters).

const BOARD = 'NCERT';
const CATEGORY = 'Books';

// NOTE: These are high-level subjects per class (not copyrighted textbook contents).
const SUBJECTS_BY_CLASS = {
  1: ['Mathematics', 'English', 'Hindi'],
  2: ['Mathematics', 'English', 'Hindi'],
  3: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  4: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  5: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  6: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics'],
  7: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics'],
  8: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics'],
  9: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Political Science', 'Economics'],
  10: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Political Science', 'Economics'],
  11: [
    'English',
    'Hindi',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Accountancy',
    'Business Studies',
    'History',
    'Geography',
    'Political Science',
    'Sociology',
    'Psychology',
    'Computer Science',
  ],
  12: [
    'English',
    'Hindi',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Accountancy',
    'Business Studies',
    'History',
    'Geography',
    'Political Science',
    'Sociology',
    'Psychology',
    'Computer Science',
  ],
};

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mediumsForSubject(subject) {
  // Language books are inherently single-medium.
  if (subject === 'English' || subject === 'Computer Science') return ['English'];
  if (subject === 'Hindi') return ['Hindi'];
  return ['English', 'Hindi'];
}

function basePriceForClass(classLevel) {
  if (classLevel <= 2) return 65;
  if (classLevel <= 5) return 80;
  if (classLevel <= 8) return 95;
  if (classLevel <= 10) return 110;
  return 140;
}

function subjectSurcharge(subject) {
  const s = String(subject).toLowerCase();
  if (['physics', 'chemistry', 'biology', 'science'].includes(s)) return 20;
  if (['mathematics'].includes(s)) return 15;
  if (['economics', 'accountancy', 'business studies'].includes(s)) return 15;
  if (['history', 'geography', 'political science', 'civics', 'sociology', 'psychology'].includes(s)) return 10;
  if (['english', 'hindi'].includes(s)) return 5;
  return 0;
}

function priceFor({ classLevel, subject }) {
  const raw = basePriceForClass(classLevel) + subjectSurcharge(subject);
  return Math.round(raw / 5) * 5;
}

// Exported catalog generator. This is designed to move 1:1 to a backend later.
export function generateNcertCatalog({ inStockDefault = true } = {}) {
  const out = [];

  for (let classLevel = 1; classLevel <= 12; classLevel++) {
    const subjects = SUBJECTS_BY_CLASS[classLevel] || [];
    for (const subject of subjects) {
      for (const medium of mediumsForSubject(subject)) {
        const id = `ncert-c${classLevel}-${slugify(subject)}-${medium === 'English' ? 'en' : 'hi'}`;
        const title = `NCERT Class ${classLevel} ${subject} (${medium})`;

        out.push({
          id,
          title,
          class: classLevel,
          subject,
          medium,
          board: BOARD,
          price: priceFor({ classLevel, subject }),
          category: CATEGORY,
          inStock: inStockDefault,
        });
      }
    }
  }

  return out;
}

export const ncertCatalog = generateNcertCatalog();

// Adapter: turns NCERT metadata into the existing app's product shape.
export function ncertCatalogToProducts(catalog = ncertCatalog) {
  return catalog.map((b) => {
    const slug = slugify(`${b.board}-class-${b.class}-${b.subject}-${b.medium}`);

    return {
      id: b.id,
      _id: b.id,
      name: b.title,
      title: b.title,
      slug,
      description: `NCERT textbook for Class ${b.class} (${b.medium} medium) - ${b.subject}.`,
      category: b.category,
      price: b.price,
      inStock: b.inStock,
      stock: b.inStock ? 100 : 0,
      brand: b.board,
      rating: 0,
      reviewCount: 0,
      images: [{ url: '/stack-of-books.png', alt: b.title }],

      // Keep raw metadata for future backend migration / filtering.
      board: b.board,
      class: b.class,
      subject: b.subject,
      medium: b.medium,

      // NCERT items are not featured by default.
      isFeatured: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    };
  });
}

export const ncertProducts = ncertCatalogToProducts();
