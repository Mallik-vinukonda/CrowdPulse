const mongoose = require("mongoose");

const RedemptionRequestSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	credits: {
		type: Number,
		required: true,
		min: 1,
	},
	payoutMethod: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "approved", "rejected", "completed"],
		default: "pending",
	},
	processedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin",
	},
	processedAt: {
		type: Date,
	},
	notes: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Index for efficient queries
RedemptionRequestSchema.index({ user: 1, createdAt: -1 });
RedemptionRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("RedemptionRequest", RedemptionRequestSchema);
