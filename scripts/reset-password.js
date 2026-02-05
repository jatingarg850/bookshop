/* eslint-disable no-console */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars (prefer .env.local for Next.js apps, fallback to .env)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to .env.local or .env');
  process.exit(1);
}

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node scripts/reset-password.js <email> <newPassword>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  // Minimal model for updating password.
  const User =
    mongoose.models.User ||
    mongoose.model(
      'User',
      new mongoose.Schema(
        { email: String, password: String },
        { timestamps: true, strict: false }
      )
    );

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(String(newPassword), salt);

  const user = await User.findOneAndUpdate(
    { email: String(email).toLowerCase().trim() },
    { $set: { password: hashed } },
    { new: true }
  );

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exitCode = 2;
    return;
  }

  console.log(`✓ Password reset for: ${user.email}`);
}

main()
  .catch((err) => {
    console.error('Failed to reset password:', err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {}
  });

