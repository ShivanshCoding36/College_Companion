import express from 'express';
import { extractEssentials, getEssentialsHistory } from '../controllers/essentialsController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// POST /api/essentials/extract - Extract essentials from file
router.post('/extract', verifyFirebaseToken, upload.single('file'), extractEssentials);

// GET /api/essentials/history - Get user's essentials history
router.get('/history', verifyFirebaseToken, getEssentialsHistory);

export default router;
