#!/bin/bash

# Build Verification Script for LIMS SaaS Website
# This script checks for common build issues and provides recommendations

echo "🔧 LIMS SaaS Website - Build Verification"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "ERROR" ]; then
        echo -e "${RED}❌ $message${NC}"
    else
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

echo ""
echo "📦 Checking Dependencies..."

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status "INFO" "Node.js version: $NODE_VERSION"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_status "OK" "Node.js version is compatible (18+)"
    else
        print_status "ERROR" "Node.js version should be 18 or higher"
    fi
else
    print_status "ERROR" "Node.js is not installed"
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "OK" "npm version: $NPM_VERSION"
else
    print_status "ERROR" "npm is not installed"
fi

echo ""
echo "📂 Checking Project Structure..."

# Check if package.json exists
if [ -f "package.json" ]; then
    print_status "OK" "package.json found"
else
    print_status "ERROR" "package.json not found"
    exit 1
fi

# Check if Next.js is installed
if npm list next >/dev/null 2>&1; then
    NEXT_VERSION=$(npm list next --depth=0 2>/dev/null | grep next | head -1 | sed 's/.*next@//')
    print_status "OK" "Next.js version: $NEXT_VERSION"
else
    print_status "ERROR" "Next.js is not installed"
fi

# Check TypeScript
if npm list typescript >/dev/null 2>&1; then
    TS_VERSION=$(npm list typescript --depth=0 2>/dev/null | grep typescript | head -1 | sed 's/.*typescript@//')
    print_status "OK" "TypeScript version: $TS_VERSION"
else
    print_status "WARNING" "TypeScript might not be installed"
fi

echo ""
echo "🧩 Checking Key Dependencies..."

# Check essential packages
ESSENTIAL_PACKAGES=("react" "react-dom" "typescript" "tailwindcss" "postcss" "autoprefixer")

for package in "${ESSENTIAL_PACKAGES[@]}"; do
    if npm list "$package" >/dev/null 2>&1; then
        VERSION=$(npm list "$package" --depth=0 2>/dev/null | grep "$package" | head -1 | sed "s/.*$package@//")
        print_status "OK" "$package: $VERSION"
    else
        print_status "ERROR" "$package is missing"
    fi
done

echo ""
echo "🏗️ Checking Build Configuration..."

# Check TypeScript config
if [ -f "tsconfig.json" ]; then
    print_status "OK" "TypeScript configuration found"
    
    # Check if it has necessary compiler options
    if grep -q '"strict": true' tsconfig.json; then
        print_status "OK" "TypeScript strict mode enabled"
    else
        print_status "WARNING" "TypeScript strict mode not enabled"
    fi
else
    print_status "ERROR" "tsconfig.json not found"
fi

# Check Tailwind config
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    print_status "OK" "Tailwind CSS configuration found"
else
    print_status "WARNING" "Tailwind CSS configuration not found"
fi

# Check Next.js config
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    print_status "OK" "Next.js configuration found"
else
    print_status "WARNING" "Next.js configuration not found"
fi

echo ""
echo "📁 Checking Directory Structure..."

# Check essential directories
ESSENTIAL_DIRS=("app" "components" "lib" "public" "styles")

for dir in "${ESSENTIAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status "OK" "Directory: $dir"
    else
        print_status "WARNING" "Directory: $dir (missing)"
    fi
done

echo ""
echo "🔍 Checking Import Issues..."

# Check for common import issues
if [ -d "components" ]; then
    # Check for missing @ aliases
    IMPORT_ISSUES=0
    
    # Check if any files have incorrect imports
    if find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/[^']*'" | head -5 | grep -q .; then
        print_status "WARNING" "Found files using @ alias imports"
        IMPORT_ISSUES=$((IMPORT_ISSUES + 1))
    fi
    
    # Check for missing file extensions in imports
    if find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '[^']*';" | head -3 | grep -q .; then
        print_status "WARNING" "Check for missing file extensions in imports"
        IMPORT_ISSUES=$((IMPORT_ISSUES + 1))
    fi
    
    if [ $IMPORT_ISSUES -eq 0 ]; then
        print_status "OK" "No obvious import issues detected"
    fi
fi

echo ""
echo "🎨 Checking Styling Setup..."

# Check Tailwind CSS setup
if [ -f "app/globals.css" ] || [ -f "styles/globals.css" ]; then
    if grep -q "@tailwind" app/globals.css 2>/dev/null || grep -q "@tailwind" styles/globals.css 2>/dev/null; then
        print_status "OK" "Tailwind CSS directives found"
    else
        print_status "WARNING" "Tailwind CSS directives not found"
    fi
else
    print_status "WARNING" "Global CSS file not found"
fi

echo ""
echo "🚀 Build Test..."

# Try to run build
if command_exists npm; then
    echo "Running npm install..."
    if npm install --silent; then
        print_status "OK" "Dependencies installed successfully"
    else
        print_status "ERROR" "Failed to install dependencies"
    fi
    
    echo "Running TypeScript check..."
    if npm run type-check >/dev/null 2>&1; then
        print_status "OK" "TypeScript compilation passed"
    else
        print_status "WARNING" "TypeScript compilation has issues"
    fi
    
    echo "Running ESLint check..."
    if npm run lint >/dev/null 2>&1; then
        print_status "OK" "ESLint check passed"
    else
        print_status "WARNING" "ESLint check has issues"
    fi
    
    echo "Attempting build..."
    if npm run build >/dev/null 2>&1; then
        print_status "OK" "Build completed successfully"
    else
        print_status "ERROR" "Build failed"
        echo ""
        echo "Running build with verbose output to see errors:"
        echo "npm run build"
    fi
else
    print_status "ERROR" "npm not available for build test"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo "Build verification completed."
echo ""
echo "Next steps if issues were found:"
echo "1. Install missing dependencies: npm install"
echo "2. Fix TypeScript errors: npm run type-check"
echo "3. Fix linting issues: npm run lint:fix"
echo "4. Update configuration files if needed"
echo "5. Run build again: npm run build"
echo ""
echo -e "${BLUE}For detailed troubleshooting, check the build output above.${NC}"