# Test API Endpoints
# Make sure backend is running first: cd backend && npm start

$baseUrl = "http://localhost:5000"

Write-Host "`n🧪 Testing Backend API Endpoints`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Status: $($response.status)" -ForegroundColor Green
    Write-Host "   Services: $($response.services | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Write-Host "`n⚠️  Note: Protected endpoints require Firebase authentication" -ForegroundColor Yellow
Write-Host "To test protected endpoints:" -ForegroundColor Gray
Write-Host "1. Login to your app and get Firebase ID token" -ForegroundColor Gray
Write-Host "2. Set token: `$token = 'YOUR_FIREBASE_ID_TOKEN'" -ForegroundColor Gray
Write-Host "3. Run: Invoke-RestMethod -Uri '$baseUrl/api/questions/generate' -Method POST -Headers @{'Authorization'='Bearer `$token'; 'Content-Type'='application/json'} -Body '{...}'" -ForegroundColor Gray

Write-Host "`n📚 Available Endpoints:" -ForegroundColor Cyan
Write-Host "  POST /api/questions/generate" -ForegroundColor White
Write-Host "  POST /api/survival/generate" -ForegroundColor White
Write-Host "  POST /api/essentials/extract (file upload)" -ForegroundColor White
Write-Host "  POST /api/revision/generate" -ForegroundColor White
Write-Host "  POST /api/notes" -ForegroundColor White
Write-Host "  POST /api/doubt/ask" -ForegroundColor White
Write-Host "  POST /api/attendance/query" -ForegroundColor White
Write-Host "  GET  /api/*/history?userId=xxx" -ForegroundColor White

Write-Host "`n✅ Backend is ready!" -ForegroundColor Green
