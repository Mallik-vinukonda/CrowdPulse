const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const RedemptionRequest = require("../models/RedemptionRequest");
const { auth, adminAuth } = require("../middleware/auth");
const { validateCreditRedemption } = require("../middleware/validation");

// Get my credits and transaction history
router.get("/me", auth, async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Get recent transactions
		const transactions = await CreditTransaction.find({ user: req.user.id })
			.sort({ createdAt: -1 })
			.limit(10)
			.populate("reference");

		// Defensive: if credits is undefined/null, default to 100
		const credits = typeof user.credits === "number" ? user.credits : 100;

		res.json({
			success: true,
			credits,
			transactions,
		});
	} catch (err) {
		next(err);
	}
});

// Redeem credits (request payout)
router.post(
	"/redeem",
	auth,
	validateCreditRedemption,
	async (req, res, next) => {
		try {
			const { credits, payoutMethod } = req.body;

			const user = await User.findById(req.user.id);
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			if (user.credits < credits) {
				return res.status(400).json({ error: "Insufficient credits" });
			}

			// Minimum redemption amount
			if (credits < 10) {
				return res
					.status(400)
					.json({ error: "Minimum redemption is 10 credits" });
			}

			const redemption = await RedemptionRequest.create({
				user: req.user.id,
				credits,
				payoutMethod,
				status: "pending",
			});

			// Deduct credits immediately
			user.credits -= credits;
			user.redemptionHistory.push(redemption._id);
			await user.save();

			// Record transaction
			await CreditTransaction.create({
				user: req.user.id,
				amount: -credits,
				type: "redeem",
				reference: redemption._id,
				referenceModel: "RedemptionRequest",
				description: `Credit redemption via ${payoutMethod}`,
			});

			res.status(201).json({
				success: true,
				message: "Redemption request submitted successfully",
				redemption,
			});
		} catch (err) {
			next(err);
		}
	}
);

// Get my redemption history
router.get("/redemptions", auth, async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const redemptions = await RedemptionRequest.find({ user: req.user.id })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await RedemptionRequest.countDocuments({ user: req.user.id });

		res.json({
			success: true,
			redemptions,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (err) {
		next(err);
	}
});

// Admin: get all redemption requests
router.get("/redemptions/all", adminAuth, async (req, res, next) => {
	try {
		const { status, page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const query = status ? { status } : {};

		const redemptions = await RedemptionRequest.find(query)
			.populate("user", "name email")
			.populate("processedBy", "name email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await RedemptionRequest.countDocuments(query);

		res.json({
			success: true,
			redemptions,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (err) {
		next(err);
	}
});

// Admin: approve/decline redemption
router.post("/redeem/:id/review", adminAuth, async (req, res, next) => {
	try {
		const { status, notes } = req.body; // 'approved', 'rejected', or 'completed'

		if (!["approved", "rejected", "completed"].includes(status)) {
			return res.status(400).json({ error: "Invalid status" });
		}

		const redemption = await RedemptionRequest.findById(req.params.id);
		if (!redemption) {
			return res.status(404).json({ error: "Redemption request not found" });
		}

		if (redemption.status !== "pending" && status !== "completed") {
			return res
				.status(400)
				.json({ error: "Request has already been processed" });
		}

		// If rejecting, refund credits to user
		if (status === "rejected" && redemption.status === "pending") {
			await User.findByIdAndUpdate(redemption.user, {
				$inc: { credits: redemption.credits },
			});

			// Record refund transaction
			await CreditTransaction.create({
				user: redemption.user,
				amount: redemption.credits,
				type: "earn",
				reference: redemption._id,
				referenceModel: "RedemptionRequest",
				description: "Credit refund - redemption rejected",
			});
		}

		redemption.status = status;
		redemption.processedBy = req.admin.id;
		redemption.processedAt = new Date();
		if (notes) redemption.notes = notes;

		await redemption.save();
		await redemption.populate("user", "name email");

		res.json({
			success: true,
			redemption,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
