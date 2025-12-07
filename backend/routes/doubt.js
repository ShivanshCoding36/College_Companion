import express from 'express';
import { askDoubt, getDoubtHistory } from '../controllers/doubtController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/ask', verifyFirebaseToken, askDoubt);
router.get('/history', verifyFirebaseToken, getDoubtHistory);

export default router;
