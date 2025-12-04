import express from 'express';
import multer from 'multer';
import { 
  initializeGroqClient, 
  extractTextFromFile, 
  generateAnswerFromGroq,
  handleUserQuery 
} from '../services/groq/index.js';

const router = express.Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.match(/\.(pdf|xlsx?|csv|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel, CSV, and TXT files are allowed.'));
    }
  }
});

/**
 * POST /api/ai-attendance/chat
 * Main chat endpoint for attendance queries with file context
 */
router.post('/chat', upload.single('file'), async (req, res) => {
  try {
    const { query, context } = req.body;
    const file = req.file;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    // Parse context if it's a string
    let contextData = {};
    if (context) {
      contextData = typeof context === 'string' ? JSON.parse(context) : context;
    }

    let response;

    // If file is uploaded, use it for context
    if (file) {
      console.log(`📎 Processing file: ${file.originalname}`);
      
      response = await handleUserQuery({
        fileBuffer: file.buffer,
        mimetype: file.mimetype,
        filename: file.originalname,
        userQuery: query,
        contextData: contextData
      });
    } else {
      // No file - use only context data
      const extractedText = `No file uploaded. Using context data only.
      
${contextData.attendancePercentage ? `Current Attendance: ${contextData.attendancePercentage}%` : ''}
${contextData.totalClasses ? `Total Classes: ${contextData.totalClasses}` : ''}
${contextData.attendedClasses ? `Attended: ${contextData.attendedClasses}` : ''}`;

      const answer = await generateAnswerFromGroq(extractedText, query, contextData);
      
      response = {
        success: true,
        answer: answer,
        timestamp: new Date().toISOString()
      };
    }

    if (response.success) {
      res.json({
        success: true,
        response: response.answer,
        metadata: {
          hasFile: !!file,
          filename: file?.originalname,
          extractedTextLength: response.extractedTextLength,
          timestamp: response.timestamp
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: response.error
      });
    }

  } catch (error) {
    console.error('❌ Chat endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat request'
    });
  }
});

/**
 * POST /api/ai-attendance/extract
 * Extract text from uploaded file without generating response
 */
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log(`📄 Extracting text from: ${req.file.originalname}`);

    const extractedText = await extractTextFromFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({
      success: true,
      extractedText: extractedText,
      textLength: extractedText.length,
      filename: req.file.originalname,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    console.error('❌ Extract endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract text from file'
    });
  }
});

/**
 * GET /api/ai-attendance/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Attendance Advisor AI is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
