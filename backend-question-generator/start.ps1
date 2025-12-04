# Start Question Generator Backend

Write-Host "🚀 Starting Question Generator Backend..." -ForegroundColor Green
Write-Host ""

Set-Location C:\Users\Yugendra\mernproj1\backend-question-generator

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "✅ Starting server on port 5000..." -ForegroundColor Green
Write-Host "📍 Health: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "📍 API: http://localhost:5000/api/questions" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

node server.js
