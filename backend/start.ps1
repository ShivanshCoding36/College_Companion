#!/usr/bin/env pwsh
# AI Attendance Advisor Backend - Startup Script

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   AI ATTENDANCE ADVISOR - BACKEND STARTUP CHECK   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if we're in the backend directory
if (!(Test-Path ".\server.js")) {
    Write-Host "❌ Error: server.js not found" -ForegroundColor Red
    Write-Host "   Please run this script from the backend directory" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Running pre-flight checks..." -ForegroundColor Cyan

# Check 1: Node.js
Write-Host "`n[1/5] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check 2: Dependencies
Write-Host "`n[2/5] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path ".\node_modules")) {
    Write-Host "   ⚠️  Dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Dependencies already installed" -ForegroundColor Green
}

# Check 3: .env file
Write-Host "`n[3/5] Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".\.env")) {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    Write-Host "   Please create .env file with required variables" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
}

# Check 4: Firebase Service Account
Write-Host "`n[4/5] Checking Firebase credentials..." -ForegroundColor Yellow
if (!(Test-Path ".\firebase-admin-sdk.json")) {
    Write-Host "   ❌ firebase-admin-sdk.json not found" -ForegroundColor Red
    Write-Host "`n   ⚠️  CRITICAL: Firebase credentials missing!" -ForegroundColor Yellow
    Write-Host "   Please download from Firebase Console:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://console.firebase.google.com" -ForegroundColor Cyan
    Write-Host "   2. Select your project" -ForegroundColor Cyan
    Write-Host "   3. Project Settings → Service Accounts" -ForegroundColor Cyan
    Write-Host "   4. Click 'Generate New Private Key'" -ForegroundColor Cyan
    Write-Host "   5. Save as 'firebase-admin-sdk.json' in the backend folder`n" -ForegroundColor Cyan
    
    $continue = Read-Host "   Continue without Firebase? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
    Write-Host "   ⚠️  WARNING: Server will fail without Firebase credentials" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Firebase credentials found" -ForegroundColor Green
}

# Check 5: Port availability
Write-Host "`n[5/5] Checking port availability..." -ForegroundColor Yellow
$port = 5000
$portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "   ⚠️  Port $port is already in use" -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "   Used by: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
    }
    
    $kill = Read-Host "   Kill the process and continue? (y/N)"
    if ($kill -eq "y" -or $kill -eq "Y") {
        Stop-Process -Id $portInUse.OwningProcess -Force
        Write-Host "   ✅ Process terminated" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Change PORT in .env file to use a different port" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Port $port is available" -ForegroundColor Green
}

# All checks passed
Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           PRE-FLIGHT CHECKS COMPLETE ✅            ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🚀 Starting AI Attendance Advisor Backend...`n" -ForegroundColor Cyan

# Start the server
npm run dev
