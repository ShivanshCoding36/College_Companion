import express from 'express';
import { generateRevisionPlan, getRevisionHistory } from '../controllers/revisionController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', verifyFirebaseToken, generateRevisionPlan);
router.get('/history', verifyFirebaseToken, getRevisionHistory);

export default router;
