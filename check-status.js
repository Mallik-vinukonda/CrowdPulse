#!/usr/bin/env node

// CrowdPulse Status Check Script
const fs = require("fs");
const path = require("path");

console.log("🔍 CrowdPulse Application Status Check\n");

// Check if required files exist
const requiredFiles = [
	"backend/.env",
	"frontend/.env",
	"backend/package.json",
	"frontend/package.json",
	"backend/server.js",
	"frontend/src/App.jsx",
];

console.log("📁 Checking required files:");
let allFilesExist = true;

requiredFiles.forEach((file) => {
	if (fs.existsSync(file)) {
		console.log(`✅ ${file}`);
	} else {
		console.log(`❌ ${file} - MISSING`);
		allFilesExist = false;
	}
});

// Check node_modules
console.log("\n📦 Checking dependencies:");
const backendNodeModules = fs.existsSync("backend/node_modules");
const frontendNodeModules = fs.existsSync("frontend/node_modules");

console.log(`${backendNodeModules ? "✅" : "❌"} Backend node_modules`);
console.log(`${frontendNodeModules ? "✅" : "❌"} Frontend node_modules`);

// Check environment variables
if (fs.existsSync("backend/.env")) {
	console.log("\n⚙️  Backend environment variables:");
	const envContent = fs.readFileSync("backend/.env", "utf8");
	const hasMongoUri = envContent.includes("MONGO_URI=");
	const hasJwtSecret = envContent.includes("JWT_SECRET=");
	const hasPort = envContent.includes("PORT=");

	console.log(`${hasMongoUri ? "✅" : "❌"} MONGO_URI`);
	console.log(`${hasJwtSecret ? "✅" : "❌"} JWT_SECRET`);
	console.log(`${hasPort ? "✅" : "❌"} PORT`);
}

if (fs.existsSync("frontend/.env")) {
	console.log("\n⚙️  Frontend environment variables:");
	const envContent = fs.readFileSync("frontend/.env", "utf8");
	const hasApiUrl = envContent.includes("VITE_API_URL=");

	console.log(`${hasApiUrl ? "✅" : "❌"} VITE_API_URL`);
}

// Check uploads directory
console.log("\n📁 Checking uploads directory:");
const uploadsDir = fs.existsSync("backend/uploads");
console.log(`${uploadsDir ? "✅" : "❌"} backend/uploads`);

if (!uploadsDir) {
	console.log("   Creating uploads directory...");
	try {
		fs.mkdirSync("backend/uploads", { recursive: true });
		console.log("   ✅ Created backend/uploads");
	} catch (error) {
		console.log("   ❌ Failed to create uploads directory:", error.message);
	}
}

// Summary
console.log("\n📊 Status Summary:");
if (allFilesExist && backendNodeModules && frontendNodeModules) {
	console.log("🎉 All checks passed! CrowdPulse is ready to run.");
	console.log("\n🚀 To start the application:");
	console.log("1. Backend: cd backend && npm run dev");
	console.log("2. Frontend: cd frontend && npm run dev");
	console.log("\n🌐 Application URLs:");
	console.log("- Frontend: http://localhost:5173");
	console.log("- Backend API: http://localhost:5000");
	console.log("- API Health Check: http://localhost:5000/api/health");
} else {
	console.log(
		"❌ Some issues found. Please fix them before running the application."
	);

	if (!backendNodeModules) {
		console.log("   Run: cd backend && npm install");
	}
	if (!frontendNodeModules) {
		console.log("   Run: cd frontend && npm install");
	}
}
