const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  category: String,
  price: Number,
  discountPrice: Number,
  stock: Number,
  tags: [String],
  images: [{ url: String, alt: String }],
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

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
        url: 'https://picsum.photos/400/500?random=1',
        alt: 'Mathematics for Class 10',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=2',
        alt: 'English Literature Classics',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=3',
        alt: 'Science Fundamentals',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=4',
        alt: 'History of India',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=5',
        alt: 'Biology Life Sciences',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=6',
        alt: 'Computer Science Basics',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=7',
        alt: 'Geography World Atlas',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=8',
        alt: 'Hindi Literature',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=9',
        alt: 'Economics Principles',
      },
    ],
    isActive: true,
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
        url: 'https://picsum.photos/400/500?random=10',
        alt: 'Art and Design',
      },
    ],
    isActive: true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    console.log('Inserting sample books...');
    const result = await Product.insertMany(sampleBooks);
    console.log(`✓ Seeded ${result.length} books successfully\n`);

    console.log('Sample books added:');
    result.forEach((book) => {
      const discount = Math.round(((book.price - book.discountPrice) / book.price) * 100);
      console.log(`  ✓ ${book.name}`);
      console.log(`    Price: ₹${book.price} → ₹${book.discountPrice} (${discount}% off)`);
      console.log(`    Stock: ${book.stock} units\n`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

seed();
