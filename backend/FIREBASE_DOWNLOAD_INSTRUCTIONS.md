# 🔥 Download Firebase Admin Service Account - Step by Step

## Your Firebase Project Details
- **Project ID:** `lmswebapp-synapslogic`
- **Database URL:** `https://lmswebapp-synapslogic-default-rtdb.asia-southeast1.firebasedatabase.app`

---

## 📥 Steps to Download Service Account JSON

### 1. Go to Firebase Console
Open this URL in your browser:
```
https://console.firebase.google.com/project/lmswebapp-synapslogic/settings/serviceaccounts/adminsdk
```

### 2. Navigate to Service Accounts
If the direct link doesn't work:
1. Go to https://console.firebase.google.com/
2. Click on your project: **lmswebapp-synapslogic**
3. Click the ⚙️ **Settings** icon (top left)
4. Select **Project settings**
5. Click **Service accounts** tab

### 3. Generate Private Key
1. You should see "Firebase Admin SDK" section
2. Click **Generate new private key** button
3. A popup will appear - Click **Generate key**
4. A JSON file will download (something like `lmswebapp-synapslogic-firebase-adminsdk-xxxxx.json`)

### 4. Save the File
1. Rename the downloaded file to: **`firebase-admin-sdk.json`**
2. Move it to: **`C:\Users\Yugendra\mernproj1\backend\`**

---

## ✅ Verify Setup

After saving the file, run this command to verify:

```powershell
cd C:\Users\Yugendra\mernproj1\backend
if (Test-Path "firebase-admin-sdk.json") { 
    Write-Host "✅ Firebase SDK file found!" -ForegroundColor Green 
} else { 
    Write-Host "❌ File not found. Please place it in backend folder" -ForegroundColor Red 
}
```

---

## 🚀 Then Restart Backend

```powershell
# Stop any running Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start backend
cd C:\Users\Yugendra\mernproj1\backend
npm start
```

Expected output:
```
✅ MongoDB Connected
✅ Firebase Admin SDK initialized
📦 Project: lmswebapp-synapslogic
✅ Groq client initialized
✅ Server running on port 5000
```

---

## 🔒 IMPORTANT: Add to .gitignore

After downloading, make sure the file is NOT committed to Git:

```powershell
cd C:\Users\Yugendra\mernproj1\backend
Add-Content -Path .gitignore -Value "`nfirebase-admin-sdk.json"
```

This prevents accidentally exposing your private key.

---

## ❓ Can't Access Firebase Console?

If you don't have access to Firebase Console, ask the project owner/admin to:
1. Add you as an **Owner** or **Editor** in Firebase Console
2. Or send you their `firebase-admin-sdk.json` file (via secure method)

---

## 🎯 What This Enables

Once configured, your backend will be able to:
- ✅ Verify Firebase ID tokens from frontend
- ✅ Authenticate users on all protected API routes
- ✅ Store user data in MongoDB with Firebase UID
- ✅ Secure all AI features (questions, survival plans, notes, etc.)

---

## Need Help?

If you encounter any issues:
1. Check file location: `C:\Users\Yugendra\mernproj1\backend\firebase-admin-sdk.json`
2. Verify file is valid JSON (open in text editor)
3. Check .env has correct path: `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-sdk.json`
4. Restart backend after placing file
