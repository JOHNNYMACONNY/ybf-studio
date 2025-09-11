#!/bin/bash

# YBF Studio Environment Validation Script
# This script validates that all required components are properly configured

echo "🔍 YBF Studio Environment Validation"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variable
check_env_var() {
    if [ -n "${!1}" ]; then
        echo -e "✅ $1: OK"
        return 0
    else
        echo -e "${RED}❌ $1: MISSING${NC}"
        return 1
    fi
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "✅ $1: OK"
        return 0
    else
        echo -e "${RED}❌ $1: MISSING${NC}"
        return 1
    fi
}

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "✅ Port $1: IN USE"
        return 0
    else
        echo -e "${YELLOW}⚠️  Port $1: NOT IN USE${NC}"
        return 1
    fi
}

echo ""
echo "📁 File System Checks"
echo "---------------------"

errors=0

# Check for required files
check_file "package.json" || ((errors++))
check_file ".env.local" || ((errors++))
check_file "next.config.js" || ((errors++))
check_file "tailwind.config.js" || ((errors++))
check_file "tsconfig.json" || ((errors++))

echo ""
echo "🔧 Environment Variables"
echo "------------------------"

# Check for required environment variables
check_env_var "NEXTAUTH_SECRET" || ((errors++))
check_env_var "NEXTAUTH_URL" || ((errors++))
check_env_var "NEXT_PUBLIC_SUPABASE_URL" || ((errors++))
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" || ((errors++))
check_env_var "SUPABASE_SERVICE_ROLE_KEY" || ((errors++))
check_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" || ((errors++))
check_env_var "STRIPE_SECRET_KEY" || ((errors++))
check_env_var "STRIPE_WEBHOOK_SECRET" || ((errors++))
check_env_var "SENDGRID_API_KEY" || ((errors++))

echo ""
echo "📦 Dependencies"
echo "---------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "✅ node_modules: OK"
else
    echo -e "${RED}❌ node_modules: MISSING (run 'npm install')${NC}"
    ((errors++))
fi

# Check if package-lock.json exists
check_file "package-lock.json" || ((errors++))

echo ""
echo "🌐 Network & Services"
echo "--------------------"

# Check if development server is running
check_port "3000" || echo -e "${YELLOW}⚠️  Development server not running (run 'npm run dev')${NC}"

# Check if Stripe CLI is installed
if command_exists stripe; then
    echo -e "✅ Stripe CLI: INSTALLED"
else
    echo -e "${YELLOW}⚠️  Stripe CLI: NOT INSTALLED${NC}"
    echo -e "   Install with: brew install stripe/stripe-cli/stripe"
fi

# Check if Git is available
if command_exists git; then
    echo -e "✅ Git: AVAILABLE"
    # Check if we're in a git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "✅ Git Repository: INITIALIZED"
        # Check current branch
        current_branch=$(git branch --show-current)
        echo -e "✅ Current Branch: $current_branch"
    else
        echo -e "${RED}❌ Git Repository: NOT INITIALIZED${NC}"
        ((errors++))
    fi
else
    echo -e "${RED}❌ Git: NOT AVAILABLE${NC}"
    ((errors++))
fi

echo ""
echo "📚 Documentation"
echo "----------------"

# Check for key documentation files
check_file "docs/README.md" || ((errors++))
check_file "docs/roadmap.md" || ((errors++))
check_file "docs/current_issues.md" || ((errors++))
check_file "docs/implementation_templates.md" || ((errors++))
check_file "docs/debugging_guide.md" || ((errors++))
check_file "docs/go_live_checklist.md" || ((errors++))

echo ""
echo "🎯 Summary"
echo "----------"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your environment is ready for development.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start development server: npm run dev"
    echo "2. Open http://localhost:3000"
    echo "3. Begin implementing critical fixes using the templates"
    echo "4. Follow the Go Live Checklist for implementation"
    exit 0
else
    echo -e "${RED}❌ Found $errors issue(s) that need to be resolved.${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Run 'npm install' to install dependencies"
    echo "2. Copy .env.example to .env.local and fill in your API keys"
    echo "3. Run 'npm run dev' to start the development server"
    echo "4. Install Stripe CLI: brew install stripe/stripe-cli/stripe"
    echo ""
    echo "For detailed setup instructions, see docs/environment_setup.md"
    exit 1
fi 