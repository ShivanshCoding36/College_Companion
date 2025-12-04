/**
 * Test Script for Attendance Advisor AI System
 * Tests all core functions and API endpoints
 */

import fetch from 'node-fetch';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`${CYAN}╔═══════════════════════════════════════════════════╗${RESET}`);
console.log(`${CYAN}║   ATTENDANCE ADVISOR AI - SYSTEM TEST           ║${RESET}`);
console.log(`${CYAN}╚═══════════════════════════════════════════════════╝${RESET}\n`);

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  console.log(`${CYAN}[1/4] Testing Health Check Endpoint...${RESET}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${GREEN}✅ Health check passed${RESET}`);
      console.log(`   Status: ${data.message}\n`);
      return true;
    } else {
      console.log(`${RED}❌ Health check failed${RESET}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${RED}❌ Server not running: ${error.message}${RESET}`);
    console.log(`   Start backend with: cd backend && npm run dev\n`);
    return false;
  }
}

/**
 * Test 2: Chat Without File
 */
async function testChatWithoutFile() {
  console.log(`${CYAN}[2/4] Testing Chat Endpoint (No File)...${RESET}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'What is my current attendance status?',
        context: {
          attendancePercentage: 85,
          totalClasses: 100,
          attendedClasses: 85
        }
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${GREEN}✅ Chat without file works${RESET}`);
      console.log(`   Response: ${data.response.substring(0, 100)}...`);
      console.log(`   Has file: ${data.metadata.hasFile}\n`);
      return true;
    } else {
      console.log(`${RED}❌ Chat failed: ${data.error}${RESET}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${RED}❌ Chat error: ${error.message}${RESET}\n`);
    return false;
  }
}

/**
 * Test 3: Text Extraction Functions
 */
async function testTextExtraction() {
  console.log(`${CYAN}[3/4] Testing Text Extraction Functions...${RESET}`);
  
  // Create a sample CSV file for testing
  const sampleCSV = `Date,Subject,Status
2025-11-01,Math,Present
2025-11-02,Physics,Present
2025-11-03,Chemistry,Absent
2025-11-04,Math,Present`;
  
  const tempFile = './test-attendance.csv';
  fs.writeFileSync(tempFile, sampleCSV);
  
  try {
    const formData = new FormData();
    const fileBlob = new Blob([sampleCSV], { type: 'text/csv' });
    formData.append('file', fileBlob, 'attendance.csv');
    
    const response = await fetch(`${BASE_URL}/api/ai-attendance/extract`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${GREEN}✅ Text extraction works${RESET}`);
      console.log(`   Extracted ${data.textLength} characters`);
      console.log(`   File: ${data.filename}\n`);
      fs.unlinkSync(tempFile);
      return true;
    } else {
      console.log(`${RED}❌ Extraction failed: ${data.error}${RESET}\n`);
      fs.unlinkSync(tempFile);
      return false;
    }
  } catch (error) {
    console.log(`${RED}❌ Extraction error: ${error.message}${RESET}\n`);
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    return false;
  }
}

/**
 * Test 4: Groq API Integration
 */
async function testGroqIntegration() {
  console.log(`${CYAN}[4/4] Testing Groq API Integration...${RESET}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'Can I take leave tomorrow if my attendance is 78%?',
        context: {
          attendancePercentage: 78,
          totalClasses: 100,
          attendedClasses: 78,
          requiredPercentage: 75
        }
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${GREEN}✅ Groq API integration works${RESET}`);
      console.log(`   Generated ${data.response.length} characters`);
      console.log(`   Response preview: ${data.response.substring(0, 150)}...\n`);
      return true;
    } else {
      console.log(`${RED}❌ Groq API failed: ${data.error}${RESET}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${RED}❌ Groq error: ${error.message}${RESET}\n`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  const results = {
    healthCheck: false,
    chatNoFile: false,
    textExtraction: false,
    groqIntegration: false
  };
  
  results.healthCheck = await testHealthCheck();
  
  if (!results.healthCheck) {
    console.log(`${RED}⚠️  Backend not running. Start it first!${RESET}`);
    process.exit(1);
  }
  
  results.chatNoFile = await testChatWithoutFile();
  results.textExtraction = await testTextExtraction();
  results.groqIntegration = await testGroqIntegration();
  
  // Summary
  console.log(`${CYAN}╔═══════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║              TEST SUMMARY                        ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════╝${RESET}\n`);
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? GREEN : RED;
    console.log(`${icon} ${color}${test}${RESET}`);
  });
  
  console.log(`\nTotal: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log(`${GREEN}\n🎉 All systems operational! Attendance Advisor AI is ready.${RESET}`);
  } else {
    console.log(`${RED}\n⚠️  Some tests failed. Check errors above.${RESET}`);
  }
}

runTests().catch(console.error);
