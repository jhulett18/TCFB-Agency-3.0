@echo off
REM TCFB Agency 3.0 Build Script for Windows
REM This script builds the React app for production deployment

echo 🚀 Starting TCFB Agency 3.0 Build Process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

REM Check for required environment variables
if "%REACT_APP_GOOGLE_MAPS_API_KEY%"=="" (
    echo ⚠️  Warning: REACT_APP_GOOGLE_MAPS_API_KEY is not set
    echo    The app will show an error message if the API key is missing
)

REM Clean previous build
if exist "build" (
    echo 🧹 Cleaning previous build...
    rmdir /s /q build
)

REM Run linting
echo 🔍 Running linting checks...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  Linting issues found. Consider running 'npm run lint:fix'
)

REM Build the application
echo 🔨 Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Check build output
if exist "build" (
    echo ✅ Build completed successfully!
    echo 📁 Build files are in the 'build' directory
    
    echo.
    echo 🚀 Ready for deployment!
    echo    You can deploy the 'build' folder to:
    echo    - Netlify
    echo    - Vercel
    echo    - GitHub Pages
    echo    - AWS S3
    echo    - Any static hosting service
) else (
    echo ❌ Build directory not found
    pause
    exit /b 1
)

pause 