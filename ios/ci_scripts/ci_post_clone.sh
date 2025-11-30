#!/bin/sh

# Xcode Cloud Post-Clone Script
# This script runs after the repository is cloned

set -e

echo "📦 Installing Node.js dependencies..."
cd ../..
npm ci

echo "🔨 Building web app..."
npm run build

echo "🔄 Syncing Capacitor..."
npx cap sync ios

echo "✅ Post-clone script completed!"
