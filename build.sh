#!/bin/bash
# Vercel Build Command - Install dependencies and build
# No build step needed for Express + static files

echo "✅ Vercel deployment ready"
echo "Dependencies: $(ls node_modules | wc -l) packages installed"
