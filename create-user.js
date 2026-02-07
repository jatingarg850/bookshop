const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env file');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  phone: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [
    {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],
  defaultAddressId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'user@radhestationery.com';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      console.log('User ID:', existingUser._id.toString());
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('pass123', salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
    });

    await user.save();
    console.log('✓ User created successfully');
    console.log('User ID:', user._id.toString());
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createUser();
