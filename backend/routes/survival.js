import express from 'express';
import { generateSurvivalPlan, getSurvivalPlanHistory } from '../controllers/survivalController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/survival/generate - Generate survival plan
router.post('/generate', verifyFirebaseToken, generateSurvivalPlan);

// GET /api/survival/history - Get user's survival plan history
router.get('/history', verifyFirebaseToken, getSurvivalPlanHistory);

export default router;
