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

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@radhestationery.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Admin ID:', existingAdmin._id.toString());
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('test123', salt);

    // Create admin user
    const admin = new User({
      email: 'admin@radhestationery.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    });

    await admin.save();
    console.log('✓ Admin user created successfully');
    console.log('Admin ID:', admin._id.toString());
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
