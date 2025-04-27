require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

async function createAdmin() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const email = 'mallikvinukonda123@gmail.com'; // CHANGE THIS
  const password = '123456789'; // CHANGE THIS
  const name = 'SuperAdmin';

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = new Admin({ email, password: hashedPassword, name });
  await admin.save();
  console.log('Admin created:', email);

  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
