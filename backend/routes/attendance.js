import express from 'express';
import { queryAttendanceAdvisor, getAttendanceHistory } from '../controllers/attendanceController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/attendance/query - Query attendance advisor
router.post('/query', verifyFirebaseToken, queryAttendanceAdvisor);

// GET /api/attendance/history - Get attendance query history
router.get('/history', verifyFirebaseToken, getAttendanceHistory);

export default router;
