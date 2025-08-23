#!/bin/bash

# CrowdPulse Quick Start Script
echo "🚀 Starting CrowdPulse..."

# Check if everything is set up
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Please run ./install.sh first."
    exit 1
fi

if [ ! -d "backend/node_modules" ]; then
    echo "❌ Backend dependencies not installed. Please run ./install.sh first."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Please run ./install.sh first."
    exit 1
fi

echo "✅ All checks passed!"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down CrowdPulse..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 CrowdPulse is starting up!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID