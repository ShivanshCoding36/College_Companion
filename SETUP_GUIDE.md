# 🚀 COMPLETE SETUP GUIDE - Semester Module Backend

## 📋 What You Need

### Required API Keys & Credentials
1. **MongoDB Atlas** - Database connection
2. **Groq API Key** - AI question generation (`gsk_...`)
3. **Perplexity API Key** - File extraction (`pplx_...`)
4. **Firebase Admin SDK** - Authentication

## ⚡ Quick Setup (5 Minutes)

### Step 1: Get API Keys

#### Groq API (Free)
1. Visit: https://console.groq.com
2. Sign up → API Keys → Create New Key
3. Copy key (starts with `gsk_`)

#### Perplexity API
1. Visit: https://www.perplexity.ai/settings/api
2. Sign up → Generate API Key
3. Copy key (starts with `pplx_`)

#### Firebase Admin SDK
1. Firebase Console → Your Project
2. Settings → Service Accounts
3. Generate New Private Key
4. Download JSON → Save as `backend/config/serviceAccountKey.json`

### Step 2: Configure Environment

```powershell
# Create .env file from example
cp backend\.env.example backend\.env
```

**Edit `backend/.env` with your values:**
```bash
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/database
GROQ_API_KEY=gsk_your_actual_key_here
PPLX_API_KEY=pplx_your_actual_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
RTDB_URL=https://your-project-default-rtdb.firebaseio.com
PORT=5000
```

### Step 3: Validate Configuration

```powershell
.\setup-check.ps1
```

This checks:
- ✅ .env file exists
- ✅ All required variables are set
- ✅ Dependencies installed
- ✅ Upload directory exists

### Step 4: Start Backend

**Option A: Quick Start Script**
```powershell
.\start-backend.ps1
```

**Option B: Manual Start**
```powershell
cd backend
npm install
npm start
```

**Success Output:**
```
🚀 Initializing Backend Services...
✅ MongoDB Connected
✅ Firebase Admin SDK initialized
✅ Groq client initialized
✅ Server running on port 5000
📍 Health check: http://localhost:5000/health
```

### Step 5: Test Backend

```powershell
# Run test script
.\backend\test-api.ps1

# OR test manually
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Backend is running",
  "services": {
    "mongodb": "connected",
    "groq": "initialized",
    "firebase": "initialized"
  }
}
```

### Step 6: Start Frontend

```powershell
# New terminal, from project root
npm run dev
```

Runs on **http://localhost:5173**

## 🧪 Testing the Integration

### 1. Login to Your App
- Use email/password or Google Sign-In
- Verify you're authenticated

### 2. Test Question Generator
- Navigate to: Semester → Question Generator
- Enter syllabus text
- Select question type (2m, 3m, 14m, or 16m)
- Click "Generate Questions"
- Questions should appear within seconds

### 3. Test Semester Essentials
- Navigate to: Semester → Essentials
- Upload a PDF or image of your syllabus
- Click "Extract & Generate"
- Structured essentials should display

### 4. Test Attendance Advisor
- Navigate to: Attendance → Advisor
- Upload calendar/timetable (if not already done)
- Ask a question like "Can I take leave tomorrow?"
- Should receive structured advice

## 🐛 Common Issues & Fixes

### Issue: "MONGO_URI not defined"
**Fix:**
```powershell
# Check .env file exists
ls backend\.env

# Edit and add your MongoDB connection string
notepad backend\.env
```

### Issue: "Firebase initialization failed"
**Fix:**
1. Verify `serviceAccountKey.json` is in `backend/config/`
2. Check file is valid JSON
3. Ensure path in .env is correct

### Issue: "Port 5000 already in use"
**Fix:**
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Restart backend
cd backend
npm start
```

### Issue: "Cannot find module 'xyz'"
**Fix:**
```powershell
cd backend
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: "401 Unauthorized" on API calls
**Fix:**
- Ensure you're logged in on frontend
- Check Firebase token is being sent
- Verify Firebase Admin SDK is initialized

### Issue: "MongoDB connection timeout"
**Fix:**
1. Check internet connection
2. Whitelist your IP in MongoDB Atlas
3. Verify connection string is correct

## 📊 API Endpoints Reference

### Protected Endpoints (Require Auth Token)

```
POST /api/questions/generate       - Generate questions
GET  /api/questions/history        - Get question history

POST /api/survival/generate        - Generate survival plan
GET  /api/survival/history         - Get survival plans

POST /api/essentials/extract       - Extract from file
GET  /api/essentials/history       - Get essentials history

POST /api/revision/generate        - Generate revision plan
GET  /api/revision/history         - Get revision history

POST /api/notes                    - Create note
GET  /api/notes                    - Get notes
PUT  /api/notes/:id                - Update note
DELETE /api/notes/:id              - Delete note

POST /api/doubt/ask                - Ask doubt
GET  /api/doubt/history            - Get doubt history

POST /api/attendance/query         - Query attendance
GET  /api/attendance/history       - Get attendance history
```

### Public Endpoints

```
GET  /health                       - Health check
```

## 📂 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Environment variables |
| `backend/config/serviceAccountKey.json` | Firebase credentials |
| `backend/server.js` | Main server file |
| `src/services/api.js` | Frontend API calls |
| `SEMESTER_MODULE_README.md` | Full documentation |
| `REFACTOR_COMPLETE.md` | Implementation details |

## 🎯 What's Been Implemented

### ✅ Backend (Complete)
- Express server with proper routing
- MongoDB Atlas integration
- Firebase Admin SDK
- Groq AI service
- Perplexity Vision API
- File upload handling
- Authentication middleware
- All 7 module endpoints

### ✅ Frontend (Partial)
- Centralized API service
- QuestionGenerator updated
- SemesterEssentials updated
- Other components need similar updates

### ✅ Infrastructure
- Environment configuration
- Setup validation scripts
- Testing utilities
- Comprehensive documentation

## 🔜 Optional Enhancements

1. Update remaining frontend components
2. Add rate limiting
3. Implement caching
4. Add comprehensive logging
5. Write unit tests
6. Set up CI/CD
7. Deploy to production

## 📞 Getting Help

1. **Check Logs**: Backend console shows detailed errors
2. **Run Validation**: `.\setup-check.ps1`
3. **Test Health**: `curl http://localhost:5000/health`
4. **Check Documentation**: `SEMESTER_MODULE_README.md`
5. **Review Implementation**: `REFACTOR_COMPLETE.md`

## ✨ Success Checklist

- [ ] MongoDB Atlas connection working
- [ ] Groq API key configured
- [ ] Perplexity API key configured
- [ ] Firebase Admin SDK initialized
- [ ] Backend starts without errors
- [ ] Health endpoint returns 200
- [ ] Frontend connects to backend
- [ ] Can login with Firebase
- [ ] Question generation works
- [ ] File upload works
- [ ] Attendance advisor responds

When all items are checked, you're ready to go! 🎉

---

**Need detailed info?** See `SEMESTER_MODULE_README.md`
**Want to know what changed?** See `REFACTOR_COMPLETE.md`
