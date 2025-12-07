# Backend Start and Test Script
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Backend Server Startup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the backend directory
if (-not (Test-Path ".\server.js")) {
    Write-Host "Error: server.js not found. Please run this script from the backend directory." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path ".\node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env file exists
if (-not (Test-Path ".\.env")) {
    Write-Host "Warning: .env file not found. Using default values." -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

# Start the server
Write-Host ""
Write-Host "Starting backend server on port 5000..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

node server.js
