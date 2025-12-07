/**
 * Comprehensive API Routes - All Endpoints with Firebase Auth
 */

import express from 'express';
import multer from 'multer';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { createUser, getUser, updateSection } from '../controllers/usersController.js';
import {
  generateQuestions,
  generateSurvivalPlan,
  attendanceQuery,
  extractEssentials,
  generateRevisionPlan,
  askDoubt,
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from '../controllers/aiControllers.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// ==================== USER ROUTES ====================
router.post('/users/create', verifyFirebaseToken, createUser);
router.get('/users/:uid', verifyFirebaseToken, getUser);
router.put('/users/:uid/updateSection', verifyFirebaseToken, updateSection);

// ==================== QUESTIONS ====================
router.post('/questions/generate', verifyFirebaseToken, generateQuestions);

// ==================== SURVIVAL PLAN ====================
router.post('/survival/generate', verifyFirebaseToken, generateSurvivalPlan);

// ==================== ATTENDANCE ====================
router.post('/attendance/query', verifyFirebaseToken, attendanceQuery);

// ==================== ESSENTIALS EXTRACTOR ====================
router.post('/essentials/extract', verifyFirebaseToken, upload.single('file'), extractEssentials);

// ==================== REVISION ====================
router.post('/revision/generate', verifyFirebaseToken, generateRevisionPlan);

// ==================== DOUBT SOLVER ====================
router.post('/doubt/ask', verifyFirebaseToken, askDoubt);

// ==================== NOTES CRUD ====================
router.post('/notes', verifyFirebaseToken, createNote);
router.get('/notes', verifyFirebaseToken, getNotes);
router.put('/notes/:id', verifyFirebaseToken, updateNote);
router.delete('/notes/:id', verifyFirebaseToken, deleteNote);

export default router;
