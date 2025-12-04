# Start Main Backend (Port 5000)
Write-Host "🚀 Starting Main Backend on Port 5000..." -ForegroundColor Cyan
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
