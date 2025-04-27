const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Resource = require('../models/Resource');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
// File filter to allow only PDFs and images
function fileFilter(req, file, cb) {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs and image files are allowed!'), false);
  }
}
const upload = multer({ storage, fileFilter });

// Middleware: admin auth (JWT)
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/resources/upload (admin only)
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const { title, author, type, credits, link } = req.body;
    let fileUrl = undefined;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    const resource = new Resource({
      title,
      author,
      type,
      credits,
      fileUrl,
      link,
      imageUrl: req.body.imageUrl
    });
    await resource.save();
    res.json({ message: 'Resource uploaded', resource });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// GET /api/resources (public)
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

module.exports = router;
