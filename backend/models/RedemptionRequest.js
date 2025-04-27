const mongoose = require('mongoose');

const RedemptionRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  credits: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  payoutMethod: { type: String }, // e.g., UPI, Paytm, Bank
  createdAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
});

module.exports = mongoose.model('RedemptionRequest', RedemptionRequestSchema);
