import express from 'express';
import { generate, getHistory, saveNotes } from '../controllers/survivalPlanController.js';

const router = express.Router();

// POST /api/survival-plan/generate
router.post('/generate', generate);

// GET /api/survival-plan/history
router.get('/history', getHistory);

// POST /api/survival-plan/saveNotes
router.post('/saveNotes', saveNotes);

export default router;
