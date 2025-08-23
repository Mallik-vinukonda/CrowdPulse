const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// Standard user authentication middleware
const auth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Fetch user to ensure they still exist
		const user = await User.findById(decoded.id).select("-password");
		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}

		req.user = { id: decoded.id, role: decoded.role || user.role };
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid token" });
	}
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check if it's an admin token
		if (decoded.adminId) {
			const admin = await Admin.findById(decoded.adminId);
			if (!admin) {
				return res.status(401).json({ error: "Admin not found" });
			}
			req.admin = { id: decoded.adminId, email: decoded.email };
			req.isAdmin = true;
		} else {
			return res.status(403).json({ error: "Admin access required" });
		}

		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid admin token" });
	}
};

// Flexible middleware for user or admin
const userOrAdminAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (decoded.adminId) {
			// Admin token
			const admin = await Admin.findById(decoded.adminId);
			if (!admin) {
				return res.status(401).json({ error: "Admin not found" });
			}
			req.admin = { id: decoded.adminId, email: decoded.email };
			req.isAdmin = true;
		} else if (decoded.id) {
			// User token
			const user = await User.findById(decoded.id).select("-password");
			if (!user) {
				return res.status(401).json({ error: "User not found" });
			}
			req.user = { id: decoded.id, role: decoded.role || user.role };
			req.isAdmin = false;
		} else {
			return res.status(401).json({ error: "Invalid token format" });
		}

		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid token" });
	}
};

// Role-based access control
const requireRole = (roles) => {
	return async (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ error: "Authentication required" });
		}

		const userRoles = Array.isArray(roles) ? roles : [roles];
		if (!userRoles.includes(req.user.role)) {
			return res.status(403).json({ error: "Insufficient permissions" });
		}

		next();
	};
};

module.exports = {
	auth,
	adminAuth,
	userOrAdminAuth,
	requireRole,
};
