/**
 * Backend Test Script
 * Tests all AI Attendance Advisor endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000';
const TEST_USER_ID = 'test_user_' + Date.now();

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

async function testHealthCheck() {
  log('\n📊 Testing Health Check...', CYAN);
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      log('✅ Health check passed', GREEN);
      log(`   Status: ${data.status}`, GREEN);
      return true;
    } else {
      log('❌ Health check failed', RED);
      return false;
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, RED);
    log('   Make sure the server is running: npm run dev', YELLOW);
    return false;
  }
}

async function testCalendarUpload() {
  log('\n📅 Testing Calendar Upload...', CYAN);
  log(`   Using userId: ${TEST_USER_ID}`, CYAN);
  
  // Create sample calendar text
  const sampleCalendar = `
ACADEMIC CALENDAR 2024-2025

Semester Start: January 8, 2024
Semester End: May 20, 2024

Working Days: Monday, Tuesday, Wednesday, Thursday, Friday

Holidays:
- January 26, 2024: Republic Day
- March 8, 2024: Holi
- April 11, 2024: Eid
- May 1, 2024: Labor Day

Special Events:
- February 14, 2024: Sports Day
- March 20, 2024: Cultural Fest

Exam Dates:
- May 10, 2024: Mathematics Exam
- May 13, 2024: Physics Exam
- May 16, 2024: Chemistry Exam
  `;

  try {
    // Create a blob to simulate file upload
    const formData = new FormData();
    formData.append('userId', TEST_USER_ID);
    
    // Create a simple text file (simulating uploaded content)
    const blob = new Blob([sampleCalendar], { type: 'text/plain' });
    formData.append('file', blob, 'calendar.txt');

    const response = await fetch(`${BASE_URL}/api/ai-attendance/upload/calendar`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✅ Calendar upload successful', GREEN);
      log('   Data extracted:', GREEN);
      log(`   - Holidays: ${data.data?.holidays?.length || 0}`, GREEN);
      log(`   - Working Days: ${data.data?.workingDays?.length || 0}`, GREEN);
      return true;
    } else {
      log('❌ Calendar upload failed', RED);
      log(`   Error: ${data.error || data.message}`, RED);
      return false;
    }
  } catch (error) {
    log(`❌ Calendar upload error: ${error.message}`, RED);
    return false;
  }
}

async function testTimetableUpload() {
  log('\n📚 Testing Timetable Upload...', CYAN);
  log(`   Using userId: ${TEST_USER_ID}`, CYAN);
  
  const sampleTimetable = `
WEEKLY TIMETABLE

Monday:
09:00-10:30 Mathematics
11:00-12:30 Physics
14:00-15:30 Chemistry

Tuesday:
09:00-10:30 Computer Science
11:00-12:30 English
14:00-15:30 Mathematics

Wednesday:
09:00-10:30 Physics
11:00-12:30 Chemistry
14:00-15:30 Computer Science

Thursday:
09:00-10:30 Mathematics
11:00-12:30 English
14:00-15:30 Physics

Friday:
09:00-10:30 Chemistry
11:00-12:30 Computer Science
14:00-15:30 Mathematics
  `;

  try {
    const formData = new FormData();
    formData.append('userId', TEST_USER_ID);
    
    const blob = new Blob([sampleTimetable], { type: 'text/plain' });
    formData.append('file', blob, 'timetable.txt');

    const response = await fetch(`${BASE_URL}/api/ai-attendance/upload/timetable`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✅ Timetable upload successful', GREEN);
      log('   Data extracted:', GREEN);
      const schedule = data.data?.weeklySchedule || {};
      log(`   - Days configured: ${Object.keys(schedule).length}`, GREEN);
      return true;
    } else {
      log('❌ Timetable upload failed', RED);
      log(`   Error: ${data.error || data.message}`, RED);
      return false;
    }
  } catch (error) {
    log(`❌ Timetable upload error: ${error.message}`, RED);
    return false;
  }
}

async function testAIQuery(query) {
  log(`\n💬 Testing AI Query: "${query}"`, CYAN);
  log(`   Using userId: ${TEST_USER_ID}`, CYAN);
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: TEST_USER_ID,
        query: query
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✅ AI query successful', GREEN);
      log('   Response:', GREEN);
      log(`   ${data.response}`, RESET);
      log('   Data availability:', GREEN);
      log(`   - Calendar: ${data.userData.hasCalendar ? '✓' : '✗'}`, GREEN);
      log(`   - Timetable: ${data.userData.hasTimetable ? '✓' : '✗'}`, GREEN);
      log(`   - Attendance Stats: ${data.userData.hasAttendanceStats ? '✓' : '✗'}`, GREEN);
      return true;
    } else {
      log('❌ AI query failed', RED);
      log(`   Error: ${data.error || data.message}`, RED);
      return false;
    }
  } catch (error) {
    log(`❌ AI query error: ${error.message}`, RED);
    return false;
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════', CYAN);
  log('   AI ATTENDANCE ADVISOR - BACKEND TESTS', CYAN);
  log('═══════════════════════════════════════════════════', CYAN);
  
  const results = {
    healthCheck: false,
    calendarUpload: false,
    timetableUpload: false,
    aiQuery: false
  };

  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();
  
  if (!results.healthCheck) {
    log('\n❌ Server is not running. Please start it with: npm run dev', RED);
    log('   Then run this test script again.', YELLOW);
    process.exit(1);
  }

  // Test 2: Calendar Upload
  results.calendarUpload = await testCalendarUpload();
  
  // Test 3: Timetable Upload
  results.timetableUpload = await testTimetableUpload();
  
  // Test 4: AI Query (only if uploads succeeded)
  if (results.calendarUpload && results.timetableUpload) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for Firestore
    results.aiQuery = await testAIQuery("What classes do I have on Monday?");
  } else {
    log('\n⚠️  Skipping AI query test (uploads failed)', YELLOW);
  }

  // Summary
  log('\n═══════════════════════════════════════════════════', CYAN);
  log('   TEST SUMMARY', CYAN);
  log('═══════════════════════════════════════════════════', CYAN);
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? GREEN : RED;
    const testName = test.replace(/([A-Z])/g, ' $1').trim();
    log(`${icon} ${testName}`, color);
  });
  
  log(`\nTotal: ${passed}/${total} tests passed`, passed === total ? GREEN : YELLOW);
  
  if (passed === total) {
    log('\n🎉 All tests passed! Backend is working correctly.', GREEN);
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.', YELLOW);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test runner error: ${error.message}`, RED);
  process.exit(1);
});
