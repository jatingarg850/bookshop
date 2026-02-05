import { connectDB } from '../lib/db/connect';
import Product from '../lib/db/models/Product';

const sampleBooks = [
  {
    name: 'Mathematics for Class 10',
    slug: 'mathematics-class-10',
    description: 'Comprehensive mathematics textbook covering algebra, geometry, and trigonometry for class 10 students.',
    category: 'books',
    price: 450,
    discountPrice: 380,
    stock: 50,
    tags: ['textbook', 'mathematics', 'class-10'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51HSkTKlL9L.jpg',
        alt: 'Mathematics for Class 10',
      },
    ],
    status: 'active',
  },
  {
    name: 'English Literature - Classics Collection',
    slug: 'english-literature-classics',
    description: 'A curated collection of classic English literature including Shakespeare, Austen, and Dickens.',
    category: 'books',
    price: 599,
    discountPrice: 499,
    stock: 35,
    tags: ['literature', 'english', 'classics'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/41SH41SHBQL.jpg',
        alt: 'English Literature Classics',
      },
    ],
    status: 'active',
  },
  {
    name: 'Science Fundamentals - Physics & Chemistry',
    slug: 'science-fundamentals-physics-chemistry',
    description: 'Integrated science textbook covering physics and chemistry concepts for middle school students.',
    category: 'books',
    price: 520,
    discountPrice: 420,
    stock: 45,
    tags: ['science', 'physics', 'chemistry'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51YRQJ4Z5QL.jpg',
        alt: 'Science Fundamentals',
      },
    ],
    status: 'active',
  },
  {
    name: 'History of India - Complete Guide',
    slug: 'history-of-india-complete',
    description: 'Comprehensive history book covering ancient, medieval, and modern India with illustrations and maps.',
    category: 'books',
    price: 650,
    discountPrice: 520,
    stock: 30,
    tags: ['history', 'india', 'educational'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/41XYZABC123.jpg',
        alt: 'History of India',
      },
    ],
    status: 'active',
  },
  {
    name: 'Biology - Life Sciences',
    slug: 'biology-life-sciences',
    description: 'Detailed biology textbook with diagrams covering cells, genetics, ecology, and human body systems.',
    category: 'books',
    price: 580,
    discountPrice: 480,
    stock: 40,
    tags: ['biology', 'science', 'life-sciences'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51BIOLOGY01.jpg',
        alt: 'Biology Life Sciences',
      },
    ],
    status: 'active',
  },
  {
    name: 'Computer Science Basics',
    slug: 'computer-science-basics',
    description: 'Introduction to computer science, programming concepts, and digital literacy for beginners.',
    category: 'books',
    price: 495,
    discountPrice: 395,
    stock: 55,
    tags: ['computer-science', 'programming', 'technology'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51COMP001.jpg',
        alt: 'Computer Science Basics',
      },
    ],
    status: 'active',
  },
  {
    name: 'Geography - World Atlas',
    slug: 'geography-world-atlas',
    description: 'Comprehensive world atlas with maps, geographical data, and information about countries and regions.',
    category: 'books',
    price: 750,
    discountPrice: 600,
    stock: 25,
    tags: ['geography', 'atlas', 'maps'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51GEO001.jpg',
        alt: 'Geography World Atlas',
      },
    ],
    status: 'active',
  },
  {
    name: 'Hindi Literature - Kavya Sangrah',
    slug: 'hindi-literature-kavya',
    description: 'Collection of Hindi poetry and literature from classical and contemporary authors.',
    category: 'books',
    price: 420,
    discountPrice: 340,
    stock: 38,
    tags: ['hindi', 'literature', 'poetry'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51HINDI001.jpg',
        alt: 'Hindi Literature',
      },
    ],
    status: 'active',
  },
  {
    name: 'Economics - Principles & Practice',
    slug: 'economics-principles-practice',
    description: 'Introduction to economic principles, microeconomics, and macroeconomics with real-world examples.',
    category: 'books',
    price: 540,
    discountPrice: 440,
    stock: 32,
    tags: ['economics', 'business', 'social-science'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51ECON001.jpg',
        alt: 'Economics Principles',
      },
    ],
    status: 'active',
  },
  {
    name: 'Art & Design - Creative Expression',
    slug: 'art-design-creative-expression',
    description: 'Guide to art techniques, design principles, and creative expression with illustrations and examples.',
    category: 'books',
    price: 480,
    discountPrice: 380,
    stock: 28,
    tags: ['art', 'design', 'creativity'],
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_500,c_fill/https://m.media-amazon.com/images/I/51ART001.jpg',
        alt: 'Art and Design',
      },
    ],
    status: 'active',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample books
    const result = await Product.insertMany(sampleBooks);
    console.log(`✓ Seeded ${result.length} books successfully`);

    console.log('\nSample books added:');
    result.forEach((book) => {
      console.log(`  - ${book.name} (₹${book.price} → ₹${book.discountPrice})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
