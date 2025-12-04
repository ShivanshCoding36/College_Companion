import SurvivalPlan from '../models/SurvivalPlan.js';
import Note from '../models/Note.js';
import { generateSurvivalPlan } from '../services/groqSurvivalPlan.js';

// Generate survival plan using Groq AI
export const generate = async (req, res) => {
  try {
    const { userSkills, stressLevel, timeAvailable, examDates, goals, deadline, userId } = req.body;

    // Validation
    if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) {
      return res.status(400).json({ error: 'userSkills array is required' });
    }
    if (!stressLevel || !['low', 'medium', 'high'].includes(stressLevel)) {
      return res.status(400).json({ error: 'stressLevel must be low, medium, or high' });
    }
    if (!timeAvailable) {
      return res.status(400).json({ error: 'timeAvailable is required' });
    }
    if (!examDates || !Array.isArray(examDates) || examDates.length === 0) {
      return res.status(400).json({ error: 'examDates array is required' });
    }
    if (!goals) {
      return res.status(400).json({ error: 'goals is required' });
    }
    if (!deadline) {
      return res.status(400).json({ error: 'deadline is required' });
    }

    console.log('📝 Generating survival plan...');
    console.log(`   Skills: ${userSkills.join(', ')}`);
    console.log(`   Stress: ${stressLevel}`);
    console.log(`   Time: ${timeAvailable}`);
    console.log(`   Exams: ${examDates.join(', ')}`);
    console.log(`   Goals: ${goals}`);
    console.log(`   Deadline: ${deadline}`);

    // Generate plan using Groq
    const generatedPlan = await generateSurvivalPlan({
      userSkills,
      stressLevel,
      timeAvailable,
      examDates,
      goals,
      deadline,
    });

    // Save to MongoDB
    const survivalPlan = new SurvivalPlan({
      userId: userId || 'anonymous',
      userSkills,
      stressLevel,
      timeAvailable,
      examDates,
      goals,
      deadline,
      generatedPlan,
    });

    await survivalPlan.save();

    console.log('✅ Survival plan generated and saved');

    res.status(200).json({
      success: true,
      plan: generatedPlan,
      savedId: survivalPlan._id,
    });
  } catch (error) {
    console.error('❌ Error generating survival plan:', error.message);
    res.status(500).json({
      error: 'Failed to generate survival plan',
      message: error.message,
    });
  }
};

// Get survival plan history
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = userId ? { userId } : {};
    const plans = await SurvivalPlan.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error('❌ Error fetching history:', error.message);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

// Save survival plan as notes
export const saveNotes = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const note = new Note({
      userId,
      title,
      content,
      type: 'survival-plan',
    });

    await note.save();

    console.log('✅ Survival plan saved as note');

    res.status(200).json({
      success: true,
      message: 'Saved to notes successfully',
      noteId: note._id,
    });
  } catch (error) {
    console.error('❌ Error saving notes:', error.message);
    res.status(500).json({
      error: 'Failed to save notes',
      message: error.message,
    });
  }
};
