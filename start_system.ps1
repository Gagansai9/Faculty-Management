Write-Host "Starting Faculty Management System..." -ForegroundColor Cyan

# Install and Start Backend
Write-Host "Setting up Backend..." -ForegroundColor Green
cd backend
npm install
# Attempt to seed, but don't fail if mongo is down (it will just error out)
try {
    node scripts/seed.js
} catch {
    Write-Host "Warning: Database seeding failed. Is MongoDB running?" -ForegroundColor Yellow
}
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
cd ..

# Install and Start Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Green
cd frontend
npm install --legacy-peer-deps
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
cd ..

Write-Host "System Initiated. Check the new terminal windows." -ForegroundColor Magenta
