# Profile Module API Testing Script
# Replace YOUR_FIREBASE_TOKEN with actual Firebase ID token

$TOKEN = "YOUR_FIREBASE_TOKEN"
$BASE_URL = "http://localhost:5000"

Write-Host "🧪 Profile Module API Tests" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

# Test 1: Get Profile (Auto-create)
Write-Host "Test 1: GET /api/profile/me (Auto-create if not exists)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/profile/me" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
        }
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Update Profile
Write-Host "Test 2: PUT /api/profile/update" -ForegroundColor Yellow
try {
    $updateData = @{
        name = "Test User"
        phone = "+1234567890"
        department = "Computer Science"
        year = "3rd Year"
        section = "A"
        registerNumber = "CS20001"
        semester = 5
        subjects = @(
            @{
                subjectName = "Data Structures"
                staffName = "Dr. Smith"
                credits = 4
            },
            @{
                subjectName = "Algorithms"
                staffName = "Prof. Johnson"
                credits = 3
            }
        )
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/api/profile/update" `
        -Method PUT `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $updateData
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Update Settings
Write-Host "Test 3: PUT /api/profile/settings" -ForegroundColor Yellow
try {
    $settingsData = @{
        darkMode = $true
        notifications = @{
            essentialAlerts = $true
            studyReminders = $false
            timetableChanges = $true
        }
        language = "hi"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/api/profile/settings" `
        -Method PUT `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $settingsData
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Upload Avatar (Manual test - requires file)
Write-Host "Test 4: POST /api/profile/avatar" -ForegroundColor Yellow
Write-Host "⚠️  Manual test required - use Postman or browser for file upload" -ForegroundColor Magenta
Write-Host "   Endpoint: POST $BASE_URL/api/profile/avatar" -ForegroundColor Gray
Write-Host "   Header: Authorization: Bearer YOUR_TOKEN" -ForegroundColor Gray
Write-Host "   Body: Form-data with 'avatar' field containing image file" -ForegroundColor Gray
Write-Host ""

# Test 5: Get Profile Again (Verify updates)
Write-Host "Test 5: GET /api/profile/me (Verify updates)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/profile/me" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
        }
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "`n============================`n" -ForegroundColor Cyan
Write-Host "📋 Test Summary:" -ForegroundColor Cyan
Write-Host "1. Get Profile: Auto-creates if not exists" -ForegroundColor White
Write-Host "2. Update Profile: Updates all fields" -ForegroundColor White
Write-Host "3. Update Settings: Persists user preferences" -ForegroundColor White
Write-Host "4. Upload Avatar: Manual test with image file" -ForegroundColor White
Write-Host "5. Verify Updates: Confirms persistence" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To get Firebase token:" -ForegroundColor Yellow
Write-Host "   1. Login to your app" -ForegroundColor Gray
Write-Host "   2. Open browser console" -ForegroundColor Gray
Write-Host "   3. Run: firebase.auth().currentUser.getIdToken().then(t => console.log(t))" -ForegroundColor Gray
Write-Host "   4. Copy the token and replace YOUR_FIREBASE_TOKEN in this script" -ForegroundColor Gray
