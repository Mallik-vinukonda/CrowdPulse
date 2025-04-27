const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');
const Admin = require('../models/Admin');
const CreditTransaction = require('../models/CreditTransaction');
const jwt = require('jsonwebtoken');

// User or Admin Auth middleware
function userOrAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.user = decoded;
      req.isAdmin = false;
    } else if (decoded.adminId) {
      req.admin = decoded;
      req.isAdmin = true;
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Submit new issue (protected, user only)
router.post('/', userOrAdminAuth, async (req, res) => {
  if (req.isAdmin) return res.status(403).json({ error: 'Admins cannot submit issues' });
  try {
    const { title, description, photoUrl, location, category } = req.body;
    const issue = new Issue({
      title,
      description,
      photoUrl,
      location,
      category,
      submittedBy: req.user.id
    });
    await issue.save();
    // Reward 1 credit for every submission
    await User.findByIdAndUpdate(req.user.id, { $inc: { credits: 1 } });
    await CreditTransaction.create({ user: req.user.id, amount: 1, type: 'earn', reference: issue._id });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all issues (admin) or user's issues (user)
router.get('/', userOrAdminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let issues;
    if (req.isAdmin) {
      // Admin: get all issues
      const query = status ? { status } : {};
      issues = await Issue.find(query).populate('submittedBy', 'name email');
    } else {
      // User: get only their own issues
      const query = { submittedBy: req.user.id };
      if (status) query.status = status;
      issues = await Issue.find(query).populate('submittedBy', 'name email');
    }
    res.json(issues);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Review issue (accept/reject) - admin only
router.post('/:id/review', userOrAdminAuth, async (req, res) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Only admins can review issues' });
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    issue.status = status;
    if (status === 'accepted') {
      await User.findByIdAndUpdate(issue.submittedBy, { $inc: { credits: 10 } });
      await CreditTransaction.create({ user: issue.submittedBy, amount: 10, type: 'earn', reference: issue._id });
      issue.creditsAwarded = 10;
    }
    issue.reviewedBy = req.admin.adminId;
    issue.updatedAt = new Date();
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get my issues (protected)
router.get('/mine', userOrAdminAuth, async (req, res) => {
  try {
    const issues = await Issue.find({ submittedBy: req.user.id });
    res.json(issues);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
