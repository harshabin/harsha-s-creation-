const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const changeAdmin = async () => {
  const args = process.argv.slice(2);
  const newEmail = args[0];
  const newPassword = args[1];
  const newName = args[2];

  if (!newEmail || !newPassword) {
    console.log('\n❌ Usage:');
    console.log('   node utils/changeAdmin.js <new_email> <new_password> [optional_new_name]\n');
    console.log('   Example:');
    console.log('   node utils/changeAdmin.js myadmin@harshascreation.com MySecretPass123 "Harsha\"\n');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('⚠️ No existing admin found. Creating a new admin account...');
      admin = new User({
        name: newName || "Harsha's Creation Administrator",
        email: newEmail.toLowerCase().trim(),
        password: newPassword,
        role: 'admin',
        phone: '+91 9876543210'
      });
    } else {
      console.log(`Found existing admin: ${admin.email}`);
      admin.email = newEmail.toLowerCase().trim();
      admin.password = newPassword;
      if (newName) {
        admin.name = newName;
      }
    }

    await admin.save();
    console.log('\n✨ Admin credentials updated successfully!');
    console.log('--------------------------------------------------');
    console.log(`👤 Name:     ${admin.name}`);
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('--------------------------------------------------');
    console.log('You can now log in at: http://localhost:5173/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update admin credentials:', error.message);
    process.exit(1);
  }
};

changeAdmin();
