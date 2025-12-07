import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { initializeFirebaseAdmin } from './config/firebaseAdmin.js';
import { initializeGroqClient } from './services/groqService.js';

// Import routes
import questionRoutes from './routes/question.js';
import survivalRoutes from './routes/survival.js';
import essentialsRoutes from './routes/essentials.js';
import revisionRoutes from './routes/revision.js';
import notesRoutes from './routes/notes.js';
import doubtRoutes from './routes/doubt.js';
import attendanceRoutes from './routes/attendance.js';
import usersRoutes from './routes/users.js';
import profileRoutes from './routes/profile.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
console.log('🚀 Initializing Backend Services...\n');

try {
  // Initialize MongoDB
  await connectDB();
  console.log('');

  // Initialize Firebase Admin SDK
  try {
    initializeFirebaseAdmin();
    console.log('');
  } catch (firebaseError) {
    console.error('❌ Firebase initialization failed:', firebaseError.message);
    console.warn('⚠️  Continuing without Firebase. Auth features will not work.');
  }

  // Initialize Groq API (required)
  initializeGroqClient();
  console.log('');
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

// Serve uploaded files (avatars, essentials, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'connected',
      groq: 'initialized',
      firebase: 'initialized',
    },
  });
});

// API Routes - Mount all semester module routes
app.use('/api/questions', questionRoutes);
app.use('/api/survival', survivalRoutes);
app.use('/api/essentials', essentialsRoutes);
app.use('/api/revision', revisionRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/doubt', doubtRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);

// Catch-all Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: [
      'POST /api/questions/generate',
      'GET /api/questions/history',
      'POST /api/survival/generate',
      'GET /api/survival/history',
      'POST /api/essentials/extract',
      'GET /api/essentials/history',
      'POST /api/revision/generate',
      'GET /api/revision/history',
      'POST /api/notes',
      'GET /api/notes',
      'PUT /api/notes/:id',
      'DELETE /api/notes/:id',
      'POST /api/doubt/ask',
      'GET /api/doubt/history',
      'POST /api/attendance/query',
      'GET /api/attendance/history',
      'GET /api/users/:id',
      'POST /api/users',
      'GET /api/profile/me',
      'PUT /api/profile/update',
      'PUT /api/profile/settings',
      'POST /api/profile/avatar',
      'DELETE /api/profile/delete',
    ],
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: 'Origin not allowed',
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API base: http://localhost:${PORT}/api\n`);
  console.log('Available modules:');
  console.log('  - Question Generator: /api/questions');
  console.log('  - Survival Plan: /api/survival');
  console.log('  - Semester Essentials: /api/essentials');
  console.log('  - Revision Strategy: /api/revision');
  console.log('  - Notes Repository: /api/notes');
  console.log('  - Doubt Solver: /api/doubt');
  console.log('  - Attendance Advisor: /api/attendance');
  console.log('  - User Profile: /api/profile\n');
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
