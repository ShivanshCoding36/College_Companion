# Authentication API Documentation

## MongoDB Backend API Endpoints Required

This document outlines the Express + MongoDB API endpoints needed to support the Firebase Authentication flow in the MERN app.

---

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. **Create User Profile**

**Endpoint:** `POST /users`

**Description:** Creates a new user profile in MongoDB after Firebase authentication is successful.

**Request Body:**
```json
{
  "userId": "firebase_uid_string",
  "fullName": "John Doe",
  "email": "john@example.com",
  "collegeName": "MIT College of Engineering",
  "degree": "B.Tech Computer Science",
  "age": 20
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "User profile created successfully",
  "user": {
    "_id": "mongodb_object_id",
    "userId": "firebase_uid_string",
    "fullName": "John Doe",
    "email": "john@example.com",
    "collegeName": "MIT College of Engineering",
    "degree": "B.Tech Computer Science",
    "age": 20,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required fields: fullName, email"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "success": false,
  "message": "User profile already exists"
}
```

**MongoDB Schema:**
```javascript
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Firebase UID
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  degree: { type: String, required: true },
  age: { type: Number, required: true, min: 16, max: 100 }
}, { timestamps: true });
```

---

### 2. **Get User Profile**

**Endpoint:** `GET /users/:userId`

**Description:** Retrieves a user's profile from MongoDB using their Firebase UID.

**URL Parameters:**
- `userId` (required): Firebase authentication UID

**Example:** `GET /users/abc123firebase456uid`

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "mongodb_object_id",
    "userId": "abc123firebase456uid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "collegeName": "MIT College of Engineering",
    "degree": "B.Tech Computer Science",
    "age": 20,
    "onboarding": {
      "semester": 4,
      "difficultSubject": "Data Structures",
      "studyStyle": "mixed",
      "studyHours": 5,
      "hobbies": "Gaming, Reading, Coding",
      "location": "Mumbai",
      "aiPreference": true,
      "goal": "placement-prep",
      "completedAt": "2024-01-15T11:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "success": false,
  "message": "User profile not found"
}
```

---

### 3. **Save Onboarding Data**

**Endpoint:** `POST /users/:userId/onboarding`

**Description:** Saves onboarding questionnaire responses for a user.

**URL Parameters:**
- `userId` (required): Firebase authentication UID

**Request Body:**
```json
{
  "semester": 4,
  "difficultSubject": "Data Structures",
  "studyStyle": "mixed",
  "studyHours": 5,
  "hobbies": "Gaming, Reading, Coding",
  "location": "Mumbai",
  "aiPreference": true,
  "goal": "placement-prep"
}
```

**Field Validations:**
- `semester`: Number (1-8)
- `difficultSubject`: String (non-empty)
- `studyStyle`: Enum ["solo", "group", "mixed"]
- `studyHours`: Number (0-24)
- `hobbies`: String (non-empty)
- `location`: String (non-empty)
- `aiPreference`: Boolean
- `goal`: Enum ["semester-survival", "placement-prep", "project-building", "general-learning"]

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Onboarding data saved successfully",
  "user": {
    "_id": "mongodb_object_id",
    "userId": "abc123firebase456uid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "collegeName": "MIT College of Engineering",
    "degree": "B.Tech Computer Science",
    "age": 20,
    "onboarding": {
      "semester": 4,
      "difficultSubject": "Data Structures",
      "studyStyle": "mixed",
      "studyHours": 5,
      "hobbies": "Gaming, Reading, Coding",
      "location": "Mumbai",
      "aiPreference": true,
      "goal": "placement-prep",
      "completedAt": "2024-01-15T11:00:00.000Z"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "success": false,
  "message": "User profile not found"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid onboarding data: semester must be between 1 and 8"
}
```

**MongoDB Schema Update:**
```javascript
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  degree: { type: String, required: true },
  age: { type: Number, required: true, min: 16, max: 100 },
  onboarding: {
    semester: { type: Number, min: 1, max: 8 },
    difficultSubject: { type: String },
    studyStyle: { 
      type: String, 
      enum: ["solo", "group", "mixed"]
    },
    studyHours: { type: Number, min: 0, max: 24 },
    hobbies: { type: String },
    location: { type: String },
    aiPreference: { type: Boolean },
    goal: { 
      type: String, 
      enum: ["semester-survival", "placement-prep", "project-building", "general-learning"]
    },
    completedAt: { type: Date }
  }
}, { timestamps: true });
```

---

## Express Router Implementation Example

```javascript
// server/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users - Create user profile
router.post('/', async (req, res) => {
  try {
    const { userId, fullName, email, collegeName, degree, age } = req.body;

    // Validation
    if (!userId || !fullName || !email || !collegeName || !degree || !age) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User profile already exists'
      });
    }

    // Create new user
    const newUser = new User({
      userId,
      fullName,
      email: email.toLowerCase(),
      collegeName,
      degree,
      age: parseInt(age)
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user profile'
    });
  }
});

// GET /api/users/:userId - Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
});

// POST /api/users/:userId/onboarding - Save onboarding data
router.post('/:userId/onboarding', async (req, res) => {
  try {
    const { userId } = req.params;
    const { semester, difficultSubject, studyStyle, studyHours, hobbies, location, aiPreference, goal } = req.body;

    // Find user
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Validation
    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester: must be between 1 and 8'
      });
    }

    if (studyHours < 0 || studyHours > 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study hours: must be between 0 and 24'
      });
    }

    // Update onboarding data
    user.onboarding = {
      semester: parseInt(semester),
      difficultSubject,
      studyStyle,
      studyHours: parseInt(studyHours),
      hobbies,
      location,
      aiPreference,
      goal,
      completedAt: new Date()
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Onboarding data saved successfully',
      user
    });
  } catch (error) {
    console.error('Save onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving onboarding data'
    });
  }
});

module.exports = router;
```

---

## Usage in Frontend (Already Implemented in AuthContext)

```javascript
// Create user profile
const createUserProfile = async (userId, profileData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...profileData })
  });

  if (!response.ok) {
    throw new Error('Failed to create user profile');
  }

  return await response.json();
};

// Get user profile
const getUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.user;
};

// Save onboarding data
const saveOnboarding = async (userId, onboardingData) => {
  const response = await fetch(`/api/users/${userId}/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(onboardingData)
  });

  if (!response.ok) {
    throw new Error('Failed to save onboarding data');
  }

  return await response.json();
};
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install express mongoose cors dotenv
```

### 2. Create User Model
```javascript
// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  degree: { type: String, required: true },
  age: { type: Number, required: true, min: 16, max: 100 },
  onboarding: {
    semester: { type: Number, min: 1, max: 8 },
    difficultSubject: { type: String },
    studyStyle: { 
      type: String, 
      enum: ["solo", "group", "mixed"]
    },
    studyHours: { type: Number, min: 0, max: 24 },
    hobbies: { type: String },
    location: { type: String },
    aiPreference: { type: Boolean },
    goal: { 
      type: String, 
      enum: ["semester-survival", "placement-prep", "project-building", "general-learning"]
    },
    completedAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

### 3. Configure Express Server
```javascript
// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Environment Variables
```env
# server/.env
MONGODB_URI=mongodb://localhost:27017/mern_educompanion
PORT=5000
```

---

## Testing the API

### Create User Profile
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_firebase_uid_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "collegeName": "MIT College",
    "degree": "B.Tech CSE",
    "age": 20
  }'
```

### Get User Profile
```bash
curl http://localhost:5000/api/users/test_firebase_uid_123
```

### Save Onboarding Data
```bash
curl -X POST http://localhost:5000/api/users/test_firebase_uid_123/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "semester": 4,
    "difficultSubject": "Data Structures",
    "studyStyle": "mixed",
    "studyHours": 5,
    "hobbies": "Gaming, Reading",
    "location": "Mumbai",
    "aiPreference": true,
    "goal": "placement-prep"
  }'
```

---

## Frontend Integration Flow

1. **Registration Flow:**
   - User fills Register form → Firebase creates auth user
   - Get Firebase UID → Call `POST /api/users` with profile data
   - Navigate to `/onboarding`

2. **Onboarding Flow:**
   - User answers 8 questions → Call `POST /api/users/:userId/onboarding`
   - Navigate to `/dashboard`

3. **Login Flow:**
   - User logs in with Firebase → Get Firebase UID
   - AuthContext automatically calls `GET /api/users/:userId`
   - Loads userProfile into context state
   - Navigate to `/dashboard`

4. **Google Sign-In Flow:**
   - User clicks "Sign in with Google" → Firebase authenticates
   - Call `GET /api/users/:userId` to check if profile exists
   - If exists → Navigate to `/dashboard`
   - If not exists → Navigate to `/register` with pre-filled data
