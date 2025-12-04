import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export app for any additional configuration
export default app;
