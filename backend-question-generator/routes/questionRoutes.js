import express from 'express';
import {
  generateQuestions,
  getHistory,
  getQuestionById,
  deleteQuestion,
  saveNotes,
  getUserNotes
} from '../controllers/questionController.js';

const router = express.Router();

/**
 * @route   POST /api/questions/generate
 * @desc    Generate questions using AI
 * @body    { syllabus: string, questionType: string }
 * @returns { success: true, data: { questions: [...] } }
 */
router.post('/generate', generateQuestions);

/**
 * @route   POST /api/questions/saveNotes
 * @desc    Save generated questions as notes
 * @body    { userId, title, questions, questionType, syllabus }
 * @returns { success: true, message: "..." }
 */
router.post('/saveNotes', saveNotes);

/**
 * @route   GET /api/questions/notes/:userId
 * @desc    Get all notes for a user
 * @returns { success: true, data: [...] }
 */
router.get('/notes/:userId', getUserNotes);

/**
 * @route   GET /api/questions/history
 * @desc    Get all question generation history
 * @query   limit, page, questionType (optional)
 * @returns { success: true, data: [...], total, pages }
 */
router.get('/history', getHistory);

/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question record by ID
 * @returns { success: true, data: {...} }
 */
router.get('/:id', getQuestionById);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question record
 * @returns { success: true, message: "..." }
 */
router.delete('/:id', deleteQuestion);

export default router;
