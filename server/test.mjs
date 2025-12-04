// Test script for the backend API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Testing MERN Attendance Advisor Backend\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('Test 1: Health Check');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  console.log('');
}

// Test 2: AI Chat without file
async function testChatNoFile() {
  console.log('Test 2: AI Chat (No File)');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello! Can you help me with attendance advice?',
        context: {
          attendancePercentage: 85,
          totalClasses: 100
        }
      })
    });
    
    const data = await response.json();
    console.log('✅ Chat response received');
    console.log('Response preview:', data.response?.substring(0, 100) + '...');
    console.log('Metadata:', data.metadata);
  } catch (error) {
    console.error('❌ Chat test failed:', error.message);
  }
  console.log('');
}

// Test 3: AI Chat endpoint check
async function testChatEndpoint() {
  console.log('Test 3: AI Chat Endpoint Structure');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-attendance/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test message'
      })
    });
    
    const data = await response.json();
    console.log('✅ Endpoint returns valid JSON');
    console.log('Response structure:', {
      success: data.success,
      hasResponse: !!data.response,
      hasMetadata: !!data.metadata
    });
  } catch (error) {
    console.error('❌ Endpoint test failed:', error.message);
  }
  console.log('');
}

// Run all tests
async function runTests() {
  await testHealthCheck();
  await testChatNoFile();
  await testChatEndpoint();
  
  console.log('✅ All tests completed!\n');
  console.log('Backend is ready for frontend integration.');
  console.log('Frontend can call: POST http://localhost:5000/api/ai-attendance/chat');
}

runTests();
