const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  category: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creditsAwarded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);
