const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  type: { type: String, enum: ['ebook', 'newspaper', 'article', 'journal'], required: true },
  credits: { type: Number, default: 0 },
  fileUrl: { type: String }, // For ebooks/newspapers (PDF)
  imageUrl: { type: String },
  link: { type: String }, // For articles/journals (external links)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);
