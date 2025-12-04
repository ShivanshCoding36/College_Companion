# Complete Startup Script for MERN Project
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  🚀 MERN PROJECT - COMPLETE STARTUP" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot

# Function to start a process in a new window
function Start-InNewWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "powershell.exe"
    $psi.Arguments = "-NoExit -Command `"& { Set-Location '$WorkingDirectory'; $Command }`""
    $psi.UseShellExecute = $true
    $psi.CreateNoWindow = $false
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    $process.Start() | Out-Null
    
    Write-Host "✅ $Title started" -ForegroundColor Green
}

# 1. Start Main Backend (Port 5000)
Write-Host "📡 Starting Main Backend (Port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "backend"
Start-InNewWindow -Title "Main Backend (5000)" -Command "node server.js" -WorkingDirectory $backendPath
Start-Sleep -Seconds 2

# 2. Start Question Generator Backend (Port 5001)
Write-Host "📡 Starting Question Generator Backend (Port 5001)..." -ForegroundColor Yellow
$questionBackendPath = Join-Path $projectRoot "backend-question-generator"
Start-InNewWindow -Title "Question Backend (5001)" -Command "node server.js" -WorkingDirectory $questionBackendPath
Start-Sleep -Seconds 2

# 3. Start Frontend (Vite)
Write-Host "🎨 Starting Frontend (Vite Dev Server)..." -ForegroundColor Yellow
Start-InNewWindow -Title "Frontend (Vite)" -Command "npm run dev" -WorkingDirectory $projectRoot
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Green
Write-Host "  ✅ ALL SERVICES STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Green
Write-Host ""
Write-Host "📍 Main Backend:       http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Question Backend:   http://localhost:5001" -ForegroundColor Cyan
Write-Host "📍 Frontend:           http://localhost:5173 (check terminal for exact port)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔍 Available Endpoints:" -ForegroundColor Yellow
Write-Host "   - POST /api/essentials/extract (Main Backend)" -ForegroundColor White
Write-Host "   - GET  /api/users/:id (Main Backend)" -ForegroundColor White
Write-Host "   - POST /api/users (Main Backend)" -ForegroundColor White
Write-Host "   - POST /api/questions/generate (Question Backend)" -ForegroundColor White
Write-Host ""
Write-Host "📝 MongoDB Atlas Connection:" -ForegroundColor Yellow
Write-Host "   mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop this script (servers will continue running)" -ForegroundColor Gray
Write-Host ""

# Keep script running
while ($true) {
    Start-Sleep -Seconds 10
}
