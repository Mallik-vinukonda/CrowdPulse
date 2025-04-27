require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Import routes
const userRoutes = require('./routes/user');
const issueRoutes = require('./routes/issue');
const creditRoutes = require('./routes/credit');
const courseRoutes = require('./routes/course');
const adminRoutes = require('./routes/admin');
const resourceRoutes = require('./routes/resource');

// API routes
app.use('/api/user', userRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
