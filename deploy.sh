#!/bin/bash

echo "🚀 APEX GLITCH CRM - Optimized Deployment Script"
echo "================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command was successful
check_status() {
    if [ $? -ne 0 ]; then
        print_error "$1 failed"
        exit 1
    fi
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm first."
    exit 1
fi
print_success "npm found: $(npm --version)"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    check_status "Vercel CLI installation"
fi
print_success "Vercel CLI found: $(vercel --version)"

# Install dependencies
print_status "Installing backend dependencies..."
cd backend
npm install --production=false
check_status "Backend dependency installation"

print_status "Installing frontend dependencies..."
cd ../frontend
npm install --production=false
check_status "Frontend dependency installation"

# Build frontend with optimizations
print_status "Building optimized frontend..."
npm run build
check_status "Frontend build"

# Check build size
BUILD_SIZE=$(du -sh build/ | cut -f1)
print_success "Frontend build complete - Size: $BUILD_SIZE"

# Deploy backend
print_status "Deploying backend to Vercel..."
cd ../backend
vercel --prod --yes
check_status "Backend deployment"

BACKEND_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*')
print_success "Backend deployed successfully!"
print_status "Backend URL: $BACKEND_URL"

# Deploy frontend
print_status "Deploying frontend to Vercel..."
cd ../frontend
vercel --prod --yes
check_status "Frontend deployment"

FRONTEND_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*')
print_success "Frontend deployed successfully!"
print_status "Frontend URL: $FRONTEND_URL"

cd ..

# Final summary
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "====================="
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL:  $BACKEND_URL"
echo ""
echo "🔧 Next Steps:"
echo "1. Update frontend/src/config.js with your backend URL"
echo "2. Redeploy frontend if URLs changed: cd frontend && vercel --prod"
echo "3. Test email functionality"
echo "4. Create admin account using the web interface"
echo ""
echo "📖 Documentation:"
echo "- README.md - Project overview"
echo "- DEPLOYMENT.md - Detailed deployment guide"
echo "- API_DOCUMENTATION.md - Complete API reference"
echo ""
echo "🔐 Security Features Enabled:"
echo "- Rate limiting (100 requests/15 minutes)"
echo "- Helmet security headers"
echo "- CORS protection"
echo "- Input validation"
echo "- File upload restrictions"
echo ""
echo "⚡ Performance Optimizations:"
echo "- Gzip compression enabled"
echo "- Database indexes created"
echo "- Frontend lazy loading"
echo "- Bundle size optimization"
echo ""
print_success "Happy CRM managing! 🎉" 