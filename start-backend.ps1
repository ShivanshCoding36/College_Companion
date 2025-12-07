# Quick Start Script for Backend
# This script starts the backend server with proper checks

Write-Host "`n🚀 Starting Semester Module Backend...`n" -ForegroundColor Cyan

# Check if .env exists
if (-Not (Test-Path ".\backend\.env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Please create backend\.env from backend\.env.example" -ForegroundColor Yellow
    Write-Host "   Run: .\setup-check.ps1 for more details`n" -ForegroundColor Gray
    exit 1
}

# Check if node_modules exists
if (-Not (Test-Path ".\backend\node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    cd backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed`n" -ForegroundColor Red
        exit 1
    }
    cd ..
}

# Kill any existing node processes on port 5000
Write-Host "🧹 Checking for existing processes..." -ForegroundColor Yellow
$existingProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "⚠️  Port 5000 is in use, attempting to free it..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# Start the backend
Write-Host "`n✅ Starting backend on port 5000...`n" -ForegroundColor Green
cd backend
npm start
