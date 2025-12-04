# Test Question Generator API

Write-Host "Testing Question Generator Backend API" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Cyan
curl.exe http://localhost:5000/health
Write-Host ""
Write-Host ""

# Test 2: Generate MCQ Questions
Write-Host "Test 2: Generate MCQ Questions" -ForegroundColor Cyan
$json = '{"syllabus":"Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs","questionType":"mcq"}'
curl.exe -X POST http://localhost:5000/api/questions/generate -H "Content-Type: application/json" -d $json
Write-Host ""
Write-Host ""

# Test 3: Get History
Write-Host "Test 3: Get Question History" -ForegroundColor Cyan
curl.exe http://localhost:5000/api/questions/history
Write-Host ""
Write-Host ""

Write-Host "All tests completed!" -ForegroundColor Green
