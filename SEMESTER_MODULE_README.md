# Semester Module & Attendance Advisor - Setup Guide

## Overview
This project implements a complete backend refactor for the Semester module and Attendance Advisor with proper authentication, data persistence, and API integration.

## Architecture

### Backend Stack
- **Node.js + Express**: REST API server
- **MongoDB Atlas**: Persistent data storage (user profiles, notes, question history, survival plans)
- **Firebase Admin SDK**: Server-side authentication verification & Firestore for calendar/timetable data
- **Groq API**: AI-powered question generation, survival plans, revision strategies, doubt solving
- **Perplexity API**: Vision-based file extraction and structured data parsing
- **Multer**: File upload handling

### Frontend Stack
- **React**: UI components (no changes to styling/classNames)
- **Firebase Auth**: User authentication (email/password + Google)
- **API Service**: Centralized authenticated API requests

## Data Responsibilities

| Data Type | Storage | Reason |
|-----------|---------|--------|
| User profiles, metadata | MongoDB | Persistent, structured user data |
| Question generation history | MongoDB | Historical records, searchable |
| Notes repository | MongoDB | CRUD operations, tagging, search |
| Survival plans | MongoDB | Saved plans, revision history |
| Essentials (extracted syllabus) | MongoDB | Large structured data |
| Doubt solver history | MongoDB | Conversation history |
| Attendance queries | MongoDB | Query history |
| Calendar & Timetable data | Firestore | Frequently updated, tightly tied to user |
| Attendance stats | Firestore | Real-time updates |
| Study Arena (rooms, members) | Realtime DB | Ephemeral, real-time collaboration |

## Required Environment Variables

### Backend (.env file in /backend)
```bash
# MongoDB
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority

# AI APIs
GROQ_API_KEY=gsk_...
PPLX_API_KEY=pplx_...

# Firebase Admin (Option 1: Service Account JSON)
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Firebase Admin (Option 2: Environment Variables)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_CLIENT_ID=...
FIREBASE_CLIENT_CERT_URL=https://...

# Firebase Realtime Database
RTDB_URL=https://your-project-id-default-rtdb.firebaseio.com

# Server
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend (.env file in root)
```bash
VITE_API_BASE_URL=http://localhost:5000

# Firebase Client Config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Installation & Setup

### 1. Install Dependencies
```powershell
# Backend
cd backend
npm install

# Frontend (if needed)
cd ..
npm install
```

### 2. Configure Environment Variables
Create `.env` files as shown above with your actual API keys and credentials.

### 3. Firebase Setup
- Download service account JSON from Firebase Console → Project Settings → Service Accounts
- Place in `backend/config/serviceAccountKey.json` OR use environment variables

### 4. Start Backend
```powershell
cd backend
npm start
```

Backend runs on http://localhost:5000

### 5. Start Frontend
```powershell
# From project root
npm run dev
```

Frontend runs on http://localhost:5173

## API Endpoints

### Authentication
All protected endpoints require `Authorization: Bearer <Firebase ID Token>` header.

### Question Generator
- `POST /api/questions/generate` - Generate questions from syllabus
  ```json
  {
    "syllabus": "string",
    "questionType": "2m" | "3m" | "14m" | "16m",
    "userId": "firebase-uid"
  }
  ```
- `GET /api/questions/history?userId=xxx` - Get question history

### Survival Plan
- `POST /api/survival/generate` - Generate survival plan
  ```json
  {
    "userId": "string",
    "skills": ["string"],
    "stressLevel": 1-10,
    "timeAvailable": number,
    "examDates": ["string"],
    "goals": "string"
  }
  ```
- `GET /api/survival/history?userId=xxx` - Get survival plan history

### Semester Essentials
- `POST /api/essentials/extract` - Extract essentials from file (multipart/form-data)
  - Field: `file` (PDF, JPG, PNG, MP4)
  - Returns structured JSON with creative questions, theory topics, numerical topics, marks distribution
- `GET /api/essentials/history?userId=xxx` - Get essentials history

### Revision Strategy
- `POST /api/revision/generate` - Generate revision plan
- `GET /api/revision/history?userId=xxx` - Get revision history

### Notes Repository
- `POST /api/notes` - Create note
- `GET /api/notes?userId=xxx&type=xxx` - Get notes
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Doubt Solver
- `POST /api/doubt/ask` - Ask doubt (uses user's notes for context)
  ```json
  {
    "userId": "string",
    "question": "string",
    "contextNotes": "string (optional)"
  }
  ```
- `GET /api/doubt/history?userId=xxx` - Get doubt history

### Attendance Advisor
- `POST /api/attendance/query` - Query attendance advisor
  ```json
  {
    "userId": "string",
    "question": "string"
  }
  ```
  Returns:
  ```json
  {
    "success": true,
    "advice": {
      "canTakeLeave": boolean,
      "impactPercent": number,
      "recommendedDates": ["string"],
      "reasoning": "string"
    }
  }
  ```
- `GET /api/attendance/history?userId=xxx` - Get query history

## Testing with cURL

### Question Generation (with auth)
```bash
# First, get Firebase ID token from your frontend
curl -X POST http://localhost:5000/api/questions/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "syllabus": "Data Structures: Arrays, Linked Lists, Trees, Graphs",
    "questionType": "2m",
    "userId": "your-firebase-uid"
  }'
```

### File Upload (Essentials)
```bash
curl -X POST http://localhost:5000/api/essentials/extract \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -F "file=@path/to/syllabus.pdf"
```

### Health Check (no auth)
```bash
curl http://localhost:5000/health
```

## Troubleshooting

### Backend Issues
1. **404 errors**: Ensure routes are mounted in `server.js`
2. **MongoDB connection failed**: Check MONGO_URI in .env
3. **Firebase auth error**: Verify Firebase credentials
4. **Groq API error**: Check GROQ_API_KEY is valid
5. **File upload fails**: Check uploads/temp directory exists

### Frontend Issues
1. **Authentication errors**: User must be logged in
2. **CORS errors**: Check ALLOWED_ORIGINS in backend .env
3. **API calls fail**: Verify VITE_API_BASE_URL points to backend

### Common Fixes
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Reinstall dependencies
cd backend
rm -r node_modules
rm package-lock.json
npm install

# Check backend logs
cd backend
npm start
```

## Project Structure
```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── firebaseAdmin.js      # Firebase Admin SDK
├── controllers/
│   ├── questionController.js
│   ├── survivalController.js
│   ├── essentialsController.js
│   ├── revisionController.js
│   ├── notesController.js
│   ├── doubtController.js
│   └── attendanceController.js
├── models/
│   ├── User.js
│   ├── QuestionHistory.js
│   ├── SurvivalPlan.js
│   ├── Essentials.js
│   ├── RevisionPlan.js
│   ├── Note.js
│   ├── Doubt.js
│   └── AttendanceQuery.js
├── routes/
│   ├── question.js
│   ├── survival.js
│   ├── essentials.js
│   ├── revision.js
│   ├── notes.js
│   ├── doubt.js
│   └── attendance.js
├── services/
│   ├── groqService.js        # Groq AI integration
│   ├── pplxService.js        # Perplexity Vision API
│   ├── extractors.js         # File text extraction
│   └── storage.js            # Firestore helpers
├── middleware/
│   ├── auth.js               # Firebase token verification
│   └── upload.js             # Multer file upload
├── uploads/temp/             # Temporary file storage
├── .env                      # Environment variables
├── server.js                 # Express app
└── package.json

src/
├── services/
│   └── api.js                # Centralized API calls
├── components/semester/
│   ├── QuestionGenerator.jsx
│   ├── SurvivalPlan.jsx
│   ├── SemesterEssentials.jsx
│   ├── RevisionStrategy.jsx
│   ├── NotesRepository.jsx
│   └── DoubtSolver.jsx
└── contexts/
    └── AuthContext.jsx       # Firebase Auth context
```

## Key Features

### ✅ Complete Backend Refactor
- Proper route organization and controller separation
- Mongoose models for all data types
- Firebase Admin for server-side auth verification
- Groq AI integration for all generation tasks
- Perplexity Vision for file extraction

### ✅ Authentication
- Firebase ID token verification on all protected routes
- User profile sync between Firebase and MongoDB

### ✅ File Upload & Processing
- Multer disk storage for temp files
- Support for PDF, JPG, PNG, MP4
- Automatic cleanup after processing

### ✅ Attendance Advisor Fixes
- Deterministic AI responses using structured prompts
- Context fetched from Firestore (calendar, timetable, stats)
- Proper error handling for insufficient data

### ✅ Frontend Integration
- Centralized API service with automatic auth headers
- No changes to UI styling or component names
- Proper error handling and loading states

## Next Steps
1. Test all endpoints with real user accounts
2. Add rate limiting and request validation
3. Implement pagination for history endpoints
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Deploy to production (Vercel + MongoDB Atlas)

## Support
For issues or questions, check the implementation files or console logs for detailed error messages.
