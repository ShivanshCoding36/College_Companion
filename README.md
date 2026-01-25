<div align="center">

# 🎓 College Companion

**Your AI-Powered Academic Success Platform**

[![GitHub stars](https://img.shields.io/github/stars/Yugenjr/College_Companion?style=social)](https://github.com/Yugenjr/College_Companion/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Yugenjr/College_Companion?style=social)](https://github.com/Yugenjr/College_Companion/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Yugenjr/College_Companion)](https://github.com/Yugenjr/College_Companion/issues)
[![GitHub license](https://img.shields.io/github/license/Yugenjr/College_Companion)](https://github.com/Yugenjr/College_Companion/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Yugenjr/College_Companion/pulls)

[Live Demo](https://mernproj1.vercel.app/) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## 📖 About

College Companion is a comprehensive full-stack MERN application designed to help college students excel academically. Powered by advanced AI technologies, it offers intelligent tools for attendance management, syllabus analysis, question generation, and collaborative studying—all in one platform.

### ✨ Why College Companion?

- **AI-Powered Intelligence** - Leverage Groq, Google Gemini, and Perplexity AI for smart academic assistance
- **Real-Time Collaboration** - Study together with Socket.io-powered study rooms
- **Beautiful UI** - Modern, responsive design with smooth animations
- **All-in-One Solution** - Everything a student needs in a single platform

---

## 🚀 Features

### 🔐 Authentication & Security
- Firebase Authentication with Google Sign-In
- Secure user profiles and session management
- Seamless onboarding experience

### 🤖 AI-Powered Tools

| Feature | Description |
|---------|-------------|
| **Attendance Advisor** | AI-driven attendance tracking with smart predictions and recommendations |
| **Syllabus Essentials** | Extract key topics from syllabus images/PDFs using Perplexity AI |
| **Question Generator** | Generate exam questions automatically using Groq AI |
| **Survival Plan** | Create personalized study plans based on your schedule |

### 👥 Study Arena
- Create and join collaborative study rooms
- Real-time chat and collaboration
- Share room codes with classmates
- Socket.io integration for seamless communication

### 📊 Dashboard
- Personalized academic overview
- Profile management
- Quick access to all tools

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React

</td>
<td valign="top" width="50%">

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** Firebase Auth
- **Real-time:** Socket.io
- **AI/ML:** Groq SDK, Google Gemini, Perplexity AI
- **OCR:** Tesseract.js

</td>
</tr>
</table>

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** account
- **Firebase** project with authentication enabled
- **API Keys:** Groq, Google Gemini, Perplexity

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yugenjr/College_Companion.git
   cd College_Companion
   ```

2. **Install dependencies**
   ```bash
   # Root (Frontend)
   npm install

   # Main Backend
   cd backend
   npm install
   cd ..

   # Question Generator Backend
   cd backend-question-generator
   npm install
   cd ..
   ```

3. **Configure environment variables**

   Create `.env` in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5000
   VITE_QUESTION_API_URL=http://localhost:5001
   ```

   Create `.env` in `backend/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   GOOGLE_API_KEY=your_google_gemini_key
   PORT=5000
   ```

   Create `.env` in `backend-question-generator/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   PORT=5001
   ```

4. **Start all services**

   **Option A - PowerShell Script (Windows):**
   ```powershell
   .\start-all.ps1
   ```

   **Option B - Manual Start:**
   ```bash
   # Terminal 1 - Main Backend
   cd backend
   npm start

   # Terminal 2 - Question Generator Backend
   cd backend-question-generator
   npm start

   # Terminal 3 - Frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Main Backend: `http://localhost:5000`
   - Question Generator: `http://localhost:5001`

---

## 💡 Usage

1. **Sign Up/Login** - Create an account or sign in with Google
2. **Complete Onboarding** - Set up your profile and preferences
3. **Explore Dashboard** - Access all features from the main dashboard
4. **Track Attendance** - Use Attendance Advisor for smart tracking
5. **Extract Essentials** - Upload syllabus to get key topics
6. **Generate Questions** - Create practice questions automatically
7. **Join Study Rooms** - Collaborate with peers in real-time

---

## 📡 API Documentation

### Main Backend (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/:id` | GET | Get user profile |
| `/api/users` | POST | Create/update user |
| `/api/essentials/extract` | POST | Extract syllabus essentials |
| `/api/survival-plan/generate` | POST | Generate study plan |
| `/api/survival-plan/history` | GET | Get plan history |
| `/health` | GET | Health check |

---

## 🧹 Linting & Code Quality

You can also install  
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)  
and  
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)  
for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])

