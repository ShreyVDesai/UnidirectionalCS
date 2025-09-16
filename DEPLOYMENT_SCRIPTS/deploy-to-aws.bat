@echo off
REM Windows batch script for AWS deployment preparation
REM This script prepares your local environment for AWS deployment

echo 🚀 Preparing for AWS Deployment...
echo.

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI not found. Please install it first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    pause
    exit /b 1
)

echo ✅ AWS CLI found
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install it first:
    echo    https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install it first:
    echo    https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Create deployment package
echo 📦 Creating deployment package...
if not exist "deployment-package" mkdir deployment-package

REM Copy necessary files
echo 📁 Copying application files...
xcopy /E /I /Y "backend" "deployment-package\backend"
xcopy /E /I /Y "frontend" "deployment-package\frontend"
copy "README.md" "deployment-package\"
copy "AWS_DEPLOYMENT_GUIDE.md" "deployment-package\"
copy "QUICK_DEPLOYMENT_CHECKLIST.md" "deployment-package\"

REM Create production package.json for backend
echo 📝 Creating production package.json...
(
echo {
echo   "name": "unidirectional-comm-backend",
echo   "version": "1.0.0",
echo   "description": "POC backend for unidirectional comm system (TypeScript)",
echo   "main": "dist/index.js",
echo   "scripts": {
echo     "build": "tsc",
echo     "start": "node dist/index.js",
echo     "postinstall": "npm run build"
echo   },
echo   "dependencies": {
echo     "bcryptjs": "^2.4.3",
echo     "cors": "^2.8.5",
echo     "dotenv": "^16.0.0",
echo     "express": "^4.18.2",
echo     "jsonwebtoken": "^9.0.0",
echo     "mongoose": "^7.0.0",
echo     "node-cron": "^3.0.2",
echo     "nodemailer": "^6.9.7"
echo   }
echo }
) > "deployment-package\backend\package.json"

REM Create production package.json for frontend
echo 📝 Creating production package.json for frontend...
(
echo {
echo   "name": "unidirectional-comm-frontend",
echo   "version": "1.0.0",
echo   "private": true,
echo   "dependencies": {
echo     "@emotion/react": "^11.11.1",
echo     "@emotion/styled": "^11.11.0",
echo     "@mui/icons-material": "^5.14.19",
echo     "@mui/material": "^5.14.20",
echo     "@testing-library/jest-dom": "^5.17.0",
echo     "@testing-library/react": "^13.4.0",
echo     "@testing-library/user-event": "^13.5.0",
echo     "@types/jest": "^27.5.2",
echo     "@types/node": "^16.18.68",
echo     "@types/react": "^18.2.42",
echo     "@types/react-dom": "^18.2.17",
echo     "axios": "^1.6.2",
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "react-router-dom": "^6.20.1",
echo     "react-scripts": "5.0.1",
echo     "typescript": "^4.9.5",
echo     "web-vitals": "^2.1.4"
echo   },
echo   "scripts": {
echo     "start": "react-scripts start",
echo     "build": "react-scripts build",
echo     "test": "react-scripts test",
echo     "eject": "react-scripts eject"
echo   },
echo   "eslintConfig": {
echo     "extends": [
echo       "react-app",
echo       "react-app/jest"
echo     ]
echo   },
echo   "browserslist": {
echo     "production": [
echo       ">0.2%%",
echo       "not dead",
echo       "not op_mini all"
echo     ],
echo     "development": [
echo       "last 1 chrome version",
echo       "last 1 firefox version",
echo       "last 1 safari version"
echo     ]
echo   }
echo }
) > "deployment-package\frontend\package.json"

REM Create environment template
echo 📝 Creating environment template...
(
echo # Production Environment Variables
echo # Copy this to .env in the backend directory on your EC2 instance
echo.
echo MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/unidirectional-comm
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo.
echo # Gmail SMTP Configuration (for Nodemailer)
echo GMAIL_USER=your-gmail@gmail.com
echo GMAIL_APP_PASSWORD=your-gmail-app-password
echo.
echo PORT=3000
echo NODE_ENV=production
echo.
echo # Gmail Setup Instructions:
echo # 1. Enable 2-Factor Authentication on your Gmail account
echo # 2. Generate an App Password:
echo #    - Go to Google Account > Security > App passwords
echo #    - Select 'Mail' and generate password
echo #    - Use this password in GMAIL_APP_PASSWORD
) > "deployment-package\backend\.env.template"

REM Create deployment instructions
echo 📝 Creating deployment instructions...
(
echo # AWS Deployment Instructions
echo.
echo ## Quick Start
echo 1. Upload the deployment-package folder to your EC2 instance
echo 2. Follow the AWS_DEPLOYMENT_GUIDE.md for detailed steps
echo 3. Use the QUICK_DEPLOYMENT_CHECKLIST.md for a step-by-step checklist
echo.
echo ## Files in this package:
echo - backend/ - Backend application
echo - frontend/ - Frontend application  
echo - AWS_DEPLOYMENT_GUIDE.md - Detailed deployment guide
echo - QUICK_DEPLOYMENT_CHECKLIST.md - Step-by-step checklist
echo - backend/.env.template - Environment variables template
echo.
echo ## Next Steps:
echo 1. Launch EC2 instance (Ubuntu 22.04 LTS, t3.micro)
echo 2. Connect via SSH
echo 3. Run the setup-server.sh script
echo 4. Upload this deployment package
echo 5. Configure environment variables
echo 6. Deploy the application
echo.
echo ## Cost Estimate: $2-3 for a week-long demo
) > "deployment-package\DEPLOYMENT_INSTRUCTIONS.md"

echo.
echo ✅ Deployment package created successfully!
echo.
echo 📁 Package location: deployment-package\
echo.
echo 📋 Next steps:
echo 1. Launch an EC2 instance (Ubuntu 22.04 LTS, t3.micro)
echo 2. Connect via SSH
echo 3. Upload the deployment-package folder to your EC2 instance
echo 4. Follow the AWS_DEPLOYMENT_GUIDE.md for detailed deployment steps
echo.
echo 💰 Estimated cost: $2-3 for a week-long demo
echo.
echo 🎉 Ready for deployment!
pause
