const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Issue = require("../models/Issue");
const User = require("../models/User");
const RedemptionRequest = require("../models/RedemptionRequest");
const { adminAuth } = require("../middleware/auth");
const { validateUserLogin } = require("../middleware/validation");

// Admin login route
router.post("/login", validateUserLogin, async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const admin = await Admin.findOne({ email, isActive: true });
		if (!admin) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const isMatch = await admin.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Update last login
		admin.lastLogin = new Date();
		await admin.save();

		const token = jwt.sign(
			{ adminId: admin._id, email: admin.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.json({
			success: true,
			token,
			admin: {
				id: admin._id,
				email: admin.email,
				name: admin.name,
			},
		});
	} catch (err) {
		next(err);
	}
});

// Get admin dashboard stats
router.get("/dashboard", adminAuth, async (req, res, next) => {
	try {
		const [
			totalUsers,
			totalIssues,
			pendingIssues,
			acceptedIssues,
			rejectedIssues,
			pendingRedemptions,
		] = await Promise.all([
			User.countDocuments(),
			Issue.countDocuments(),
			Issue.countDocuments({ status: "pending" }),
			Issue.countDocuments({ status: "accepted" }),
			Issue.countDocuments({ status: "rejected" }),
			RedemptionRequest.countDocuments({ status: "pending" }),
		]);

		res.json({
			success: true,
			stats: {
				totalUsers,
				totalIssues,
				pendingIssues,
				acceptedIssues,
				rejectedIssues,
				pendingRedemptions,
			},
		});
	} catch (err) {
		next(err);
	}
});

// Get all users (admin only)
router.get("/users", adminAuth, async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const users = await User.find()
			.select("-password")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await User.countDocuments();

		res.json({
			success: true,
			users,
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

module.exports = router;
