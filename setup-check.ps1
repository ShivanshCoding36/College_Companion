# Environment Setup Helper
# Run this to validate your environment configuration

Write-Host "`n🔧 Environment Setup Validator`n" -ForegroundColor Cyan

# Check if .env file exists
$envPath = ".\backend\.env"
if (-Not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found in backend directory" -ForegroundColor Red
    Write-Host "   Create one by copying .env.example:" -ForegroundColor Yellow
    Write-Host "   cp backend\.env.example backend\.env" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Load and check environment variables
$envContent = Get-Content $envPath -Raw
$requiredVars = @(
    "MONGO_URI",
    "GROQ_API_KEY",
    "PPLX_API_KEY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if ($envContent -notmatch "$var=.+") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "`n⚠️  Missing or empty required environment variables:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host "`nPlease update your .env file with actual values.`n" -ForegroundColor Yellow
} else {
    Write-Host "✅ All required environment variables are set`n" -ForegroundColor Green
}

# Check Firebase configuration
if ($envContent -match "FIREBASE_SERVICE_ACCOUNT_PATH" -or $envContent -match "FIREBASE_PROJECT_ID") {
    Write-Host "✅ Firebase configuration detected" -ForegroundColor Green
} else {
    Write-Host "⚠️  Firebase configuration not found" -ForegroundColor Yellow
    Write-Host "   Add either FIREBASE_SERVICE_ACCOUNT_PATH or individual Firebase env vars" -ForegroundColor Gray
}

# Check if node_modules exists
if (-Not (Test-Path ".\backend\node_modules")) {
    Write-Host "`n⚠️  Backend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd backend && npm install" -ForegroundColor Gray
} else {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

# Check uploads directory
$uploadsPath = ".\backend\uploads\temp"
if (-Not (Test-Path $uploadsPath)) {
    Write-Host "`n⚠️  Uploads directory missing, creating it..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $uploadsPath -Force | Out-Null
    Write-Host "✅ Uploads directory created" -ForegroundColor Green
} else {
    Write-Host "✅ Uploads directory exists" -ForegroundColor Green
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your actual API keys" -ForegroundColor White
Write-Host "2. Install dependencies: cd backend && npm install" -ForegroundColor White
Write-Host "3. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "4. Start frontend: npm run dev" -ForegroundColor White
Write-Host "5. Test API: .\backend\test-api.ps1`n" -ForegroundColor White

Write-Host "📚 For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "   SEMESTER_MODULE_README.md`n" -ForegroundColor Gray
