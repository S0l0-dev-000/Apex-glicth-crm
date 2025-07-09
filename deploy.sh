#!/bin/bash

echo "🚀 APEX GLITCH CRM Deployment Script"
echo "====================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Building frontend..."
cd frontend
npm run build

echo "🌐 Deploying frontend to Vercel..."
vercel --prod

echo "🔧 Deploying backend to Vercel..."
cd ../backend
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your backend URL from Vercel dashboard"
echo "2. Update frontend/src/config.js with your backend URL"
echo "3. Redeploy frontend: cd frontend && vercel --prod"
echo ""
echo "🌍 Your app will be available at the URLs shown above" 