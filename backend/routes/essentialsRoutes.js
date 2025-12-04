import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/essentials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `syllabus-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG), PDFs, and videos (MP4) are allowed'));
    }
  }
});

// POST /api/essentials/extract - Extract syllabus and generate essentials
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    
    console.log(`📄 Processing file: ${req.file.originalname} (${fileType})`);

    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString('base64');

    // Call Perplexity AI API
    const PERPLEXITY_API_KEY = 'pplx-4ASJYIrWRyjGZ4hCtC7YyQglVRoqS9N7ykdvDRdVCgVwXgtvV';
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an academic analyzer bot. Extract the essential topics, sub-topics and exam-important units from syllabus content. Give clean bullet points only.'
          },
          {
            role: 'user',
            content: fileType.includes('pdf') 
              ? `Analyze this PDF syllabus file and extract: 1) Creative/Application Questions topics, 2) Theory Topics for short answers, 3) Numerical Topics with formulas, 4) Topics typically asked for 2 marks, 3 marks, 14 marks, and 16 marks. Return as JSON with keys: creative, theory, numerical, twoMarks, threeMarks, fourteenMarks, sixteenMarks. Each should be an array of strings.`
              : `Analyze this syllabus image and extract: 1) Creative/Application Questions topics, 2) Theory Topics for short answers, 3) Numerical Topics with formulas, 4) Topics typically asked for 2 marks, 3 marks, 14 marks, and 16 marks. Return as JSON with keys: creative, theory, numerical, twoMarks, threeMarks, fourteenMarks, sixteenMarks. Each should be an array of strings.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    console.log('🤖 AI Response received');

    // Parse the AI response
    let essentials;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        essentials = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured data from text response
        essentials = {
          creative: extractBulletPoints(aiResponse, 'creative|application'),
          theory: extractBulletPoints(aiResponse, 'theory|theoretical'),
          numerical: extractBulletPoints(aiResponse, 'numerical|formula|problem'),
          twoMarks: extractBulletPoints(aiResponse, '2 mark'),
          threeMarks: extractBulletPoints(aiResponse, '3 mark'),
          fourteenMarks: extractBulletPoints(aiResponse, '14 mark'),
          sixteenMarks: extractBulletPoints(aiResponse, '16 mark')
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return raw response as fallback
      essentials = {
        creative: [aiResponse],
        theory: [],
        numerical: [],
        twoMarks: [],
        threeMarks: [],
        fourteenMarks: [],
        sixteenMarks: []
      };
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    console.log('✅ File processed and cleaned up');

    res.json({
      success: true,
      essentials: essentials,
      fileName: req.file.originalname
    });

  } catch (error) {
    console.error('❌ Error processing file:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract essentials from file'
    });
  }
});

// Helper function to extract bullet points from text
function extractBulletPoints(text, keyword) {
  const lines = text.split('\n');
  const relevantLines = [];
  let capturing = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes(keyword)) {
      capturing = true;
      continue;
    }
    
    if (capturing) {
      if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*')) {
        relevantLines.push(line.trim().replace(/^[-•*]\s*/, ''));
      } else if (line.trim() === '' || lowerLine.match(/^\d+\.|marks:|topics:/)) {
        capturing = false;
      }
    }
  }

  return relevantLines.length > 0 ? relevantLines : ['No specific topics identified'];
}

export default router;
