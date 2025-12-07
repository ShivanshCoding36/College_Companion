# 🚀 Profile Module - Quick Start Guide

## ✅ Implementation Status: 100% COMPLETE

All backend and frontend code has been implemented. The Profile Module is ready for testing!

---

## 📋 What's Been Done

### Backend ✅
- [x] **UserProfile Model** - Complete schema with all fields
- [x] **Profile Controller** - 5 methods (get, update, updateSettings, uploadAvatar, delete)
- [x] **Profile Routes** - All endpoints secured with Firebase Auth
- [x] **Server Integration** - Routes mounted, static file serving enabled

### Frontend ✅
- [x] **Profile Page** - Complete UI with forms, settings, avatar upload
- [x] **API Service** - 5 authenticated API methods
- [x] **Routing** - Profile page accessible at `/profile`
- [x] **Logout** - Clean logout with redirect

---

## 🎯 Next Steps: Configure & Test

### Step 1: Configure Environment Variables

Create `backend/.env` file:

```bash
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db-name

# Groq API Key (for AI features)
GROQ_API_KEY=your_groq_api_key_here

# Perplexity API Key (for file extraction)
PPLX_API_KEY=your_perplexity_api_key_here

# Firebase Admin SDK (place serviceAccountKey.json in backend/config/)
# OR use environment variables:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Optional
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Step 2: Whitelist IP in MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Add Current IP Address" or "Allow Access from Anywhere" (for testing)
4. Save

### Step 3: Install Dependencies (if not already done)

```powershell
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ..
npm install
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

### Step 5: Test the Profile Module

1. **Access Application**: http://localhost:5173
2. **Login** with your Firebase account
3. **Navigate to Profile**: Click "Profile" in sidebar or go to `/profile`
4. **Verify Auto-Creation**: Profile should load (empty on first access)
5. **Test Profile Update**:
   - Fill in name, phone, department, year, section, registerNumber
   - Add subjects using "+ Add Subject"
   - Select semester
   - Click "Save Profile"
   - Verify success message
6. **Test Avatar Upload**:
   - Click camera icon on avatar
   - Select image (JPEG/PNG/WebP, max 5MB)
   - Verify avatar updates
7. **Test Settings**:
   - Toggle dark mode
   - Change notification preferences
   - Select different language
   - Verify auto-save messages
8. **Test Logout**:
   - Click "Logout" button
   - Verify redirect to login page
9. **Test Persistence**:
   - Login again
   - Navigate to profile
   - Verify all data persists

---

## 🧪 API Testing (Optional)

### Get Firebase Token

In browser console (after login):
```javascript
firebase.auth().currentUser.getIdToken().then(t => console.log(t))
```

### Test Endpoints with PowerShell

Edit `test-profile-api.ps1` and replace `YOUR_FIREBASE_TOKEN`, then run:
```powershell
.\test-profile-api.ps1
```

Or use Postman with these endpoints:

**1. Get Profile**
```
GET http://localhost:5000/api/profile/me
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

**2. Update Profile**
```
PUT http://localhost:5000/api/profile/update
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "name": "Test User",
  "phone": "+1234567890",
  "department": "Computer Science",
  "year": "3rd Year",
  "section": "A",
  "semester": 5
}
```

**3. Update Settings**
```
PUT http://localhost:5000/api/profile/settings
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "darkMode": true,
  "language": "hi"
}
```

**4. Upload Avatar**
```
POST http://localhost:5000/api/profile/avatar
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: multipart/form-data

[Form Data]
avatar: [Select image file]
```

---

## 📁 File Locations

### Backend Files
- `backend/models/UserProfile.js` - Database schema
- `backend/controllers/profileController.js` - Business logic
- `backend/routes/profile.js` - API endpoints
- `backend/uploads/avatars/` - Avatar storage (auto-created)

### Frontend Files
- `src/pages/Profile/index.jsx` - Profile page UI
- `src/services/api.js` - API methods
- `src/App.tsx` - Routing

### Documentation
- `PROFILE_MODULE_COMPLETE.md` - Complete technical documentation
- `PROFILE_IMPLEMENTATION_COMPLETE.md` - Implementation summary
- `test-profile-api.ps1` - API testing script
- `PROFILE_QUICK_START.md` - This file

---

## 🔍 Troubleshooting

### Backend Won't Start

**MongoDB Connection Error:**
```
❌ MongoDB Connection Error: Could not connect to any servers...
```
**Solution:** 
- Verify MONGO_URI in `.env`
- Whitelist IP in MongoDB Atlas
- Check internet connection

**Missing Dependencies:**
```
❌ Cannot find module 'form-data'
```
**Solution:**
```powershell
cd backend
npm install form-data node-fetch
```

### Frontend Errors

**401 Unauthorized:**
```
❌ Failed to load profile: Request failed: 401
```
**Solution:**
- Verify user is logged in
- Check Firebase token is being sent
- Verify Firebase Admin SDK is initialized

**CORS Error:**
```
❌ Access blocked by CORS policy
```
**Solution:**
- Verify frontend URL in ALLOWED_ORIGINS (backend/.env)
- Default: http://localhost:5173

**Avatar Upload Failed:**
```
❌ File size must be less than 5MB
```
**Solution:**
- Use smaller image file
- Use JPEG/PNG/WebP formats only

---

## 📊 Feature Checklist

Test all features to ensure everything works:

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Login works
- [ ] Navigate to /profile
- [ ] Profile auto-loads (empty on first access)
- [ ] Fill and save profile form
- [ ] Add/remove subjects
- [ ] Upload avatar
- [ ] Toggle dark mode
- [ ] Change notification settings
- [ ] Change language
- [ ] Logout redirects to login
- [ ] Login again and verify data persists
- [ ] API endpoints respond correctly (Postman test)

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Backend console shows: `✅ Server running on port 5000`  
✅ Frontend loads without errors  
✅ Profile page shows your data  
✅ Avatar uploads successfully  
✅ Settings save with "Settings updated!" message  
✅ Logout redirects to login page  
✅ Data persists across sessions  

---

## 📞 Need Help?

### Common Issues

1. **Port already in use:**
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Clear node modules and reinstall:**
   ```powershell
   cd backend
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

3. **Check backend logs:**
   - Look for errors in terminal where backend is running
   - Check MongoDB connection status
   - Verify Firebase initialization

4. **Check frontend console:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

### Verification Commands

**Check if backend is running:**
```powershell
curl http://localhost:5000/health
```

**Check if MongoDB is connected:**
- Look for: `✅ MongoDB Connected Successfully!` in backend console

**Check if Firebase is initialized:**
- Look for: `✅ Firebase Admin SDK initialized successfully` in backend console

---

## 🚀 Ready to Launch!

Once environment is configured:

1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Login and test Profile module
4. Enjoy your fully functional Profile system! 🎊

---

**Status:** ✅ READY FOR TESTING  
**Last Updated:** December 5, 2025  
**Module:** Profile Management System
