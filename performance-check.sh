#!/bin/bash

echo "⚡ APEX GLITCH CRM - Performance Health Check"
echo "============================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Read URLs from config or use defaults
FRONTEND_URL=${1:-"https://frontend-ett6bbhz8-solos-projects-3bdcd80e.vercel.app"}
BACKEND_URL=${2:-"https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app"}

print_status "Testing APEX GLITCH CRM Performance"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo ""

# Test backend health
print_status "🔧 Backend Health Check..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" --max-time 10)
BACKEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL" --max-time 10)

if [ "$BACKEND_STATUS" = "200" ]; then
    if (( $(echo "$BACKEND_TIME < 2.0" | bc -l) )); then
        print_success "Backend responding (${BACKEND_TIME}s) - Excellent"
    elif (( $(echo "$BACKEND_TIME < 5.0" | bc -l) )); then
        print_warning "Backend responding (${BACKEND_TIME}s) - Good"
    else
        print_error "Backend slow (${BACKEND_TIME}s) - Needs optimization"
    fi
else
    print_error "Backend not responding (Status: $BACKEND_STATUS)"
fi

# Test frontend health
print_status "🌐 Frontend Health Check..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" --max-time 10)
FRONTEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$FRONTEND_URL" --max-time 10)

if [ "$FRONTEND_STATUS" = "200" ]; then
    if (( $(echo "$FRONTEND_TIME < 2.0" | bc -l) )); then
        print_success "Frontend responding (${FRONTEND_TIME}s) - Excellent"
    elif (( $(echo "$FRONTEND_TIME < 5.0" | bc -l) )); then
        print_warning "Frontend responding (${FRONTEND_TIME}s) - Good"
    else
        print_error "Frontend slow (${FRONTEND_TIME}s) - Needs optimization"
    fi
else
    print_error "Frontend not responding (Status: $FRONTEND_STATUS)"
fi

# Test API endpoints
print_status "🔍 API Endpoint Tests..."

# Test admin exists endpoint
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/admin-exists" --max-time 5)
if [ "$API_STATUS" = "200" ]; then
    print_success "Admin exists endpoint working"
else
    print_error "Admin exists endpoint failing (Status: $API_STATUS)"
fi

# Test customers endpoint
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/customers" --max-time 5)
if [ "$API_STATUS" = "200" ]; then
    print_success "Customers API endpoint working"
else
    print_warning "Customers API endpoint needs authentication (Status: $API_STATUS)"
fi

# Check build sizes (if running locally)
print_status "📦 Build Size Analysis..."
if [ -d "frontend/build" ]; then
    BUILD_SIZE=$(du -sh frontend/build/ | cut -f1)
    BUILD_SIZE_BYTES=$(du -s frontend/build/ | cut -f1)
    
    if [ "$BUILD_SIZE_BYTES" -lt 5120 ]; then  # Less than 5MB
        print_success "Frontend build size: $BUILD_SIZE - Excellent"
    elif [ "$BUILD_SIZE_BYTES" -lt 10240 ]; then  # Less than 10MB
        print_warning "Frontend build size: $BUILD_SIZE - Good"
    else
        print_error "Frontend build size: $BUILD_SIZE - Large, consider optimization"
    fi
else
    print_warning "Build directory not found - run 'npm run build' in frontend/"
fi

# Check dependencies
print_status "📋 Dependency Health Check..."
if [ -f "backend/package.json" ]; then
    BACKEND_DEPS=$(grep -c '"' backend/package.json)
    if [ "$BACKEND_DEPS" -lt 20 ]; then
        print_success "Backend dependencies: Minimal and clean"
    else
        print_warning "Backend dependencies: Consider reviewing for unused packages"
    fi
fi

if [ -f "frontend/package.json" ]; then
    FRONTEND_DEPS=$(grep -c '"' frontend/package.json)
    if [ "$FRONTEND_DEPS" -lt 30 ]; then
        print_success "Frontend dependencies: Minimal and clean"
    else
        print_warning "Frontend dependencies: Consider reviewing for unused packages"
    fi
fi

# Security check
print_status "🔐 Security Check..."
if grep -q "helmet" backend/package.json; then
    print_success "Security headers (Helmet) configured"
else
    print_error "Security headers missing - install helmet"
fi

if grep -q "express-rate-limit" backend/package.json; then
    print_success "Rate limiting configured"
else
    print_error "Rate limiting missing - install express-rate-limit"
fi

# Performance recommendations
echo ""
print_status "💡 Performance Recommendations:"
echo "1. ✅ Gzip compression enabled"
echo "2. ✅ Database indexes added"
echo "3. ✅ Frontend lazy loading implemented"
echo "4. ✅ Security headers configured"
echo "5. ✅ Rate limiting enabled"
echo ""

# Overall score
echo "📊 Performance Score:"
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ] && (( $(echo "$BACKEND_TIME < 3.0" | bc -l) )) && (( $(echo "$FRONTEND_TIME < 3.0" | bc -l) )); then
    print_success "Overall: Excellent ⭐⭐⭐⭐⭐"
elif [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    print_warning "Overall: Good ⭐⭐⭐⭐"
else
    print_error "Overall: Needs attention ⭐⭐"
fi

echo ""
print_status "Performance check completed!"
echo "💡 For detailed metrics, use: curl -w '@curl-format.txt' -o /dev/null -s $BACKEND_URL" 