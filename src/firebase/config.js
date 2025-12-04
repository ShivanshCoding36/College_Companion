import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABMNaTuVifSjZvGdKGGNFbXdC3MFL-6EE",
  authDomain: "lmswebapp-synapslogic.firebaseapp.com",
  databaseURL: "https://lmswebapp-synapslogic-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lmswebapp-synapslogic",
  storageBucket: "lmswebapp-synapslogic.firebasestorage.app",
  messagingSenderId: "117046623268",
  appId: "1:117046623268:web:d6216d1a5f19e441e9acb1",
  measurementId: "G-LFX2TJLJY5"
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const realtimeDb = getDatabase(app);
export const db = getDatabase(app); // Alias for backwards compatibility
export const auth = getAuth(app);
export const firestoreDb = getFirestore(app);

// Configure Google Auth Provider for popup authentication
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Export app
export default app;

/**
 * FIREBASE REALTIME DATABASE STRUCTURE:
 * 
 * rooms/
 *   <roomId>/
 *     metadata/
 *       createdAt: timestamp
 *       createdBy: userId
 *       activeUsers: number
 *     
 *     queue/
 *       <messageId>/
 *         userId: string
 *         username: string
 *         message: string
 *         timestamp: number
 *         status: "pending" | "processing" | "completed"
 *     
 *     messages/
 *       <messageId>/
 *         userId: string
 *         username: string
 *         message: string
 *         response: string (LLM response)
 *         timestamp: number
 *         type: "user" | "assistant"
 *     
 *     typing/
 *       <userId>: boolean
 *     
 *     notes/
 *       <noteId>/
 *         id: string
 *         title: string
 *         content: string
 *         folder: string
 *         author: string
 *         createdAt: number
 *         updatedAt: number
 */
