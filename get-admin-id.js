const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: 'admin@radhestationery.com' });
    if (user) {
      console.log('Admin User ID:', user._id.toString());
      console.log('Full User Data:', JSON.stringify(user, null, 2));
    } else {
      console.log('Admin user not found');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
