# Firebase Setup Verification Script
# Checks if Firebase Admin SDK is properly configured

Write-Host "`n=== Firebase Setup Verification ===`n" -ForegroundColor Cyan

$backendPath = "C:\Users\Yugendra\mernproj1\backend"
$firebaseJsonPath = Join-Path $backendPath "firebase-admin-sdk.json"
$envPath = Join-Path $backendPath ".env"

# Check 1: Firebase JSON file
Write-Host "1️⃣ Checking for firebase-admin-sdk.json..." -ForegroundColor Yellow
if (Test-Path $firebaseJsonPath) {
    Write-Host "   ✅ Found: firebase-admin-sdk.json" -ForegroundColor Green
    
    # Validate JSON structure
    try {
        $json = Get-Content $firebaseJsonPath | ConvertFrom-Json
        if ($json.project_id -and $json.private_key -and $json.client_email) {
            Write-Host "   ✅ Valid service account structure" -ForegroundColor Green
            Write-Host "   📦 Project ID: $($json.project_id)" -ForegroundColor Gray
            Write-Host "   📧 Service Email: $($json.client_email)" -ForegroundColor Gray
        } else {
            Write-Host "   ❌ Invalid service account structure" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Invalid JSON format" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Missing: firebase-admin-sdk.json" -ForegroundColor Red
    Write-Host "   📥 Download from: https://console.firebase.google.com/" -ForegroundColor Yellow
    Write-Host "      → Project Settings → Service Accounts → Generate New Private Key" -ForegroundColor Gray
}

Write-Host ""

# Check 2: .env file
Write-Host "2️⃣ Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    # Check FIREBASE_SERVICE_ACCOUNT_PATH
    if ($envContent -match "FIREBASE_SERVICE_ACCOUNT_PATH=(.+)") {
        $path = $matches[1].Trim()
        Write-Host "   ✅ FIREBASE_SERVICE_ACCOUNT_PATH = $path" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  FIREBASE_SERVICE_ACCOUNT_PATH not found in .env" -ForegroundColor Yellow
    }
    
    # Check RTDB_URL
    if ($envContent -match "RTDB_URL=(.+)") {
        $rtdbUrl = $matches[1].Trim()
        if ($rtdbUrl -like "https://*firebaseio.com") {
            Write-Host "   ✅ RTDB_URL = $rtdbUrl" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  RTDB_URL may be invalid: $rtdbUrl" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  RTDB_URL not found in .env" -ForegroundColor Yellow
    }
    
    # Check MongoDB
    if ($envContent -match "MONGO_URI=(.+)") {
        Write-Host "   ✅ MONGO_URI configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MONGO_URI not found" -ForegroundColor Red
    }
    
    # Check Groq
    if ($envContent -match "GROQ_API_KEY=(.+)") {
        Write-Host "   ✅ GROQ_API_KEY configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ GROQ_API_KEY not found" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
}

Write-Host ""

# Check 3: Network connectivity to MongoDB
Write-Host "3️⃣ Checking MongoDB Atlas connectivity..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName "yugen.zbssgmq.mongodb.net" -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "   ✅ MongoDB Atlas reachable" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Cannot reach MongoDB Atlas (may need IP whitelist)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Network check failed (may need IP whitelist)" -ForegroundColor Yellow
}

Write-Host ""

# Check 4: Node.js processes
Write-Host "4️⃣ Checking running Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ⚠️  $($nodeProcesses.Count) Node.js process(es) running" -ForegroundColor Yellow
    Write-Host "   💡 Stop them before restarting: Get-Process -Name node | Stop-Process -Force" -ForegroundColor Gray
} else {
    Write-Host "   ✅ No Node.js processes running (ready to start)" -ForegroundColor Green
}

Write-Host ""

# Summary
Write-Host "📊 Summary & Next Steps`n" -ForegroundColor Cyan

if (Test-Path $firebaseJsonPath) {
    Write-Host "✅ Firebase Admin SDK: READY" -ForegroundColor Green
} else {
    Write-Host "❌ Firebase Admin SDK: MISSING" -ForegroundColor Red
    Write-Host "   → Download from Firebase Console and save as:" -ForegroundColor Yellow
    Write-Host "     $firebaseJsonPath" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 To start backend with Firebase:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray

Write-Host ""
Write-Host "📖 Complete setup guide: FIREBASE_SETUP_COMPLETE.md" -ForegroundColor Cyan
Write-Host ""
