const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Issue a JWT (set your own secret in .env)
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '1d' }
    );
    res.json({ token, admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
