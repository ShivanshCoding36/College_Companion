# MERN Attendance Advisor - Backend Server

Complete Express backend with Groq AI integration for attendance management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start Server
```bash
node server.js
```

Expected output:
```
🚀 ========================================
   MERN Attendance Advisor Backend
========================================
✅ Server running on port 5000
📍 Base URL: http://localhost:5000
📍 Health: http://localhost:5000/health
📍 AI Chat: POST http://localhost:5000/api/ai-attendance/chat
========================================
```

## 📋 API Endpoints

### 1. Health Check
```bash
GET http://localhost:5000/health
```

### 2. AI Chat (No File)
```bash
POST http://localhost:5000/api/ai-attendance/chat
Content-Type: application/json

{
  "message": "What is my attendance percentage?",
  "context": {
    "attendancePercentage": 85,
    "totalClasses": 100
  }
}
```

### 3. AI Chat (With File Upload)
```bash
POST http://localhost:5000/api/ai-attendance/chat
Content-Type: multipart/form-data

file: [your-file.pdf]
message: "Analyze this attendance data"
context: {"attendancePercentage": 85}
```

## 📁 Project Structure

```
server/
├── server.js                    # Main server file
├── routes/
│   └── aiAttendance.js         # API routes
├── controllers/
│   └── aiAttendanceController.js  # Business logic
├── utils/
│   └── groqClient.js           # Groq AI client
├── uploads/                     # Temporary file storage
├── .env                         # Environment variables
└── package.json
```

## 🔧 Environment Variables

Create `.env` file:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development
```

## 🎯 Features

✅ ES Modules support
✅ CORS configured for frontend
✅ File upload (PDF, images, text)
✅ Text extraction (PDF, OCR, plain text)
✅ Groq AI integration
✅ Error handling (always returns JSON)
✅ No "Unexpected token '<'" errors
✅ Proper 404/500 handling

## 🧪 Testing

### Using curl (PowerShell)
```powershell
# Health check
curl http://localhost:5000/health

# AI Chat
curl -X POST http://localhost:5000/api/ai-attendance/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Hello AI"}'

# With file upload
curl -X POST http://localhost:5000/api/ai-attendance/chat `
  -F "file=@test.pdf" `
  -F "message=Analyze this file"
```

### Using JavaScript (Frontend)
```javascript
// No file
const response = await fetch('http://localhost:5000/api/ai-attendance/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello AI' })
});

// With file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('message', 'Analyze this');

const response = await fetch('http://localhost:5000/api/ai-attendance/chat', {
  method: 'POST',
  body: formData
});
```

## ✅ Common Issues Fixed

1. **ERR_CONNECTION_REFUSED** ✅
   - Server runs on port 5000
   - CORS properly configured

2. **Unexpected token '<'** ✅
   - All responses return JSON
   - No HTML error pages

3. **404 errors** ✅
   - Exact route: `/api/ai-attendance/chat`
   - 404 handler returns JSON

4. **Module not found** ✅
   - All imports use `.js` extension
   - ES modules properly configured

## 📦 Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `multer` - File upload
- `groq-sdk` - Groq AI client
- `pdf-parse` - PDF text extraction
- `tesseract.js` - OCR for images

## 🎉 Ready to Use!

Backend is fully configured and ready to connect to your frontend!
