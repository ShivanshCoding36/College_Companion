import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firestoreDb;

const resolveServiceAccountPath = () => {
  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'serviceAccount.json';

  const candidatePaths = [
    path.resolve(configuredPath),
    path.resolve(process.cwd(), configuredPath),
    path.resolve(__dirname, '../../', configuredPath),
    path.resolve(__dirname, '../../config', configuredPath),
    path.resolve(__dirname, '../../firebase-admin-sdk.json'),
    path.resolve(process.cwd(), 'firebase-admin-sdk.json')
  ];

  const existingPath = candidatePaths.find((candidate) => existsSync(candidate));

  if (!existingPath) {
    throw new Error(
      `Firebase service account file not found. Checked paths: ${candidatePaths.join(', ')}`
    );
  }

  return existingPath;
};

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  try {
    if (admin.apps.length) {
      firestoreDb = admin.firestore();
      return { app: admin.app(), db: firestoreDb, auth: admin.auth() };
    }

    const credentialPath = resolveServiceAccountPath();
    const serviceAccount = JSON.parse(readFileSync(credentialPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firestoreDb = admin.firestore();
    console.log(`✅ Firebase initialized using ${credentialPath}`);

    return { app: admin.app(), db: firestoreDb, auth: admin.auth() };
  } catch (error) {
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
};

/**
 * Get Firestore database instance
 */
export const getDb = () => {
  if (!admin.apps.length) {
    initializeFirebase();
  }

  if (!firestoreDb) {
    firestoreDb = admin.firestore();
  }

  return firestoreDb;
};

export const getAuth = () => {
  if (!admin.apps.length) {
    initializeFirebase();
  }
  return admin.auth();
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
