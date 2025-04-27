const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'redeem', 'unlock'], required: true },
  reference: { type: String }, // e.g., Issue ID, Redemption ID, Course ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);
