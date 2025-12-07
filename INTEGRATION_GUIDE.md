# MERN Backend & Frontend Integration - Implementation Guide

## Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/?retryWrites=true&w=majority&appName=yugen

# AI APIs
GROQ_API_KEY=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
PPLX_API_KEY=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
PPLX_FALLBACK_KEY=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

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-sdk.json
RTDB_URL=https://your-project.firebaseio.com

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

## Database Schema

### User Document (_id = Firebase UID)
```javascript
{
  _id: "<firebaseUid>",
  profile: {
    name: String,
    email: String,
    college: String,
    degree: String,
    age: Number,
    semester: Number,
    homeDistance: String,
    residenceType: String,
    hobbies: [String]
  },
  settings: {
    darkMode: Boolean,
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    },
    language: String
  },
  savedChats: [],
  notes: [],
  questionHistory: [],
  survivalPlans: [],
  essentials: [],
  revisionPlans: [],
  attendanceQueries: [],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
All protected routes require: `Authorization: Bearer <firebase_id_token>`

### User Management
- `POST /api/users/create` - Create user record
- `GET /api/users/:uid` - Get user document
- `PUT /api/users/:uid/updateSection` - Update specific section
  ```json
  {
    "section": "notes|essentials|questionHistory|...",
    "data": { }
  }
  ```

### Question Generator
- `POST /api/questions/generate`
  ```json
  {
    "uid": "firebase_uid",
    "syllabus": "Course syllabus content",
    "questionType": "MCQ|Short|Long"
  }
  ```
  Response saved to `users[uid].questionHistory`

### Survival Plan
- `POST /api/survival/generate`
  ```json
  {
    "uid": "firebase_uid",
    "skills": "Programming, Mathematics",
    "stressLevel": "Medium",
    "timeAvailable": "4 hours/day",
    "examDates": "2025-01-15",
    "goals": "Score 85%+"
  }
  ```
  Response saved to `users[uid].survivalPlans`

### Attendance Advisor
- `POST /api/attendance/query`
  ```json
  {
    "uid": "firebase_uid",
    "question": "How many classes do I need?",
    "attendanceData": {
      "present": 45,
      "total": 60
    }
  }
  ```
  Response saved to `users[uid].attendanceQueries`

### Essentials Extractor
- `POST /api/essentials/extract` (multipart/form-data)
  - Headers: `Authorization: Bearer <token>`
  - Fields: `file` (PDF/JPG/PNG/MP4)
  - Uses PPLX_API_KEY (fallback to PPLX_FALLBACK_KEY)
  - Returns structured JSON saved to `users[uid].essentials`

### Revision Strategy
- `POST /api/revision/generate`
  ```json
  {
    "uid": "firebase_uid",
    "syllabusText": "Full syllabus",
    "preferences": {
      "studyHours": 5,
      "difficulty": "medium"
    }
  }
  ```
  Response saved to `users[uid].revisionPlans`

### Doubt Solver
- `POST /api/doubt/ask`
  ```json
  {
    "uid": "firebase_uid",
    "question": "Explain Newton's laws",
    "context": "Physics chapter 2"
  }
  ```
  Response saved to `users[uid].savedChats`

### Notes CRUD
- `POST /api/notes` - Create note
- `GET /api/notes?uid=<uid>` - Get all notes
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Testing with curl

### Create User
```bash
curl -X POST http://localhost:5000/api/users/create \
  -H "Authorization: Bearer <firebase_id_token>" \
  -H "Content-Type: application/json"
```

### Generate Questions
```bash
curl -X POST http://localhost:5000/api/questions/generate \
  -H "Authorization: Bearer <firebase_id_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user123",
    "syllabus": "Data Structures: Arrays, Linked Lists, Trees",
    "questionType": "MCQ"
  }'
```

### Upload for Essentials
```bash
curl -X POST http://localhost:5000/api/essentials/extract \
  -H "Authorization: Bearer <firebase_id_token>" \
  -F "file=@/path/to/document.pdf"
```

### Attendance Query
```bash
curl -X POST http://localhost:5000/api/attendance/query \
  -H "Authorization: Bearer <firebase_id_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user123",
    "question": "How many classes needed for 75%?",
    "attendanceData": {
      "present": 45,
      "total": 60
    }
  }'
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
npm install
npm run dev
```

## Frontend Integration

All frontend components must:
1. Get Firebase ID token: `await user.getIdToken()`
2. Include in requests: `headers: { 'Authorization': \`Bearer \${token}\` }`
3. Handle 401 errors (redirect to login)
4. Load user data on mount: `GET /api/users/:uid`

### Example Frontend Hook
```javascript
const useProtectedAPI = () => {
  const { user } = useAuth();
  
  const callAPI = async (endpoint, options = {}) => {
    const token = await user.getIdToken();
    const response = await fetch(\`http://localhost:5000\${endpoint}\`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  };
  
  return { callAPI };
};
```

## Security Features

1. **Firebase Token Verification**: All protected routes verify token with Firebase Admin SDK
2. **User Isolation**: All data stored per-user using Firebase UID as document ID
3. **File Validation**: Upload middleware validates file types and sizes
4. **Error Handling**: Structured error responses with codes (400/401/500)
5. **Rate Limiting**: (TODO: Add express-rate-limit)
6. **Request Logging**: All failed AI calls logged with unique request IDs

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Upload Firebase service account JSON
- [ ] Whitelist IP address in MongoDB Atlas
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy for MongoDB
- [ ] Test all endpoints with production keys

## Error Codes

- `400`: Bad request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `404`: Resource not found
- `500`: Internal server error

## Support

For issues:
1. Check backend logs for detailed error messages
2. Verify Firebase token is valid and not expired
3. Confirm MongoDB connection is active
4. Test API keys with curl commands above
