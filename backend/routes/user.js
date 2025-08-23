const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const {
	validateUserRegistration,
	validateUserLogin,
} = require("../middleware/validation");

// Register
router.post("/register", validateUserRegistration, async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// Create new user with default credits
		const user = new User({
			name,
			email,
			password,
			role: "user",
			credits: 100,
		});

		await user.save();

		// Generate token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.status(201).json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				credits: user.credits,
			},
		});
	} catch (err) {
		next(err);
	}
});

// Login
router.post("/login", validateUserLogin, async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				credits: user.credits,
			},
		});
	} catch (err) {
		next(err);
	}
});

// Get my profile (protected)
router.get("/me", auth, async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({
			success: true,
			user,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
