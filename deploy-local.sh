#!/bin/bash

# Local deployment script for testing production build
echo "🚀 Starting local production deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build frontend for production
echo "🏗️  Building frontend..."
cd frontend
npm run build
cd ..

# Copy frontend build to backend public folder
echo "📁 Copying frontend build to backend..."
rm -rf backend/public
cp -r frontend/dist backend/public

# Set production environment
export NODE_ENV=production

# Start the production server
echo "🌟 Starting production server..."
echo "Server will be available at http://localhost:5000"
echo "Press Ctrl+C to stop the server"

cd backend
npm run start:prod