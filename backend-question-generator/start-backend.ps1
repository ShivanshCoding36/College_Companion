# Start Question Generator Backend (Port 5001)
Write-Host "🚀 Starting Question Generator Backend on Port 5001..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the server
Write-Host "✅ Starting server..." -ForegroundColor Green
node server.js
