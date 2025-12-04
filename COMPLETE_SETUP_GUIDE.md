# 🚀 MERN Project - Complete Setup Guide

## ✅ All Fixes Implemented

### Backend Fixes (Port 5000)

#### 1. ✅ Created Users API Route
- **File**: `backend/routes/users.js`
- **Endpoints**:
  - `GET /api/users/:id` - Get user by Firebase UID or MongoDB ID
  - `POST /api/users` - Create or update user profile
  - `DELETE /api/users/:id` - Delete user

#### 2. ✅ Created User Model
- **File**: `backend/models/User.js`
- **Schema**: email, name, firebaseUID, photoURL, createdAt, updatedAt
- **Indexes**: firebaseUID and email for fast queries

#### 3. ✅ Essentials API Route (Already Working)
- **File**: `backend/routes/essentialsRoutes.js`
- **Endpoint**: `POST /api/essentials/extract`
- **Features**:
  - Multer file upload (JPG, PNG, PDF, MP4)
  - Perplexity AI integration
  - API Key: `pplx-4ASJYIrWRyjGZ4hCtC7YyQglVRoqS9N7ykdvDRdVCgVwXgtvV`
  - Model: `llama-3.1-sonar-small-128k-online`
  - Base64 file conversion
  - Automatic file cleanup after processing
  - Returns structured JSON with 7 categories

#### 4. ✅ MongoDB Connection
- **Connection String**: `mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/test?retryWrites=true&w=majority&appName=yugen`
- **Database**: `test`
- **Collections**: users, notes, survivalplans

#### 5. ✅ Updated server.js
- Added users route import and mounting
- Updated 404 handler with all available endpoints
- CORS configured for all localhost ports
- Health check endpoint at `/health`

### Frontend Fixes

#### 1. ✅ Fixed AuthContext.jsx
- **Fixed Import**: Changed from `@/firebase/firebaseConfig` to `@/firebase/config`
- **Auto Profile Creation**: When user logs in, automatically creates profile in MongoDB if not exists
- **Profile Fetching**: Correctly handles backend response structure with `data.success` and `data.user`
- **Updated Methods**: `createUserProfile()` now uses correct request format with `firebaseUID`

#### 2. ✅ Firebase Configuration (Already Working)
- **File**: `src/firebase/config.js`
- **Configured**: Firebase Auth, Realtime Database, Firestore
- **API Key**: Valid and active
- **Google Provider**: Configured with popup authentication

#### 3. ✅ SemesterEssentials Component (Already Working)
- **API Call**: Correctly configured to POST to `http://localhost:5000/api/essentials/extract`
- **FormData**: Properly sends file via FormData
- **Response Mapping**: Maps backend response to frontend structure
- **Error Handling**: Shows meaningful error messages
- **UI**: Pixel-perfect design preserved

#### 4. ✅ QuestionGenerator Component (Already Working)
- **Backend**: Uses port 5001 (backend-question-generator)
- **Endpoints**: `/api/questions/generate` and `/api/questions/saveNotes`
- **Fallback**: Tries proxy first, then direct connection
- **UI**: Maintains gradient glow effects and animations

#### 5. ✅ Tab Navigation (Already Fixed)
- **File**: `src/pages/SemesterSurvival/index.jsx`
- **Consistent Styling**: All tabs have uniform height (44px), shadows, and animations
- **Border Radius**: 14px matching component cards

---

## 🎯 Quick Start

### Option 1: Start All Services (Recommended)
```powershell
# Run this in PowerShell from project root
.\start-all.ps1
```

This will open 3 terminal windows:
1. Main Backend (Port 5000)
2. Question Generator Backend (Port 5001)
3. Frontend (Vite Dev Server)

### Option 2: Start Individually

**Terminal 1 - Main Backend:**
```powershell
cd backend
node server.js
```

**Terminal 2 - Question Generator Backend:**
```powershell
cd backend-question-generator
node server.js
```

**Terminal 3 - Frontend:**
```powershell
npm run dev
```

---

## 📡 API Endpoints

### Main Backend (Port 5000)

#### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create/update user profile
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "firebaseUID": "firebase_uid_here",
    "photoURL": "https://example.com/photo.jpg"
  }
  ```
- `DELETE /api/users/:id` - Delete user

#### Essentials
- `POST /api/essentials/extract` - Extract syllabus essentials
  - **Content-Type**: `multipart/form-data`
  - **Field**: `file` (JPG, PNG, PDF, MP4)
  - **Max Size**: 10MB
  - **Response**:
    ```json
    {
      "success": true,
      "essentials": {
        "creative": ["topic1", "topic2"],
        "theory": ["topic1", "topic2"],
        "numerical": ["topic1", "topic2"],
        "twoMarks": ["topic1"],
        "threeMarks": ["topic1"],
        "fourteenMarks": ["topic1"],
        "sixteenMarks": ["topic1"]
      },
      "fileName": "syllabus.jpg"
    }
    ```

#### Survival Plan
- `POST /api/survival-plan/generate` - Generate survival plan
- `GET /api/survival-plan/history` - Get plan history
- `POST /api/survival-plan/saveNotes` - Save notes

### Question Generator Backend (Port 5001)

- `POST /api/questions/generate` - Generate questions
  ```json
  {
    "syllabus": "Your syllabus content here",
    "questionType": "mcq|short-answer|long-answer|..."
  }
  ```
- `GET /api/questions/history` - Get generation history

---

## 🔥 Firebase Configuration

### Authentication
- **Email/Password**: Enabled
- **Google Sign-In**: Enabled with popup
- **Auto Profile Creation**: When user signs in, profile is automatically created in MongoDB

### Login/Register Flow
1. User logs in with email/password or Google
2. AuthContext receives Firebase user
3. Backend checks if user exists in MongoDB
4. If not exists, creates new user profile automatically
5. User profile stored in `userProfile` state

---

## 🗄️ MongoDB Atlas

### Connection Details
- **URI**: `mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/`
- **Database**: `test`
- **Collections**:
  - `users` - User profiles with Firebase UID
  - `notes` - Study notes
  - `survivalplans` - Generated survival plans
  - `questionhistories` - Question generation history

### User Schema
```javascript
{
  email: String (unique),
  name: String,
  firebaseUID: String (unique, indexed),
  photoURL: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI Design (Preserved)

All UI styling has been **preserved exactly**:
- ✅ Gradient glows and animations
- ✅ Border-radius: 14px
- ✅ Padding: 22px/18px
- ✅ Typography: 20px/14px/13px
- ✅ Dashed border upload box
- ✅ Tab button heights: 44px
- ✅ Framer Motion animations
- ✅ Backdrop blur effects
- ✅ Hover states and transitions

---

## 🧪 Testing

### Test Essentials Extraction
1. Start both backends
2. Start frontend
3. Navigate to Semester Survival Kit → Essentials
4. Upload a syllabus image/PDF
5. Click "Extract & Generate"
6. Should see structured topics in 7 categories

### Test Firebase Auth
1. Go to Login/Register page
2. Try Google Sign-In (should open popup)
3. Or register with email/password
4. Check browser console - should see "Profile fetch/create" logs
5. User profile should auto-create in MongoDB

### Test Question Generator
1. Navigate to Semester Survival Kit → Question Generator
2. Paste syllabus content
3. Select question type
4. Click "Generate Questions"
5. Should see AI-generated questions

---

## 🔍 Troubleshooting

### "Failed to extract essentials"
- ✅ Backend running on port 5000? Check with `curl http://localhost:5000/health`
- ✅ File size under 10MB?
- ✅ File type is JPG/PNG/PDF/MP4?

### "Failed to generate questions"
- ✅ Backend running on port 5001? Check terminal
- ✅ Groq API key configured?

### Firebase Errors
- ✅ Check `src/firebase/config.js` has valid API key
- ✅ Firebase project enabled Email/Password and Google auth
- ✅ Check browser console for specific error codes

### MongoDB Connection Failed
- ✅ Check internet connection
- ✅ MongoDB Atlas cluster is active
- ✅ Connection string is correct in `backend/config/db.js`

### CORS Errors
- ✅ Backend CORS configured for localhost:5173, 5174, 5175
- ✅ Check frontend is running on one of these ports

---

## 📦 Dependencies

### Backend (Port 5000)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "mongoose": "^9.0.0",
  "multer": "^1.4.5-lts.1",
  "groq-sdk": "^0.3.3",
  "dotenv": "^16.3.1"
}
```

### Backend-Question-Generator (Port 5001)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "mongoose": "^9.0.0",
  "groq-sdk": "^0.3.3"
}
```

### Frontend
```json
{
  "react": "^19.2.0",
  "firebase": "^12.6.0",
  "framer-motion": "^12.23.25",
  "react-router-dom": "^7.9.6"
}
```

---

## ✅ Verification Checklist

- [x] Main backend starts without errors (Port 5000)
- [x] Question backend starts without errors (Port 5001)
- [x] Frontend starts without errors
- [x] MongoDB connection successful
- [x] Firebase authentication configured
- [x] POST /api/essentials/extract endpoint exists
- [x] GET /api/users/:id endpoint exists
- [x] POST /api/users endpoint exists
- [x] Perplexity API key configured
- [x] UI design preserved (no visual changes)
- [x] No CORS errors
- [x] No 404 errors on API calls
- [x] AuthContext fetches user profile correctly
- [x] Login/Register creates MongoDB user profile
- [x] File upload works in Essentials
- [x] Question Generator connects to backend

---

## 🎉 Success Indicators

When everything is working correctly:
1. ✅ All 3 terminals show "Server running" messages
2. ✅ MongoDB shows "Connected" in backend logs
3. ✅ Frontend loads without console errors
4. ✅ Login/Register creates user in MongoDB
5. ✅ Essentials extraction returns structured JSON
6. ✅ Question Generator produces AI questions
7. ✅ No "Firebase not configured" warnings
8. ✅ No 404 or CORS errors in Network tab

---

## 📝 Notes

- **Perplexity API Key**: Only used in Essentials route, not Question Generator
- **Groq API Key**: Used in Question Generator and Survival Plan
- **Port 5000**: Main backend (essentials, users, survival plan)
- **Port 5001**: Question Generator backend
- **Port 5173**: Frontend (Vite dev server - may vary)
- **UI Changes**: ZERO - All styling preserved exactly as before

---

## 🚀 Ready to Use!

Your MERN project is now fully functional with:
- ✅ Working Firebase authentication
- ✅ MongoDB Atlas integration
- ✅ Perplexity AI essentials extraction
- ✅ Groq AI question generation
- ✅ User profile management
- ✅ No 404 errors
- ✅ No CORS issues
- ✅ Pixel-perfect UI preserved

Run `.\start-all.ps1` and start using the app! 🎊
