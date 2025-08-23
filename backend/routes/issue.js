const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Issue = require("../models/Issue");
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const { auth, userOrAdminAuth, adminAuth } = require("../middleware/auth");
const {
	validateIssueSubmission,
	validateIssueReview,
} = require("../middleware/validation");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, "issue-" + uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif|webp/;
		const extname = allowedTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = allowedTypes.test(file.mimetype);

		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
});

// Submit new issue (protected, user only)
router.post(
	"/",
	auth,
	upload.single("photo"),
	validateIssueSubmission,
	async (req, res, next) => {
		try {
			const { title, description, location, category } = req.body;

			// Parse location if it's a string
			let parsedLocation = {};
			if (location) {
				if (typeof location === "string") {
					try {
						parsedLocation = JSON.parse(location);
					} catch {
						parsedLocation = { address: location };
					}
				} else {
					parsedLocation = location;
				}
			}

			// Handle photo upload
			let photoUrl = null;
			if (req.file) {
				photoUrl = `/uploads/${req.file.filename}`;
			}

			const issue = new Issue({
				title,
				description,
				photoUrl,
				location: parsedLocation,
				category,
				submittedBy: req.user.id,
			});

			await issue.save();

			// Reward 1 credit for every submission
			await User.findByIdAndUpdate(req.user.id, { $inc: { credits: 1 } });

			// Create credit transaction record if model exists
			try {
				await CreditTransaction.create({
					user: req.user.id,
					amount: 1,
					type: "earn",
					reference: issue._id,
					description: "Issue submission reward",
				});
			} catch (err) {
				console.log(
					"CreditTransaction model not found, skipping transaction record"
				);
			}

			// Populate submittedBy for response
			await issue.populate("submittedBy", "name email");

			res.status(201).json({
				success: true,
				issue,
			});
		} catch (err) {
			// Clean up uploaded file if there was an error
			if (req.file) {
				fs.unlink(req.file.path, (unlinkErr) => {
					if (unlinkErr) console.error("Error deleting file:", unlinkErr);
				});
			}
			next(err);
		}
	}
);

// List all issues (admin) or user's issues (user)
router.get("/", userOrAdminAuth, async (req, res, next) => {
	try {
		const { status, page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		let query = {};
		if (req.isAdmin) {
			// Admin: get all issues
			if (status) query.status = status;
		} else {
			// User: get only their own issues
			query.submittedBy = req.user.id;
			if (status) query.status = status;
		}

		const issues = await Issue.find(query)
			.populate("submittedBy", "name email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Issue.countDocuments(query);

		res.json({
			success: true,
			issues,
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

// Review issue (accept/reject) - admin only
router.post(
	"/:id/review",
	userOrAdminAuth,
	validateIssueReview,
	async (req, res, next) => {
		if (!req.isAdmin) {
			return res.status(403).json({ error: "Only admins can review issues" });
		}

		try {
			const { status } = req.body; // 'accepted' or 'rejected'
			const issue = await Issue.findById(req.params.id);

			if (!issue) {
				return res.status(404).json({ error: "Issue not found" });
			}

			if (issue.status !== "pending") {
				return res
					.status(400)
					.json({ error: "Issue has already been reviewed" });
			}

			issue.status = status;

			if (status === "accepted") {
				await User.findByIdAndUpdate(issue.submittedBy, {
					$inc: { credits: 10 },
				});

				// Create credit transaction record if model exists
				try {
					await CreditTransaction.create({
						user: issue.submittedBy,
						amount: 10,
						type: "earn",
						reference: issue._id,
						description: "Issue acceptance reward",
					});
				} catch (err) {
					console.log(
						"CreditTransaction model not found, skipping transaction record"
					);
				}

				issue.creditsAwarded = 10;
			}

			issue.reviewedBy = req.admin.id;
			issue.updatedAt = new Date();
			await issue.save();

			await issue.populate("submittedBy", "name email");

			res.json({
				success: true,
				issue,
			});
		} catch (err) {
			next(err);
		}
	}
);

// Get my issues (protected)
router.get("/mine", auth, async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const issues = await Issue.find({ submittedBy: req.user.id })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Issue.countDocuments({ submittedBy: req.user.id });

		res.json({
			success: true,
			issues,
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
