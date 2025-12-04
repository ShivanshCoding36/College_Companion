import express from 'express';
import { getUserData } from '../services/firebase/index.js';
import { generateGroqResponse } from '../services/groq/index.js';

const router = express.Router();

/**
 * POST /api/ai-attendance/query
 * Ask AI Attendance Advisor a question
 */
router.post('/query', async (req, res) => {
  try {
    const { userId, query } = req.body;

    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'query must be a non-empty string'
      });
    }

    console.log(`💬 AI query from user: ${userId}`);
    console.log(`❓ Question: "${query}"`);

    // Step 1: Fetch all user data from Firestore
    const userData = await getUserData(userId);

    // Check if user has any data
    if (!userData.calendarData && !userData.timetableData) {
      return res.status(404).json({
        error: 'No data found for this user',
        message: 'Please upload your academic calendar and timetable first'
      });
    }

    // Step 2: Generate AI response using Groq
    const aiResponse = await generateGroqResponse(userData, query);

    res.json({
      success: true,
      response: aiResponse,
      userData: {
        hasCalendar: !!userData.calendarData,
        hasTimetable: !!userData.timetableData,
        hasAttendanceStats: !!userData.attendanceStats
      }
    });

  } catch (error) {
    console.error('❌ Query error:', error.message);
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message
    });
  }
});

export default router;
