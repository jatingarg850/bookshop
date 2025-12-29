const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  name: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [
    {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: Boolean,
    },
  ],
  defaultAddressId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log(`  Email: admin@example.com`);
      console.log(`  Password: admin123\n`);
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('Creating admin user...');
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    });

    console.log('✓ Admin user created successfully\n');
    console.log('Admin Credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123\n');
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
