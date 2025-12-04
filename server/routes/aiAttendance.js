import express from 'express';
import multer from 'multer';
import { handleAIChat, healthCheck } from '../controllers/aiAttendanceController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedExtensions = /\.(pdf|jpg|jpeg|png|txt|csv|xlsx|xls)$/i;

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and text files are allowed.'));
    }
  }
});

/**
 * POST /api/ai-attendance/chat
 * Handle AI chat with optional file upload
 * 
 * Body: { message: string, context?: object }
 * File: Optional file upload (PDF, image, text)
 */
router.post('/chat', upload.single('file'), handleAIChat);

/**
 * GET /api/ai-attendance/health
 * Health check endpoint
 */
router.get('/health', healthCheck);

export default router;
