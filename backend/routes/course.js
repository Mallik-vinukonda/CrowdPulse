const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
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

// List all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Unlock/buy a course with credits
router.post('/:id/unlock', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.unlockedCourses.includes(course._id)) return res.status(400).json({ error: 'Already unlocked' });
    if (user.credits < course.price) return res.status(400).json({ error: 'Insufficient credits' });
    user.credits -= course.price;
    user.unlockedCourses.push(course._id);
    await user.save();
    course.accessList.push(user._id);
    await course.save();
    await CreditTransaction.create({ user: user._id, amount: -course.price, type: 'unlock', reference: course._id });
    res.json({ message: 'Course unlocked!', course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get my unlocked courses
router.get('/mine', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('unlockedCourses');
    res.json(user.unlockedCourses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
