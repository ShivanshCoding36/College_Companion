# Firebase Authentication Test Script
# Tests all protected endpoints with Firebase token

Write-Host "`n=== Firebase Authentication Testing ===`n" -ForegroundColor Cyan

$BASE_URL = "http://localhost:5000"

# Step 1: Check if backend is running
Write-Host "1. Checking backend status..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    Write-Host "   ✅ Backend is running" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Backend is not running" -ForegroundColor Red
    Write-Host "   Please start backend: cd backend; npm start" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Step 2: Test without token (should fail)
Write-Host "2. Testing endpoint WITHOUT token (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/users/create" -Method Post -ContentType "application/json"
    Write-Host "   ❌ Should have failed but succeeded" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✅ Correctly rejected: 401 Unauthorized" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Step 3: Get Firebase token from user
Write-Host "3. Firebase Token Required" -ForegroundColor Yellow
Write-Host "   To test with authentication, you need a Firebase ID token." -ForegroundColor Gray
Write-Host ""
Write-Host "   HOW TO GET TOKEN:" -ForegroundColor Cyan
Write-Host "   1. Open your app in browser (http://localhost:5173)" -ForegroundColor Gray
Write-Host "   2. Login with your credentials" -ForegroundColor Gray
Write-Host "   3. Open browser console (F12)" -ForegroundColor Gray
Write-Host "   4. Run this command:" -ForegroundColor Gray
Write-Host "      firebase.auth().currentUser.getIdToken().then(t => console.log(t))" -ForegroundColor White
Write-Host "   5. Copy the long token string" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "   Paste your Firebase ID token here (or press Enter to skip)"

if ($token -and $token.Length -gt 50) {
    Write-Host ""
    Write-Host "4. Testing with Firebase token..." -ForegroundColor Yellow
    
    # Test user creation
    Write-Host "   Testing: POST /api/users/create" -ForegroundColor Gray
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        $userResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/create" -Method Post -Headers $headers
        Write-Host "   ✅ User created/verified" -ForegroundColor Green
        Write-Host "   User ID: $($userResponse.user._id)" -ForegroundColor Gray
        Write-Host "   Email: $($userResponse.user.profile.email)" -ForegroundColor Gray
        
        $uid = $userResponse.user._id
        
        # Test getting user data
        Write-Host ""
        Write-Host "   Testing: GET /api/users/$uid" -ForegroundColor Gray
        $getUserResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/$uid" -Method Get -Headers $headers
        Write-Host "   ✅ User data retrieved" -ForegroundColor Green
        Write-Host "   Notes: $($getUserResponse.user.notes.Count)" -ForegroundColor Gray
        Write-Host "   Question History: $($getUserResponse.user.questionHistory.Count)" -ForegroundColor Gray
        
        # Test question generation
        Write-Host ""
        Write-Host "   Testing: POST /api/questions/generate" -ForegroundColor Gray
        $questionBody = @{
            syllabus = "Arrays and Linked Lists"
            questionType = "MCQ"
        } | ConvertTo-Json
        
        $questionResponse = Invoke-RestMethod -Uri "$BASE_URL/api/questions/generate" -Method Post -Headers $headers -Body $questionBody
        Write-Host "   ✅ Questions generated: $($questionResponse.questions.Count)" -ForegroundColor Green
        Write-Host "   Saved to: $($questionResponse.savedTo)" -ForegroundColor Gray
        
        Write-Host ""
        Write-Host "✅ All tests passed! Firebase authentication is working correctly." -ForegroundColor Green
        
    } catch {
        Write-Host "   ❌ Test failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ⚠️  Token not provided. Skipping authenticated tests." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
