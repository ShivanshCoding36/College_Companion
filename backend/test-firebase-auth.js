/**
 * Test Firebase Authentication Middleware
 * 
 * This script tests the complete Firebase auth flow:
 * 1. Creates a test user in Firebase
 * 2. Gets ID token
 * 3. Tests protected endpoints with the token
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// IMPORTANT: Replace this with an actual Firebase ID token from your frontend
// To get a token:
// 1. Login to your app
// 2. In browser console: firebase.auth().currentUser.getIdToken().then(token => console.log(token))
const FIREBASE_ID_TOKEN = 'YOUR_FIREBASE_ID_TOKEN_HERE';

async function testEndpoints() {
  console.log('🧪 Testing Firebase Authentication Flow\n');
  
  try {
    // Test 1: Health check (no auth required)
    console.log('📍 Test 1: Health Check (No Auth)');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');

    // Test 2: Try accessing protected endpoint without token
    console.log('📍 Test 2: Access Protected Endpoint Without Token');
    try {
      await axios.post(`${BASE_URL}/api/users/create`);
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected: 401 Unauthorized');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 3: Create user with Firebase token
    console.log('📍 Test 3: Create User with Firebase Token');
    if (FIREBASE_ID_TOKEN === 'YOUR_FIREBASE_ID_TOKEN_HERE') {
      console.log('⚠️  Skipping - Please provide a real Firebase ID token');
      console.log('   To get token: In browser console after login:');
      console.log('   firebase.auth().currentUser.getIdToken().then(token => console.log(token))');
    } else {
      try {
        const createResponse = await axios.post(
          `${BASE_URL}/api/users/create`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${FIREBASE_ID_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ User created/verified:', createResponse.data.user.profile.email);
        console.log('   User ID:', createResponse.data.user._id);
      } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 4: Get user data
    console.log('📍 Test 4: Get User Data');
    if (FIREBASE_ID_TOKEN === 'YOUR_FIREBASE_ID_TOKEN_HERE') {
      console.log('⚠️  Skipping - Please provide a real Firebase ID token');
    } else {
      try {
        // First decode the token to get UID (in production, this comes from the token)
        const decoded = JSON.parse(Buffer.from(FIREBASE_ID_TOKEN.split('.')[1], 'base64').toString());
        const uid = decoded.uid || decoded.user_id;
        
        const getResponse = await axios.get(
          `${BASE_URL}/api/users/${uid}`,
          {
            headers: {
              'Authorization': `Bearer ${FIREBASE_ID_TOKEN}`
            }
          }
        );
        console.log('✅ User data retrieved:');
        console.log('   Email:', getResponse.data.user.profile.email);
        console.log('   Notes:', getResponse.data.user.notes.length);
        console.log('   Questions:', getResponse.data.user.questionHistory.length);
      } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 5: Test AI endpoint (Questions Generator)
    console.log('📍 Test 5: Generate Questions with Auth');
    if (FIREBASE_ID_TOKEN === 'YOUR_FIREBASE_ID_TOKEN_HERE') {
      console.log('⚠️  Skipping - Please provide a real Firebase ID token');
    } else {
      try {
        const questionsResponse = await axios.post(
          `${BASE_URL}/api/questions/generate`,
          {
            syllabus: 'Arrays and Linked Lists in Data Structures',
            questionType: 'MCQ'
          },
          {
            headers: {
              'Authorization': `Bearer ${FIREBASE_ID_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Questions generated:', questionsResponse.data.questions.length);
        console.log('   Saved to:', questionsResponse.data.savedTo);
        console.log('   Sample question:', questionsResponse.data.questions[0].question.substring(0, 60) + '...');
      } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    console.log('✅ All tests completed!\n');
    
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

// Run tests
testEndpoints();
