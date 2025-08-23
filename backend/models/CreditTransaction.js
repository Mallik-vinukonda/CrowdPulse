const mongoose = require("mongoose");

const CreditTransactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		enum: ["earn", "spend", "redeem"],
		required: true,
	},
	reference: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "referenceModel",
	},
	referenceModel: {
		type: String,
		enum: ["Issue", "Course", "RedemptionRequest"],
	},
	description: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Index for efficient queries
CreditTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CreditTransaction", CreditTransactionSchema);
