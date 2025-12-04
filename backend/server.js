import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initializeFirebase } from './services/firebase/index.js';
import { initializeGroqClient } from './services/groq/index.js';
import uploadRoutes from './routes/upload.js';
import queryRoutes from './routes/query.js';
import attendanceAIRoutes from './routes/attendanceAI.js';
import survivalPlanRoutes from './routes/survivalPlanRoutes.js';
import essentialsRoutes from './routes/essentialsRoutes.js';
import usersRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
console.log('🚀 Initializing AI Attendance Advisor Backend...\n');

try {
  // Initialize MongoDB
  await connectDB();
  console.log('');

  // Initialize Firebase Admin SDK (optional)
  try {
    initializeFirebase();
    console.log('✅ Firebase Admin SDK initialized\n');
  } catch (firebaseError) {
    console.log('⚠️  Firebase not configured (optional) - Continuing without Firebase\n');
  }

  // Initialize Groq API (required)
  initializeGroqClient();
  console.log('✅ Groq API initialized\n');
} catch (error) {
  console.error('❌ Service initialization failed:', error.message);
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - Allow all localhost origins for development
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production' && origin && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Attendance Advisor Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/ai-attendance', uploadRoutes);
app.use('/api/ai-attendance', queryRoutes);
app.use('/api/ai-attendance', attendanceAIRoutes);
app.use('/api/survival-plan', survivalPlanRoutes);
app.use('/api/essentials', essentialsRoutes);
app.use('/api/users', usersRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /api/ai-attendance/upload/calendar',
      'POST /api/ai-attendance/upload/timetable',
      'POST /api/ai-attendance/query',
      'POST /api/ai-attendance/chat',
      'POST /api/ai-attendance/extract',
      'GET /api/ai-attendance/health',
      'POST /api/survival-plan/generate',
      'GET /api/survival-plan/history',
      'POST /api/survival-plan/saveNotes',
      'POST /api/essentials/extract',
      'GET /api/users/:id',
      'POST /api/users',
      'DELETE /api/users/:id'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API base: http://localhost:${PORT}/api/ai-attendance\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
