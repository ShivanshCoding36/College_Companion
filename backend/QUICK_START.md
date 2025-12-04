# 🚀 AI Attendance Advisor Backend - Quick Start Guide

## ✅ Backend Status: READY TO RUN

All code is complete and production-ready. Follow these steps to get it running.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- ✅ Node.js 18+ installed
- ✅ Firebase project created
- ✅ Groq API key (already configured in `.env`)

---

## 🔧 Step-by-Step Setup

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

This will install:
- express, cors, dotenv (server)
- multer (file uploads)
- pdf-parse, xlsx (file parsing)
- firebase-admin (Firestore)
- groq-sdk (AI)
- nodemon (dev mode)

---

### Step 2: Get Firebase Service Account Key

**CRITICAL:** You must download your Firebase credentials before the server will start.

1. Go to: https://console.firebase.google.com
2. Select your project
3. Click the gear icon → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Save the downloaded JSON file as `firebase-admin-sdk.json` in the `backend` folder

**File location:** `c:\Users\Yugendra\mernproj1\backend\firebase-admin-sdk.json`

---

### Step 3: Verify Environment Variables

Your `.env` file should already contain:

```env
PORT=5000
GROQ_API_KEY=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
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-sdk.json
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

✅ **No changes needed** - Groq API key is already configured!

---

### Step 4: Start the Server

```powershell
npm run dev
```

You should see:

```
🚀 Initializing AI Attendance Advisor Backend...

✅ Firebase Admin SDK initialized

✅ Groq API initialized

✅ Server running on port 5000
📍 Health check: http://localhost:5000/health
📍 API base: http://localhost:5000/api/ai-attendance
```

---

## 🧪 Test the Backend

### Option 1: Quick Health Check

Open a new PowerShell terminal:

```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "AI Attendance Advisor Backend is running",
  "timestamp": "2025-12-04T..."
}
```

---

### Option 2: Run Full Test Suite

In a new terminal (while server is running):

```powershell
cd backend
node test-backend.js
```

This will automatically test:
1. ✅ Health check
2. ✅ Calendar upload
3. ✅ Timetable upload
4. ✅ AI query

---

### Option 3: Manual cURL Tests

**Upload Academic Calendar:**
```powershell
curl -X POST http://localhost:5000/api/ai-attendance/upload/calendar `
  -F "userId=testuser123" `
  -F "file=@path\to\calendar.pdf"
```

**Upload Timetable:**
```powershell
curl -X POST http://localhost:5000/api/ai-attendance/upload/timetable `
  -F "userId=testuser123" `
  -F "file=@path\to\timetable.xlsx"
```

**Ask AI Question:**
```powershell
curl -X POST http://localhost:5000/api/ai-attendance/query `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"testuser123\",\"query\":\"Can I skip class tomorrow?\"}'
```

---

## 🎯 Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Server health check |
| `/api/ai-attendance/upload/calendar` | POST | Upload academic calendar |
| `/api/ai-attendance/upload/timetable` | POST | Upload weekly timetable |
| `/api/ai-attendance/query` | POST | Ask AI attendance questions |

---

## 📁 Project Structure

```
backend/
├── server.js                   # Main Express server ✅
├── package.json                # Dependencies ✅
├── .env                        # Environment config ✅
├── firebase-admin-sdk.json     # ⚠️ YOU NEED TO DOWNLOAD THIS
│
├── services/
│   ├── firebase/index.js       # Firestore operations ✅
│   └── groq/index.js           # AI integration ✅
│
├── utils/
│   ├── parsers/
│   │   ├── index.js            # File parser ✅
│   │   ├── pdfParser.js        # PDF extraction ✅
│   │   └── excelParser.js      # Excel/CSV parsing ✅
│   └── prompts.js              # Groq prompts ✅
│
├── routes/
│   ├── upload.js               # Upload endpoints ✅
│   └── query.js                # AI query endpoint ✅
│
├── test-backend.js             # Test script ✅
├── API_DOCS.md                 # Full API reference ✅
├── README.md                   # Setup guide ✅
└── QUICK_START.md              # This file ✅
```

---

## ⚠️ Common Issues

### "Firebase Admin SDK not initialized"

**Problem:** Missing `firebase-admin-sdk.json` file

**Solution:**
1. Download from Firebase Console (see Step 2)
2. Place in `backend/` folder
3. Verify path in `.env` is correct

---

### "Groq API key is not set"

**Problem:** Environment variable not loaded

**Solution:**
1. Check `.env` file exists in `backend/` folder
2. Restart the server: `npm run dev`
3. Verify no extra spaces in the API key

---

### "EADDRINUSE: Port 5000 already in use"

**Problem:** Another process is using port 5000

**Solution:**
```powershell
# Option 1: Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Option 2: Change port in .env
PORT=5001
```

---

### "Not allowed by CORS"

**Problem:** Frontend URL not in allowed origins

**Solution:**
Edit `.env` and add your frontend URL:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

---

## 🔗 Integration with Frontend

Once the backend is running on `http://localhost:5000`, update your frontend API calls:

```javascript
// Upload calendar
const formData = new FormData();
formData.append('userId', currentUser.uid);
formData.append('file', calendarFile);

const response = await fetch('http://localhost:5000/api/ai-attendance/upload/calendar', {
  method: 'POST',
  body: formData
});

// Ask AI question
const response = await fetch('http://localhost:5000/api/ai-attendance/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.uid,
    query: 'Can I skip tomorrow?'
  })
});
```

---

## 📖 Documentation

For complete API documentation with all endpoints, schemas, and examples:

👉 **See [API_DOCS.md](./API_DOCS.md)**

For architecture details and deployment guide:

👉 **See [README.md](./README.md)**

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] `npm install` completed successfully
- [ ] `firebase-admin-sdk.json` downloaded and placed in `backend/`
- [ ] `.env` file contains all 4 variables
- [ ] Server starts without errors: `npm run dev`
- [ ] Health check returns 200 OK: `curl http://localhost:5000/health`
- [ ] No error messages in console

---

## 🎉 Next Steps

Once the backend is running successfully:

1. **Test with sample files:** Upload a PDF calendar and Excel timetable
2. **Ask AI questions:** Test the query endpoint with various questions
3. **Connect frontend:** Integrate with your React app
4. **Monitor logs:** Check console output for any issues
5. **Review API docs:** Read API_DOCS.md for advanced usage

---

## 💡 Pro Tips

**Development Mode:**
- Server auto-restarts on file changes (nodemon)
- Console shows colored logs (✅/❌)
- Detailed error messages

**Testing:**
- Use the included `test-backend.js` script
- Test one endpoint at a time
- Check Firestore console to verify data storage

**Debugging:**
- Check `backend/` terminal for error messages
- Verify Firebase project has Firestore enabled
- Ensure Groq API key is valid (test at console.groq.com)

---

**Status:** ✅ Backend is complete and ready to run!

**Estimated setup time:** 5-10 minutes

**Required action:** Download `firebase-admin-sdk.json` from Firebase Console
