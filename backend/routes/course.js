const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const { auth, adminAuth } = require("../middleware/auth");
const { validateCourseCreation } = require("../middleware/validation");

// List all active courses
router.get("/", async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const courses = await Course.find({ isActive: true })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Course.countDocuments({ isActive: true });

		res.json({
			success: true,
			courses,
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

// Create new course (admin only)
router.post("/", adminAuth, validateCourseCreation, async (req, res, next) => {
	try {
		const { title, description, price, contentUrl } = req.body;

		const course = new Course({
			title,
			description,
			price,
			contentUrl,
			isActive: true,
		});

		await course.save();

		res.status(201).json({
			success: true,
			course,
		});
	} catch (err) {
		next(err);
	}
});

// Unlock/buy a course with credits
router.post("/:id/unlock", auth, async (req, res, next) => {
	try {
		const course = await Course.findById(req.params.id);
		const user = await User.findById(req.user.id);

		if (!course || !course.isActive) {
			return res.status(404).json({ error: "Course not found or inactive" });
		}

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user.unlockedCourses.includes(course._id)) {
			return res.status(400).json({ error: "Course already unlocked" });
		}

		if (user.credits < course.price) {
			return res.status(400).json({ error: "Insufficient credits" });
		}

		// Deduct credits and unlock course
		user.credits -= course.price;
		user.unlockedCourses.push(course._id);
		await user.save();

		// Add user to course access list
		if (!course.accessList.includes(user._id)) {
			course.accessList.push(user._id);
			await course.save();
		}

		// Record transaction
		await CreditTransaction.create({
			user: user._id,
			amount: -course.price,
			type: "spend",
			reference: course._id,
			referenceModel: "Course",
			description: `Course unlock: ${course.title}`,
		});

		res.json({
			success: true,
			message: "Course unlocked successfully!",
			course,
		});
	} catch (err) {
		next(err);
	}
});

// Get my unlocked courses
router.get("/mine", auth, async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).populate("unlockedCourses");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({
			success: true,
			courses: user.unlockedCourses || [],
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
