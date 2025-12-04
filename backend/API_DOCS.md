# AI Attendance Advisor Backend - API Documentation

## Overview
Complete backend for AI-powered attendance advisory system with file upload parsing, Groq AI integration, and Firebase Firestore storage.

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
GROQ_API_KEY=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
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-sdk.json
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 3. Download Firebase Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `firebase-admin-sdk.json` in the `backend` directory

### 4. Start the Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "AI Attendance Advisor Backend is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Test Command:**
```bash
curl http://localhost:5000/health
```

---

### Upload Academic Calendar
**POST** `/api/ai-attendance/upload/calendar`

Upload an academic calendar file (PDF, Excel, or CSV). The system will extract structured data using Groq AI.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `userId` (string, required): User's unique ID
  - `file` (file, required): Calendar file (PDF, Excel, or CSV)

**Response:**
```json
{
  "success": true,
  "message": "Academic calendar uploaded and processed successfully",
  "data": {
    "holidays": [
      { "date": "2024-01-01", "name": "New Year" }
    ],
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "specialEvents": [],
    "examDates": [
      { "date": "2024-05-15", "subject": "Mathematics" }
    ],
    "semesterStart": "2024-01-08",
    "semesterEnd": "2024-05-20"
  }
}
```

**Test Command:**
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/calendar \
  -F "userId=user123" \
  -F "file=@/path/to/calendar.pdf"
```

**Error Responses:**
- `400`: Missing userId or file
- `500`: File parsing or AI extraction failed

---

### Upload Weekly Timetable
**POST** `/api/ai-attendance/upload/timetable`

Upload a weekly timetable file (PDF, Excel, or CSV). The system will extract structured schedule data using Groq AI.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `userId` (string, required): User's unique ID
  - `file` (file, required): Timetable file (PDF, Excel, or CSV)

**Response:**
```json
{
  "success": true,
  "message": "Timetable uploaded and processed successfully",
  "data": {
    "weeklySchedule": {
      "Monday": [
        { "subject": "Mathematics", "start": "09:00", "end": "10:30" },
        { "subject": "Physics", "start": "11:00", "end": "12:30" }
      ],
      "Tuesday": [
        { "subject": "Chemistry", "start": "09:00", "end": "10:30" }
      ]
    }
  }
}
```

**Test Command:**
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/timetable \
  -F "userId=user123" \
  -F "file=@/path/to/timetable.xlsx"
```

**Error Responses:**
- `400`: Missing userId or file
- `500`: File parsing or AI extraction failed

---

### AI Attendance Query
**POST** `/api/ai-attendance/query`

Ask the AI Attendance Advisor a question. The system combines user's calendar, timetable, and attendance data to provide personalized advice.

**Request:**
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "userId": "user123",
  "query": "Can I afford to miss class tomorrow?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on your current attendance of 78% and upcoming holidays, missing tomorrow's class would drop you to 76%. I recommend attending to maintain above 75% threshold.",
  "userData": {
    "hasCalendar": true,
    "hasTimetable": true,
    "hasAttendanceStats": true
  }
}
```

**Test Command:**
```bash
curl -X POST http://localhost:5000/api/ai-attendance/query \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "query": "Can I afford to miss class tomorrow?"}'
```

**Error Responses:**
- `400`: Missing userId or query
- `404`: No data found for user (must upload calendar/timetable first)
- `500`: AI generation failed

---

## Firestore Data Structure

### Collection: `users/{userId}`

```javascript
{
  // Calendar data extracted from uploaded file
  calendarData: {
    holidays: [{ date: "YYYY-MM-DD", name: "string" }],
    workingDays: ["Monday", "Tuesday", ...],
    specialEvents: [{ date: "YYYY-MM-DD", name: "string" }],
    examDates: [{ date: "YYYY-MM-DD", subject: "string" }],
    semesterStart: "YYYY-MM-DD",
    semesterEnd: "YYYY-MM-DD",
    updatedAt: Timestamp
  },

  // Timetable data extracted from uploaded file
  timetableData: {
    weeklySchedule: {
      Monday: [{ subject: "string", start: "HH:MM", end: "HH:MM" }],
      Tuesday: [{ subject: "string", start: "HH:MM", end: "HH:MM" }],
      // ... other days
    },
    updatedAt: Timestamp
  },

  // Attendance statistics (if manually added)
  attendanceStats: {
    totalClasses: number,
    attendedClasses: number,
    percentage: number,
    updatedAt: Timestamp
  },

  // Leave history (if manually added)
  leaveHistory: [
    { date: "YYYY-MM-DD", reason: "string" }
  ],

  // Absence timeline (if manually added)
  absenceTimeline: [
    { date: "YYYY-MM-DD", subject: "string" }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (missing or invalid parameters) |
| 403 | Forbidden (CORS policy violation) |
| 404 | Not Found (endpoint or user data) |
| 500 | Internal Server Error (parsing, AI, or database failure) |

---

## File Upload Limits

- **Maximum file size:** 10 MB
- **Allowed file types:** PDF, Excel (.xlsx, .xls), CSV
- **Validation:** Both MIME type and file extension checked

---

## Groq AI Configuration

### Models Used
- **Model:** `llama-3.3-70b-versatile` (Groq Compound Model)
- **Extraction Temperature:** 0.1 (precise JSON extraction)
- **Query Temperature:** 0.3 (conversational responses)

### Extraction Prompts

**Calendar Extraction:**
- Extracts holidays, working days, special events, exam dates, semester dates
- Returns structured JSON with YYYY-MM-DD date format

**Timetable Extraction:**
- Extracts weekly schedule by day
- Returns structured JSON with HH:MM time format (24-hour)

**AI Query Response:**
- Combines all user data (calendar, timetable, attendance stats, leave history)
- Provides personalized, actionable attendance advice
- Considers upcoming holidays, class schedules, and current attendance percentage

---

## Testing Workflow

### 1. Check server health
```bash
curl http://localhost:5000/health
```

### 2. Upload calendar
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/calendar \
  -F "userId=testuser" \
  -F "file=@calendar.pdf"
```

### 3. Upload timetable
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/timetable \
  -F "userId=testuser" \
  -F "file=@timetable.xlsx"
```

### 4. Ask AI a question
```bash
curl -X POST http://localhost:5000/api/ai-attendance/query \
  -H "Content-Type: application/json" \
  -d '{"userId": "testuser", "query": "What is my class schedule for Monday?"}'
```

---

## Architecture

```
backend/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── firebase-admin-sdk.json   # Firebase service account key
├── services/
│   ├── firebase/
│   │   └── index.js          # Firebase Admin SDK wrapper
│   └── groq/
│       └── index.js          # Groq API integration
├── utils/
│   ├── parsers/
│   │   ├── index.js          # Unified file parser
│   │   ├── pdfParser.js      # PDF text extraction
│   │   └── excelParser.js    # Excel/CSV parsing
│   └── prompts.js            # Groq extraction prompts
└── routes/
    ├── upload.js             # File upload endpoints
    └── query.js              # AI query endpoint
```

---

## Dependencies

### Production
- `express`: Web server framework
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `multer`: File upload handling
- `pdf-parse`: PDF text extraction
- `xlsx`: Excel/CSV parsing
- `firebase-admin`: Firebase Admin SDK
- `groq-sdk`: Groq AI API client

### Development
- `nodemon`: Auto-restart on file changes

---

## Notes

- Files are processed in-memory (not saved to disk)
- All dates are normalized to YYYY-MM-DD format
- All times use 24-hour HH:MM format
- Firebase timestamps use serverTimestamp()
- Groq responses are validated for JSON structure
- Comprehensive error handling throughout
- CORS configured for React frontend (localhost:5173/5174)
