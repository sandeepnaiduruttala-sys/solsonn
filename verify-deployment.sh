#!/bin/bash
# Pre-deployment verification script for Vercel

echo "╔════════════════════════════════════════════════════════╗"
echo "║      VERCEL DEPLOYMENT PRE-FLIGHT CHECKLIST           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_total=0

check() {
  checks_total=$((checks_total + 1))
  if eval "$1"; then
    echo -e "${GREEN}✅${NC} $2"
    checks_passed=$((checks_passed + 1))
  else
    echo -e "${RED}❌${NC} $2"
  fi
}

echo "📋 Configuration Files:"
check "[ -f 'api/index.js' ]" "api/index.js exists"
check "[ -f 'vercel.json' ]" "vercel.json exists"
check "[ -f '.vercelignore' ]" ".vercelignore exists"
check "[ -f 'package.json' ]" "package.json exists"

echo ""
echo "📂 Directory Structure:"
check "[ -d 'src' ]" "src/ directory exists"
check "[ -d 'public' ]" "public/ directory exists"
check "[ -d 'node_modules' ]" "node_modules/ exists"

echo ""
echo "🔐 Security:"
check "grep -q '^\.env$' .gitignore" ".env is gitignored"
check "[ ! -f 'src/.env' ]" "No .env in src/"

echo ""
echo "📦 Dependencies:"
check "npm list express > /dev/null 2>&1" "express is installed"
check "npm list mongoose > /dev/null 2>&1" "mongoose is installed"
check "npm list dotenv > /dev/null 2>&1" "dotenv is installed"

echo ""
echo "✨ Syntax Validation:"
check "node -c api/index.js > /dev/null 2>&1" "api/index.js syntax OK"
check "node -c src/index.js > /dev/null 2>&1" "src/index.js syntax OK"
check "node -c src/router.js > /dev/null 2>&1" "src/router.js syntax OK"
check "node -c src/middleware.js > /dev/null 2>&1" "src/middleware.js syntax OK"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Results: ${GREEN}$checks_passed${NC}/$checks_total checks passed"
echo "═══════════════════════════════════════════════════════"

if [ $checks_passed -eq $checks_total ]; then
  echo -e "\n${GREEN}✨ All systems ready for Vercel deployment!${NC}\n"
  exit 0
else
  echo -e "\n${RED}⚠️  Some checks failed. Please review above.${NC}\n"
  exit 1
fi
