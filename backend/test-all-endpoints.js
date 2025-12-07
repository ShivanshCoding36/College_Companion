/**
 * Complete Backend API Test Suite
 * Tests all endpoints to verify they work correctly
 * Requires Node.js 18+ (native fetch support)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000';

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, endpoint, body = null, isFormData = false) {
  try {
    log(`\nTesting: ${name}`, 'cyan');
    log(`${method} ${endpoint}`);

    const options = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    };

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.ok) {
      log(`✅ PASS - Status: ${response.status}`, 'green');
      if (typeof data === 'object') {
        log(`Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
      }
      return { success: true, data };
    } else {
      log(`⚠️  WARNING - Status: ${response.status}`, 'yellow');
      log(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, data };
    }
  } catch (error) {
    log(`❌ FAIL - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('='.repeat(60), 'cyan');
  log('Backend API Test Suite', 'cyan');
  log('='.repeat(60), 'cyan');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: Health Check
  const healthTest = await testEndpoint(
    'Health Check',
    'GET',
    '/health'
  );
  healthTest.success ? results.passed++ : results.failed++;

  // Test 2: Create User
  const testUserId = 'test-firebase-uid-' + Date.now();
  const createUserTest = await testEndpoint(
    'Create User',
    'POST',
    '/api/users',
    {
      email: 'test@example.com',
      name: 'Test User',
      firebaseUID: testUserId,
      photoURL: 'https://example.com/photo.jpg'
    }
  );
  createUserTest.success ? results.passed++ : results.failed++;

  // Test 3: Get User by Firebase UID
  if (createUserTest.success) {
    const getUserTest = await testEndpoint(
      'Get User by Firebase UID',
      'GET',
      `/api/users/${testUserId}`
    );
    getUserTest.success ? results.passed++ : results.failed++;

    // Test 4: Save Onboarding Data
    const onboardingTest = await testEndpoint(
      'Save Onboarding Data',
      'POST',
      `/api/users/${testUserId}/onboarding`,
      {
        semester: '5',
        difficultSubject: 'Data Structures',
        studyStyle: 'Solo',
        studyHours: 4,
        hobbies: 'Reading, Coding',
        homeLocation: 'City',
        aiPreference: 'Yes',
        currentGoal: 'Placement prep'
      }
    );
    onboardingTest.success ? results.passed++ : results.failed++;

    // Test 5: Delete User
    const deleteUserTest = await testEndpoint(
      'Delete User',
      'DELETE',
      `/api/users/${testUserId}`
    );
    deleteUserTest.success ? results.passed++ : results.failed++;
  } else {
    results.failed += 3;
    log('⚠️  Skipping user-related tests due to create failure', 'yellow');
  }

  // Test 6: File Upload to Essentials (Mock test without actual file)
  log('\nNote: File upload test requires manual testing with actual files', 'yellow');
  log('POST /api/essentials/extract - Expected to return 400 without file');
  const essentialsTest = await testEndpoint(
    'Essentials Extract (no file)',
    'POST',
    '/api/essentials/extract',
    null
  );
  // This should fail with 400 - that's expected
  if (!essentialsTest.success && essentialsTest.data?.error === 'No file uploaded') {
    log('✅ Endpoint exists and validates correctly', 'green');
    results.passed++;
  } else {
    results.warnings++;
  }

  // Test 7: Survival Plan Generate
  const survivalPlanTest = await testEndpoint(
    'Generate Survival Plan',
    'POST',
    '/api/survival-plan/generate',
    {
      userSkills: ['JavaScript', 'React', 'Node.js'],
      stressLevel: 'medium',
      timeAvailable: '3 hours per day',
      examDates: ['2025-01-15', '2025-01-20'],
      goals: 'Master full-stack development',
      deadline: '2025-02-01',
      userId: 'test-user-123'
    }
  );
  survivalPlanTest.success ? results.passed++ : results.failed++;

  // Test 8: Get Survival Plan History
  const historyTest = await testEndpoint(
    'Get Survival Plan History',
    'GET',
    '/api/survival-plan/history?userId=test-user-123'
  );
  historyTest.success ? results.passed++ : results.failed++;

  // Test 9: AI Attendance Health Check
  const aiHealthTest = await testEndpoint(
    'AI Attendance Health',
    'GET',
    '/api/ai-attendance/health'
  );
  aiHealthTest.success ? results.passed++ : results.failed++;

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('Test Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
  log(`📊 Total: ${results.passed + results.failed + results.warnings}`);

  if (results.failed === 0) {
    log('\n🎉 All tests passed!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the output above.', 'yellow');
  }

  log('\n💡 Manual Testing Required:', 'cyan');
  log('1. Test file upload to /api/essentials/extract with image/PDF');
  log('2. Test Firebase login/register from frontend');
  log('3. Test Semester Essentials component with real file upload');
  log('4. Verify MongoDB data in Compass');
}

// Run tests
log('Starting backend server test...', 'cyan');
log('Make sure server is running on port 5000\n');

setTimeout(() => {
  runTests().catch(console.error);
}, 1000);
