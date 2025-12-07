import { generateJSONCompletion } from '../services/groqService.js';
import SurvivalPlan from '../models/SurvivalPlan.js';

/**
 * @route   POST /api/survival/generate
 * @desc    Generate survival plan based on user inputs
 * @access  Protected
 * 
 * Request body:
 * {
 *   userId: string,
 *   skills: string[],
 *   stressLevel: number (1-10),
 *   timeAvailable: number (hours per day),
 *   examDates: string[],
 *   goals: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   plan: { weeks: [...], tips: [...] }
 * }
 */
export const generateSurvivalPlan = async (req, res) => {
  try {
    const { userId, skills, stressLevel, timeAvailable, examDates, goals } = req.body;

    // Validation
    if (!userId || !skills || !stressLevel || !timeAvailable || !examDates || !goals) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId, skills, stressLevel, timeAvailable, examDates, and goals are required',
      });
    }

    // Build prompt for Groq
    const systemPrompt = `You are an expert academic advisor specializing in exam preparation strategies. Create personalized survival plans that are realistic and achievable.

Rules:
1. Generate a structured weekly study plan
2. Consider the user's stress level and available time
3. Break down study sessions into manageable chunks
4. Include breaks and self-care activities
5. Return valid JSON format with weeks array and tips array`;

    const userPrompt = `Create a survival plan with these details:

Skills/Subjects: ${skills.join(', ')}
Stress Level: ${stressLevel}/10
Available Study Time: ${timeAvailable} hours per day
Exam Dates: ${examDates.join(', ')}
Goals: ${goals}

Return a JSON object in this format:
{
  "weeks": [
    {
      "weekNumber": 1,
      "topics": ["Topic 1", "Topic 2"],
      "dailySchedule": [
        {
          "day": "Monday",
          "tasks": ["Task 1", "Task 2"],
          "duration": "2 hours"
        }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    // Call Groq API
    const plan = await generateJSONCompletion(systemPrompt, userPrompt, {
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Save to database
    const survivalPlan = new SurvivalPlan({
      userId,
      skills,
      stressLevel,
      timeAvailable,
      examDates,
      goals,
      plan,
    });

    await survivalPlan.save();

    res.json({
      success: true,
      plan,
      planId: survivalPlan._id,
    });
  } catch (error) {
    console.error('❌ Generate survival plan error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate survival plan',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/survival/history?userId=xxx
 * @desc    Get user's survival plan history
 * @access  Protected
 */
export const getSurvivalPlanHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const plans = await SurvivalPlan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    res.json({
      success: true,
      plans,
      count: plans.length,
    });
  } catch (error) {
    console.error('❌ Get survival plan history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  generateSurvivalPlan,
  getSurvivalPlanHistory,
};
