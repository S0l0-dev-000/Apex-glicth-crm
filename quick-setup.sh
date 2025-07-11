#!/bin/bash

echo "🚀 APEX GLITCH CRM - Quick Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔑 Create Admin Account:"
echo "cd backend && node create-admin.js admin@yourcompany.com yourpassword123"
echo ""
echo "🚀 Start the application:"
echo "Terminal 1: cd backend && node index.js"
echo "Terminal 2: cd frontend && npm start"
echo ""
echo "📱 Access your app:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo "🔐 Admin Secret Code: lance"
echo ""
echo "Happy CRM managing! 🎉" 