import express from 'express';
import multer from 'multer';
import { parseFile } from '../utils/parsers/index.js';
import { extractStructuredData } from '../services/groq/index.js';
import { saveParsedData } from '../services/firebase/index.js';
import { CALENDAR_EXTRACTION_PROMPT, TIMETABLE_EXTRACTION_PROMPT } from '../utils/prompts.js';

const router = express.Router();

// Configure multer for file uploads
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
      'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.match(/\.(pdf|xlsx|xls|csv)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel, and CSV files are allowed.'));
    }
  }
});

/**
 * POST /api/ai-attendance/upload/calendar
 * Upload academic calendar (PDF, Excel, or CSV)
 */
router.post('/upload/calendar', upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    console.log(`📤 Processing calendar upload for user: ${userId}`);
    console.log(`📄 File: ${req.file.originalname} (${req.file.mimetype})`);

    // Step 1: Parse file to text
    const extractedText = await parseFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    // Step 2: Extract structured data using Groq
    const structuredData = await extractStructuredData(
      extractedText,
      CALENDAR_EXTRACTION_PROMPT
    );

    // Step 3: Save to Firestore
    await saveParsedData(userId, 'calendarData', structuredData);

    res.json({
      success: true,
      message: 'Academic calendar uploaded and processed successfully',
      data: structuredData
    });

  } catch (error) {
    console.error('❌ Calendar upload error:', error.message);
    res.status(500).json({
      error: 'Failed to process calendar',
      message: error.message
    });
  }
});

/**
 * POST /api/ai-attendance/upload/timetable
 * Upload weekly timetable (PDF, Excel, or CSV)
 */
router.post('/upload/timetable', upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    console.log(`📤 Processing timetable upload for user: ${userId}`);
    console.log(`📄 File: ${req.file.originalname} (${req.file.mimetype})`);

    // Step 1: Parse file to text
    const extractedText = await parseFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    // Step 2: Extract structured data using Groq
    const structuredData = await extractStructuredData(
      extractedText,
      TIMETABLE_EXTRACTION_PROMPT
    );

    // Step 3: Save to Firestore
    await saveParsedData(userId, 'timetableData', structuredData);

    res.json({
      success: true,
      message: 'Timetable uploaded and processed successfully',
      data: structuredData
    });

  } catch (error) {
    console.error('❌ Timetable upload error:', error.message);
    res.status(500).json({
      error: 'Failed to process timetable',
      message: error.message
    });
  }
});

export default router;
