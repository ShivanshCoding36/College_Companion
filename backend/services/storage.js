import { getFirestore } from '../config/firebaseAdmin.js';

/**
 * Storage helper functions for MongoDB and Firestore
 */

/**
 * Save data to Firestore
 * @param {string} collection - Collection path (e.g., 'users')
 * @param {string} docId - Document ID
 * @param {object} data - Data to save
 * @returns {Promise<void>}
 */
export const saveToFirestore = async (collection, docId, data) => {
  try {
    const db = getFirestore();
    await db.collection(collection).doc(docId).set(data, { merge: true });
    console.log(`✅ Saved to Firestore: ${collection}/${docId}`);
  } catch (error) {
    console.error('❌ Firestore save error:', error.message);
    throw error;
  }
};

/**
 * Get data from Firestore
 * @param {string} collection - Collection path
 * @param {string} docId - Document ID
 * @returns {Promise<object|null>} - Document data or null
 */
export const getFromFirestore = async (collection, docId) => {
  try {
    const db = getFirestore();
    const doc = await db.collection(collection).doc(docId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data();
  } catch (error) {
    console.error('❌ Firestore get error:', error.message);
    throw error;
  }
};

/**
 * Update data in Firestore
 * @param {string} collection - Collection path
 * @param {string} docId - Document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateFirestore = async (collection, docId, updates) => {
  try {
    const db = getFirestore();
    await db.collection(collection).doc(docId).update(updates);
    console.log(`✅ Updated Firestore: ${collection}/${docId}`);
  } catch (error) {
    console.error('❌ Firestore update error:', error.message);
    throw error;
  }
};

/**
 * Save user calendar data to Firestore
 * @param {string} userId - Firebase UID
 * @param {object} calendarData - Calendar JSON
 */
export const saveCalendarData = async (userId, calendarData) => {
  return saveToFirestore('users', userId, { calendarData });
};

/**
 * Save user timetable data to Firestore
 * @param {string} userId - Firebase UID
 * @param {object} timetableData - Timetable JSON
 */
export const saveTimetableData = async (userId, timetableData) => {
  return saveToFirestore('users', userId, { timetableData });
};

/**
 * Save user attendance stats to Firestore
 * @param {string} userId - Firebase UID
 * @param {object} attendanceStats - Attendance statistics
 */
export const saveAttendanceStats = async (userId, attendanceStats) => {
  return saveToFirestore('users', userId, { attendanceStats });
};

/**
 * Get user attendance context from Firestore
 * @param {string} userId - Firebase UID
 * @returns {Promise<object>} - User attendance context
 */
export const getUserAttendanceContext = async (userId) => {
  try {
    const userData = await getFromFirestore('users', userId);
    
    if (!userData) {
      return {
        calendarData: null,
        timetableData: null,
        attendanceStats: null,
        leaveHistory: [],
        absenceTimeline: [],
      };
    }

    return {
      calendarData: userData.calendarData || null,
      timetableData: userData.timetableData || null,
      attendanceStats: userData.attendanceStats || null,
      leaveHistory: userData.leaveHistory || [],
      absenceTimeline: userData.absenceTimeline || [],
    };
  } catch (error) {
    console.error('❌ Error fetching user attendance context:', error.message);
    throw error;
  }
};

export default {
  saveToFirestore,
  getFromFirestore,
  updateFirestore,
  saveCalendarData,
  saveTimetableData,
  saveAttendanceStats,
  getUserAttendanceContext,
};
