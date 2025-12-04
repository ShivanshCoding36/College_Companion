# College Companion - Question Generator Backend

Complete Node.js + Express + MongoDB Atlas backend for AI-powered question generation.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm run dev
```

Expected output:
```
🚀 ============================================
   Question Generator Backend Server
============================================
✅ Server running on port 5000
📍 Base URL: http://localhost:5000
📍 API Endpoint: http://localhost:5000/api/questions
📍 Health Check: http://localhost:5000/health
============================================
📊 MongoDB Atlas connected and ready
💡 View database in MongoDB Compass
🤖 Groq AI ready for question generation
============================================
```

## 📋 API Endpoints

### 1. Generate Questions
```bash
POST http://localhost:5000/api/questions/generate
Content-Type: application/json

{
  "syllabus": "Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs",
  "questionType": "mcq"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "questionType": "mcq",
    "questions": ["Q1. ...", "Q2. ...", ...],
    "questionCount": 10,
    "createdAt": "2025-12-04T..."
  },
  "message": "Questions generated and saved successfully"
}
```

### 2. Get History
```bash
GET http://localhost:5000/api/questions/history
GET http://localhost:5000/api/questions/history?limit=20&page=1
GET http://localhost:5000/api/questions/history?questionType=mcq
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

### 3. Get Single Question Record
```bash
GET http://localhost:5000/api/questions/:id
```

### 4. Delete Question Record
```bash
DELETE http://localhost:5000/api/questions/:id
```

## 🎯 Question Types Supported

- `mcq` - Multiple Choice Questions
- `short-answer` - Short Answer Questions
- `long-answer` - Long Answer Questions
- `true-false` - True/False Questions
- `fill-in-blank` - Fill in the Blank
- `case-study` - Case Study Questions
- `numerical` - Numerical Problems
- `conceptual` - Conceptual Questions
- `mixed` - Mixed Question Types

## 📁 Project Structure

```
backend-question-generator/
├── server.js                     # Main server file
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   └── questionHistory.js       # Mongoose schema
├── controllers/
│   └── questionController.js    # Business logic
├── services/
│   └── groqService.js          # Groq AI integration
├── routes/
│   └── questionRoutes.js       # API routes
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/?appName=yugen
GROQ_API_KEY=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
NODE_ENV=development
```

## 💾 MongoDB Atlas + Compass

**Connection String:**
```
mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/?appName=yugen
```

**To view in MongoDB Compass:**
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste the connection string above
4. Click "Connect"
5. You'll see the `test` database with `questionHistory` collection

## 🧪 Testing

### Using curl (PowerShell)
```powershell
# Generate questions
curl -X POST http://localhost:5000/api/questions/generate `
  -H "Content-Type: application/json" `
  -d '{\"syllabus\":\"Operating Systems concepts\",\"questionType\":\"mcq\"}'

# Get history
curl http://localhost:5000/api/questions/history
```

### Using JavaScript (Frontend)
```javascript
// Generate questions
const response = await fetch('http://localhost:5000/api/questions/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    syllabus: 'Database Management Systems',
    questionType: 'short-answer'
  })
});

const data = await response.json();
console.log(data.data.questions);

// Get history
const history = await fetch('http://localhost:5000/api/questions/history');
const historyData = await history.json();
```

## ✅ Features

- ✅ MongoDB Atlas integration (cloud database)
- ✅ Visible in MongoDB Compass
- ✅ Groq AI (llama-3.1-70b-versatile)
- ✅ 10 question types supported
- ✅ Full CRUD operations
- ✅ Pagination support
- ✅ Error handling
- ✅ Input validation
- ✅ CORS enabled
- ✅ Clean JSON responses
- ✅ Production ready

## 🎉 Status

**Backend is fully functional and ready to use!**

- Database: MongoDB Atlas ✅
- AI: Groq API ✅
- API: Express REST ✅
- All endpoints working ✅
