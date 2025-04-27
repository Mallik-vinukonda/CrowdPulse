const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  credits: { type: Number, default: 100 }, // Ensure default is set
  unlockedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  redemptionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RedemptionRequest' }],
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.pre('save', function(next) {
  if (this.isNew && (typeof this.credits !== 'number' || this.credits < 100)) {
    this.credits = 100;
  }
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
