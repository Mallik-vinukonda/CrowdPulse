#!/bin/bash

# CrowdPulse Installation Script
echo "🚀 Installing CrowdPulse..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally. Make sure you have a MongoDB connection string ready."
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "⚙️  Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env file. Please edit it with your configuration."
else
    echo "✅ Backend .env file already exists."
fi

cd ../frontend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file."
else
    echo "✅ Frontend .env file already exists."
fi

echo "📁 Creating uploads directory..."
cd ../backend
mkdir -p uploads

echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (if running locally): mongod"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:5000"