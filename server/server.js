import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiAttendanceRoutes from './routes/aiAttendance.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin && origin.includes('localhost')) {
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Attendance Advisor API',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/ai-attendance/chat',
      health: 'GET /api/ai-attendance/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount AI Attendance routes
app.use('/api/ai-attendance', aiAttendanceRoutes);

// Mock user API endpoint (replace with real MongoDB implementation)
app.get('/api/users/:uid', (req, res) => {
  res.json({
    uid: req.params.uid,
    email: 'user@example.com',
    displayName: 'User',
    createdAt: new Date().toISOString()
  });
});

// 404 Handler - Must return JSON, not HTML
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedUrl: req.url,
    method: req.method,
    availableEndpoints: [
      'POST /api/ai-attendance/chat',
      'GET /api/ai-attendance/health',
      'GET /health'
    ]
  });
});

// Error Handler - Must return JSON, not HTML
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  
  // Always return JSON, never HTML
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   MERN Attendance Advisor Backend');
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 AI Chat: POST http://localhost:${PORT}/api/ai-attendance/chat`);
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

export default app;
