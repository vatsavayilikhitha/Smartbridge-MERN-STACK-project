#!/usr/bin/env bash
# ============================================================
# ShopEZ Render Production Build Script (build.sh)
# ============================================================

# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== 📦 STEP 1: Building React Frontend ==="
cd client
npm install
npm run build
cd ..

echo "=== 🔌 STEP 2: Installing Server Dependencies ==="
cd server
npm install
cd ..

echo "=== ✅ STEP 3: Build Complete! ==="
