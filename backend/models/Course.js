const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true, min: 1 }, // in credits
	contentUrl: { type: String },
	accessList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
});

// Indexes for efficient queries
CourseSchema.index({ isActive: 1, createdAt: -1 });
CourseSchema.index({ price: 1 });

module.exports = mongoose.model("Course", CourseSchema);
