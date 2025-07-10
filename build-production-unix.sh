#!/bin/bash

# TCFB Agency 3.0 Build Script
# This script builds the React app for production deployment

echo "🚀 Starting TCFB Agency 3.0 Build Process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Check for required environment variables
if [ -z "$REACT_APP_GOOGLE_MAPS_API_KEY" ]; then
    echo "⚠️  Warning: REACT_APP_GOOGLE_MAPS_API_KEY is not set"
    echo "   The app will show an error message if the API key is missing"
fi

# Clean previous build
if [ -d "build" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf build
fi

# Run linting
echo "🔍 Running linting checks..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. Consider running 'npm run lint:fix'"
fi

# Build the application
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Check build output
if [ -d "build" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'build' directory"
    echo "📊 Build size:"
    du -sh build/*
    
    echo ""
    echo "🚀 Ready for deployment!"
    echo "   You can deploy the 'build' folder to:"
    echo "   - Netlify"
    echo "   - Vercel"
    echo "   - GitHub Pages"
    echo "   - AWS S3"
    echo "   - Any static hosting service"
else
    echo "❌ Build directory not found"
    exit 1
fi 