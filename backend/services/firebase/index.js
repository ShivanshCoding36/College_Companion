import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-admin-sdk.json';
    const fullPath = join(__dirname, '../../', serviceAccountPath);
    
    // Check if the file exists
    if (!existsSync(fullPath)) {
      throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(
      readFileSync(fullPath, 'utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
    return db;
  } catch (error) {
    // Don't log the full error stack, just the message
    throw new Error(error.message);
  }
};

/**
 * Get Firestore database instance
 */
export const getDb = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
};

/**
 * Save parsed data to Firestore
 * @param {string} userId - User ID
 * @param {string} type - Data type ('calendarData' or 'timetableData')
 * @param {Object} data - Parsed JSON data
 */
export const saveParsedData = async (userId, type, data) => {
  try {
    const db = getDb();
    await db.collection('users').doc(userId).set({
      [type]: data,
      [`${type}UpdatedAt`]: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Saved ${type} for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error saving ${type}:`, error.message);
    throw error;
  }
};

/**
 * Get user's complete data from Firestore
 * @param {string} userId - User ID
 */
export const getUserData = async (userId) => {
  try {
    const db = getDb();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return {
        calendarData: null,
        timetableData: null,
        attendanceStats: null,
        leaveHistory: [],
        absenceTimeline: []
      };
    }

    const data = userDoc.data();
    return {
      calendarData: data.calendarData || null,
      timetableData: data.timetableData || null,
      attendanceStats: data.attendanceStats || null,
      leaveHistory: data.leaveHistory || [],
      absenceTimeline: data.absenceTimeline || []
    };
  } catch (error) {
    console.error('❌ Error fetching user data:', error.message);
    throw error;
  }
};

/**
 * Save attendance stats to Firestore
 * @param {string} userId - User ID
 * @param {Object} stats - Attendance statistics
 */
export const saveAttendanceStats = async (userId, stats) => {
  try {
    const db = getDb();
    await db.collection('users').doc(userId).set({
      attendanceStats: stats,
      attendanceStatsUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('❌ Error saving attendance stats:', error.message);
    throw error;
  }
};

export default admin;
