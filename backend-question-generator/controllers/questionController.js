import QuestionHistory from '../models/questionHistory.js';
import Note from '../models/Note.js';
import { generateQuestionsWithGroq } from '../services/groqService.js';

/**
 * @desc    Generate questions using AI and save to database
 * @route   POST /api/questions/generate
 * @access  Public
 */
export const generateQuestions = async (req, res) => {
  try {
    const { syllabus, questionType } = req.body;

    // Validation
    if (!syllabus || !questionType) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both syllabus and questionType'
      });
    }

    // Validate syllabus length
    if (syllabus.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Syllabus must be at least 10 characters long'
      });
    }

    // Validate question type
    const validTypes = [
      'mcq',
      'short-answer',
      'long-answer',
      'true-false',
      'fill-in-blank',
      'case-study',
      'numerical',
      'conceptual',
      'mixed'
    ];

    if (!validTypes.includes(questionType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid question type. Valid types: ${validTypes.join(', ')}`
      });
    }

    console.log(`📝 Generating ${questionType} questions for syllabus (${syllabus.length} chars)...`);

    // Call Groq AI service to generate questions
    let generatedQuestions;
    try {
      const result = await generateQuestionsWithGroq(syllabus, questionType);
      generatedQuestions = result.questions;
    } catch (groqError) {
      console.error('Groq API failed:', groqError.message);
      return res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable. Please try again later.',
        details: groqError.message
      });
    }

    // Validate generated questions
    if (!generatedQuestions || generatedQuestions.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate questions. Please try again.'
      });
    }

    // Save to MongoDB
    const questionRecord = await QuestionHistory.create({
      syllabus,
      questionType,
      generatedQuestions
    });

    console.log(`✅ Questions saved to MongoDB with ID: ${questionRecord._id}`);

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        id: questionRecord._id,
        questionType: questionRecord.questionType,
        questions: questionRecord.generatedQuestions,
        questionCount: questionRecord.generatedQuestions.length,
        createdAt: questionRecord.createdAt
      },
      message: 'Questions generated and saved successfully'
    });

  } catch (error) {
    console.error('❌ Generate Questions Error:', error.message);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An error occurred while generating questions',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all question generation history
 * @route   GET /api/questions/history
 * @access  Public
 */
export const getHistory = async (req, res) => {
  try {
    const { limit = 50, page = 1, questionType } = req.query;

    // Build query
    const query = {};
    if (questionType) {
      query.questionType = questionType;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch from database
    const history = await QuestionHistory.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(parseInt(limit))
      .skip(skip)
      .lean(); // Convert to plain JavaScript objects

    // Get total count for pagination
    const total = await QuestionHistory.countDocuments(query);

    console.log(`📚 Retrieved ${history.length} question history records`);

    res.status(200).json({
      success: true,
      count: history.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: history
    });

  } catch (error) {
    console.error('❌ Get History Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching history',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get a single question record by ID
 * @route   GET /api/questions/:id
 * @access  Public
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await QuestionHistory.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('❌ Get Question By ID Error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching the question',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a question record
 * @route   DELETE /api/questions/:id
 * @access  Public
 */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await QuestionHistory.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question record not found'
      });
    }

    console.log(`🗑️  Deleted question record: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Question record deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Question Error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the question',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Save questions as notes
 * @route   POST /api/questions/saveNotes
 * @access  Public
 */
export const saveNotes = async (req, res) => {
  try {
    const { userId, title, content, questions, questionType, syllabus } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Note title is required'
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Questions array is required and must not be empty'
      });
    }

    // Create formatted content if not provided
    const noteContent = content || questions.join('\n\n');

    // Save to MongoDB notes collection
    const note = await Note.create({
      userId,
      title: title.trim(),
      content: noteContent,
      questions,
      questionType: questionType || 'mixed',
      syllabus
    });

    console.log(`📝 Note saved for user ${userId}: ${note._id}`);

    res.status(201).json({
      success: true,
      data: {
        id: note._id,
        title: note.title,
        questionCount: note.questions.length,
        createdAt: note.createdAt
      },
      message: 'Questions saved as notes successfully'
    });

  } catch (error) {
    console.error('❌ Save Notes Error:', error.message);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'An error occurred while saving notes',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get user's notes
 * @route   GET /api/questions/notes/:userId
 * @access  Public
 */
export const getUserNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Note.countDocuments({ userId });

    console.log(`📚 Retrieved ${notes.length} notes for user ${userId}`);

    res.status(200).json({
      success: true,
      count: notes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: notes
    });

  } catch (error) {
    console.error('❌ Get User Notes Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching notes',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  generateQuestions,
  getHistory,
  getQuestionById,
  deleteQuestion,
  saveNotes,
  getUserNotes
};
