const { body, validationResult } = require("express-validator");

// Validation error handler
const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			error: "Validation failed",
			details: errors.array(),
		});
	}
	next();
};

// User registration validation
const validateUserRegistration = [
	body("name")
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be between 2 and 50 characters"),
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	handleValidationErrors,
];

// User login validation
const validateUserLogin = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password").notEmpty().withMessage("Password is required"),
	handleValidationErrors,
];

// Issue submission validation
const validateIssueSubmission = [
	body("title")
		.trim()
		.isLength({ min: 5, max: 100 })
		.withMessage("Title must be between 5 and 100 characters"),
	body("description")
		.trim()
		.isLength({ min: 10, max: 1000 })
		.withMessage("Description must be between 10 and 1000 characters"),
	body("category")
		.optional()
		.trim()
		.isLength({ max: 50 })
		.withMessage("Category must be less than 50 characters"),
	body("location.address")
		.optional()
		.trim()
		.isLength({ max: 200 })
		.withMessage("Address must be less than 200 characters"),
	handleValidationErrors,
];

// Issue review validation
const validateIssueReview = [
	body("status")
		.isIn(["accepted", "rejected"])
		.withMessage("Status must be either accepted or rejected"),
	handleValidationErrors,
];

// Course creation validation
const validateCourseCreation = [
	body("title")
		.trim()
		.isLength({ min: 5, max: 100 })
		.withMessage("Title must be between 5 and 100 characters"),
	body("description")
		.trim()
		.isLength({ min: 10, max: 500 })
		.withMessage("Description must be between 10 and 500 characters"),
	body("price")
		.isInt({ min: 1 })
		.withMessage("Price must be a positive integer"),
	handleValidationErrors,
];

// Credit redemption validation
const validateCreditRedemption = [
	body("credits")
		.isInt({ min: 1 })
		.withMessage("Credits must be a positive integer"),
	body("payoutMethod")
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage("Payout method must be between 2 and 50 characters"),
	handleValidationErrors,
];

module.exports = {
	validateUserRegistration,
	validateUserLogin,
	validateIssueSubmission,
	validateIssueReview,
	validateCourseCreation,
	validateCreditRedemption,
	handleValidationErrors,
};
