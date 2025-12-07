import express from 'express';
import { generateQuestions, getQuestionHistory } from '../controllers/questionController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/questions/generate - Generate questions
router.post('/generate', verifyFirebaseToken, generateQuestions);

// GET /api/questions/history - Get user's question history
router.get('/history', verifyFirebaseToken, getQuestionHistory);

export default router;
