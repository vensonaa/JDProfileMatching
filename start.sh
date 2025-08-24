#!/bin/bash

echo "🚀 Starting JD Profile Matching Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from example..."
    cp backend/env.example backend/.env
    echo "📝 Please edit backend/.env and add your Groq API key"
    echo "   You can get a free API key from: https://console.groq.com/"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Start backend server
echo "🔧 Starting backend server..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Start frontend server
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 Application is starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
