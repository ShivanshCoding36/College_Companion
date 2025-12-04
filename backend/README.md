# AI Attendance Advisor Backend

Complete backend implementation for AI-powered attendance advisory system with intelligent file parsing, Groq AI integration, and Firebase Firestore storage.

## Features

✅ **File Upload & Parsing**
- Support for PDF, Excel (.xlsx, .xls), and CSV files
- Automatic file type detection
- 10MB file size limit with validation

✅ **AI-Powered Data Extraction**
- Uses Groq API (llama-3.3-70b-versatile compound model)
- Extracts structured JSON from academic calendars
- Parses weekly timetables with time slots
- Temperature-tuned for precise extraction (0.1)

✅ **Intelligent Query System**
- AI Attendance Advisor with conversational responses
- Combines calendar, timetable, and attendance data
- Provides personalized, actionable advice
- Context-aware recommendations

✅ **Firebase Integration**
- Firestore for persistent storage
- Real-time data synchronization
- Structured user document schema

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project with Firestore enabled
- Groq API key (already configured in .env)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Copy example and edit values
cp .env.example .env
```

Update `.env` with your Firebase service account path:
```env
PORT=5000
GROQ_API_KEY=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
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-sdk.json
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

3. **Download Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-admin-sdk.json` in the `backend` directory

4. **Start the server:**
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## API Endpoints

### 📤 Upload Calendar
```bash
POST /api/ai-attendance/upload/calendar
```
Upload academic calendar (PDF/Excel/CSV) → Extract holidays, exams, semester dates

### 📤 Upload Timetable
```bash
POST /api/ai-attendance/upload/timetable
```
Upload weekly schedule (PDF/Excel/CSV) → Extract class timings by day

### 💬 AI Query
```bash
POST /api/ai-attendance/query
```
Ask attendance questions → Get personalized AI advice

**Full API documentation:** See [API_DOCS.md](./API_DOCS.md)

---

## Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Upload Calendar
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/calendar \
  -F "userId=user123" \
  -F "file=@calendar.pdf"
```

### Upload Timetable
```bash
curl -X POST http://localhost:5000/api/ai-attendance/upload/timetable \
  -F "userId=user123" \
  -F "file=@timetable.xlsx"
```

### Ask AI Question
```bash
curl -X POST http://localhost:5000/api/ai-attendance/query \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "query": "Can I skip class tomorrow?"}'
```

---

## Architecture

```
backend/
├── server.js                   # Express server + middleware
├── package.json                # Dependencies and scripts
├── .env                        # Environment configuration
│
├── services/
│   ├── firebase/index.js       # Firestore operations
│   └── groq/index.js           # AI extraction & responses
│
├── utils/
│   ├── parsers/
│   │   ├── index.js            # Unified file parser
│   │   ├── pdfParser.js        # PDF text extraction
│   │   └── excelParser.js      # Excel/CSV parsing
│   └── prompts.js              # Groq extraction prompts
│
└── routes/
    ├── upload.js               # File upload endpoints
    └── query.js                # AI query endpoint
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **AI Model** | Groq (llama-3.3-70b-versatile) |
| **Database** | Firebase Firestore |
| **File Parsing** | pdf-parse, xlsx |
| **File Upload** | Multer |

---

## Firestore Schema

```javascript
users/{userId}/
├── calendarData: {
│     holidays: [{ date, name }],
│     workingDays: [...],
│     examDates: [{ date, subject }],
│     semesterStart: "YYYY-MM-DD",
│     semesterEnd: "YYYY-MM-DD",
│     updatedAt: Timestamp
│   }
│
├── timetableData: {
│     weeklySchedule: {
│       Monday: [{ subject, start, end }],
│       Tuesday: [...],
│       ...
│     },
│     updatedAt: Timestamp
│   }
│
├── attendanceStats: {
│     totalClasses: number,
│     attendedClasses: number,
│     percentage: number,
│     updatedAt: Timestamp
│   }
│
├── leaveHistory: [
│     { date: "YYYY-MM-DD", reason: "string" }
│   ]
│
└── absenceTimeline: [
      { date: "YYYY-MM-DD", subject: "string" }
    ]
```

---

## Key Features

### 🔍 Intelligent File Parsing
- **Auto-detection:** Determines file type by MIME type and extension
- **Multiple formats:** PDF (pdf-parse), Excel (xlsx), CSV (UTF-8)
- **Text cleaning:** Removes excess whitespace and normalizes content

### 🤖 Groq AI Integration
- **Structured extraction:** Temperature 0.1 for precise JSON output
- **Conversational responses:** Temperature 0.3 for natural advice
- **Context-aware:** Combines all user data for personalized recommendations
- **JSON validation:** Forces json_object response format

### 🔥 Firebase Firestore
- **Real-time sync:** Instant updates across clients
- **Structured documents:** Clean schema with nested objects
- **Server timestamps:** Automatic updatedAt tracking
- **Scalable storage:** Cloud-based with automatic backups

### 🛡️ Error Handling
- Input validation on all endpoints
- File type and size validation
- Comprehensive try-catch blocks
- Descriptive error messages
- HTTP status codes (400, 404, 500)

### 🚀 Performance
- In-memory file processing (no disk writes)
- Parallel operations where possible
- Efficient text parsing
- Minimal console logging

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `GROQ_API_KEY` | Groq API key for AI | Required |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase credentials JSON | `./firebase-admin-sdk.json` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:5173,http://localhost:5174` |

---

## Scripts

```bash
npm start       # Production mode (node server.js)
npm run dev     # Development mode (nodemon with auto-restart)
```

---

## CORS Configuration

Frontend running on `localhost:5173` or `localhost:5174` can access all endpoints. Configure additional origins in `.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://yourdomain.com
```

---

## Troubleshooting

### "Firebase Admin SDK not initialized"
- Ensure `firebase-admin-sdk.json` exists in backend directory
- Check `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`
- Verify JSON file is valid and from correct Firebase project

### "Groq API key is not set"
- Check `GROQ_API_KEY` in `.env`
- Ensure no extra spaces or quotes
- Verify API key is active on Groq dashboard

### "File upload error: File too large"
- Maximum file size is 10MB
- Compress large PDFs or Excel files
- Split large datasets into multiple files

### "Not allowed by CORS"
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart server after changing environment variables

---

## Development

### Adding New Routes
1. Create route file in `routes/` directory
2. Import and mount in `server.js`:
```javascript
import newRoute from './routes/newRoute.js';
app.use('/api/ai-attendance', newRoute);
```

### Adding New Parsers
1. Create parser in `utils/parsers/`
2. Export function from `utils/parsers/index.js`
3. Add file type detection in `parseFile()` function

### Modifying AI Prompts
- Edit prompts in `utils/prompts.js`
- Keep temperature at 0.1 for extraction (precise)
- Use temperature 0.3 for conversational responses

---

## Production Deployment

1. **Environment:**
   - Set `NODE_ENV=production`
   - Use process manager (PM2, systemd)
   - Enable HTTPS

2. **Security:**
   - Store `.env` securely (never commit)
   - Rotate Groq API key periodically
   - Restrict Firebase service account permissions

3. **Monitoring:**
   - Log errors to file or service
   - Monitor API usage (Groq, Firebase)
   - Set up health check alerts

4. **Scaling:**
   - Use load balancer for multiple instances
   - Enable Firebase caching
   - Optimize file parsing for large files

---

## License

MIT

## Support

For issues or questions, check:
- [API Documentation](./API_DOCS.md)
- [Groq API Docs](https://console.groq.com/docs)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
