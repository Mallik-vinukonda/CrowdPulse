require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		error: "Too many requests from this IP, please try again later.",
	},
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: {
		error: "Too many authentication attempts, please try again later.",
	},
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const corsOptions = {
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Import routes
const userRoutes = require("./routes/user");
const issueRoutes = require("./routes/issue");
const creditRoutes = require("./routes/credit");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");
const resourceRoutes = require("./routes/resource");

// Apply auth rate limiting to sensitive routes
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);
app.use("/api/admin/login", authLimiter);

// API routes
app.use("/api/user", userRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
	});
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
	res.status(404).json({ error: "API endpoint not found" });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "public")));

	// Handle React routing, return all requests to React app
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "public", "index.html"));
	});
}

// Error handler middleware (should be the last middleware)
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server (database connection is handled in connectDB)
app.listen(PORT, () => {
	console.log(
		`Server running on port ${PORT} in ${
			process.env.NODE_ENV || "development"
		} mode`
	);
});
