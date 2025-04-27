const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const RedemptionRequest = require('../models/RedemptionRequest');
const jwt = require('jsonwebtoken');

// Auth middleware (copied from user.js)
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get my credits and transaction history
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Defensive: if credits is undefined/null, default to 100
    const credits = typeof user.credits === 'number' ? user.credits : 100;
    res.json({ credits });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Redeem credits (request payout)
router.post('/redeem', auth, async (req, res) => {
  try {
    const { credits, payoutMethod } = req.body;
    const user = await User.findById(req.user.id);
    if (user.credits < credits) return res.status(400).json({ error: 'Insufficient credits' });
    const redemption = await RedemptionRequest.create({
      user: req.user.id,
      credits,
      payoutMethod,
      status: 'pending'
    });
    user.credits -= credits;
    user.redemptionHistory.push(redemption._id);
    await user.save();
    await CreditTransaction.create({ user: req.user.id, amount: -credits, type: 'redeem', reference: redemption._id });
    res.json({ message: 'Redemption request submitted', redemption });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: approve/decline redemption
router.post('/redeem/:id/review', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'declined'
    const redemption = await RedemptionRequest.findById(req.params.id);
    if (!redemption) return res.status(404).json({ error: 'Request not found' });
    redemption.status = status;
    redemption.reviewedBy = req.user.id;
    redemption.reviewedAt = new Date();
    await redemption.save();
    res.json(redemption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
