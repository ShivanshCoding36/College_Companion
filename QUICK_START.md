# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Internet connection (for MongoDB Atlas & APIs)

## Start Backend (Terminal 1)
```powershell
cd backend
node server.js
```

Wait for:
```
✅ MongoDB Connected
✅ Groq API initialized
✅ Server running on port 5000
```

## Start Frontend (Terminal 2)
```powershell
# From project root
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

## Test Semester Essentials

1. Open browser: http://localhost:5173
2. Login/Register with Firebase
3. Navigate to: **Semester Survival** → **Semester Essentials** tab
4. Upload a syllabus image/PDF/video
5. Click: **Extract Syllabus & Generate Essentials**
6. View extracted topics in beautiful accordion UI

## Verify Everything Works

### Backend Health:
```powershell
curl http://localhost:5000/health
```

### Test API:
```powershell
cd backend
node test-all-endpoints.js
```

## Troubleshooting

### Port 5000 already in use:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend can't connect:
- Ensure backend is running on port 5000
- Check console for errors
- Clear browser cache

### File upload fails:
- File must be < 10MB
- Supported: JPG, PNG, PDF, MP4
- Check backend console for errors

## What's Fixed

✅ All backend routes working  
✅ No 404 errors  
✅ Firebase auth configured  
✅ MongoDB connected  
✅ Perplexity API integrated  
✅ UI design preserved (zero styling changes)  

See `FIXES_COMPLETE.md` for full details.
