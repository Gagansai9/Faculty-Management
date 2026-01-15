@echo off
echo ===================================================
echo   FACULTY PORTAL - PRODUCTION DEPLOYMENT SCRIPT
echo ===================================================

echo 1. Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo 2. Installing Frontend Dependencies...
cd frontend
call npm install

echo 3. Building React Frontend...
call npm run build
cd ..

echo 4. Starting Production Server...
echo    Access App at: http://localhost:5000
echo    (Press Ctrl+C to stop)
cd backend
set NODE_ENV=production
node server.js
pause
