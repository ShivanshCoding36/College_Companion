import { ref, set, get, push, update, remove, onValue, off, child } from "firebase/database";
import { db } from "./config";

/**
 * Generate a unique room ID using Firebase push
 * @returns {string} Room ID
 */
const generateRoomId = () => {
  return push(ref(db, "rooms")).key;
};

/**
 * 1. CREATE ROOM FUNCTION
 * Creates a new room with the user as owner and first member
 * @param {string} userId - Firebase Auth UID
 * @param {string} userName - User's display name
 * @returns {Promise<{roomId: string}>}
 */
export const createRoom = async (userId, userName) => {
  try {
    const roomId = generateRoomId();
    const roomRef = ref(db, `rooms/${roomId}`);

    const roomData = {
      ownerId: userId,
      createdAt: Date.now(),
      isActive: true,
      memberLimit: 5,
      members: {
        [userId]: {
          name: userName,
          joinedAt: Date.now()
        }
      }
    };

    await set(roomRef, roomData);
    return { roomId };
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
};

/**
 * 2. JOIN ROOM FUNCTION
 * Allows a user to join an existing room with validation
 * @param {string} roomId - Room ID to join
 * @param {string} userId - Firebase Auth UID
 * @param {string} userName - User's display name
 * @returns {Promise<void>}
 */
export const joinRoom = async (roomId, userId, userName) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    // Check if room exists
    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    const roomData = snapshot.val();

    // Check if room is active
    if (!roomData.isActive) {
      throw new Error("This room has ended");
    }

    // Check if user already in room
    if (roomData.members && roomData.members[userId]) {
      throw new Error("You are already in this room");
    }

    // Count current members
    const memberCount = roomData.members ? Object.keys(roomData.members).length : 0;
    if (memberCount >= 5) {
      throw new Error("Room is full (maximum 5 members)");
    }

    // Add user to room
    const memberRef = ref(db, `rooms/${roomId}/members/${userId}`);
    await set(memberRef, {
      name: userName,
      joinedAt: Date.now()
    });

    return { success: true };
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

/**
 * 3. LEAVE ROOM FUNCTION
 * Removes user from room. If owner leaves, room stays active (must use endRoom)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID leaving
 * @returns {Promise<void>}
 */
export const leaveRoom = async (roomId, userId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    const roomData = snapshot.val();

    // If owner is leaving, they must use endRoom instead
    if (roomData.ownerId === userId) {
      throw new Error("Room owner must use 'End Room' button");
    }

    // Remove user from members
    const memberRef = ref(db, `rooms/${roomId}/members/${userId}`);
    await remove(memberRef);

    return { success: true };
  } catch (error) {
    console.error("Error leaving room:", error);
    throw error;
  }
};

/**
 * 4. END ROOM FUNCTION (OWNER ONLY)
 * Ends the room, removes all members, sets inactive
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID (must be owner)
 * @returns {Promise<void>}
 */
export const endRoom = async (roomId, userId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    const roomData = snapshot.val();

    // Verify user is owner
    if (roomData.ownerId !== userId) {
      throw new Error("Only the room owner can end the room");
    }

    // Set room inactive and remove all members
    await update(roomRef, {
      isActive: false,
      members: null,
      endedAt: Date.now()
    });

    return { success: true };
  } catch (error) {
    console.error("Error ending room:", error);
    throw error;
  }
};

/**
 * GET ROOM DATA
 * Fetches complete room data
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
export const getRoomData = async (roomId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      roomId,
      ...snapshot.val()
    };
  } catch (error) {
    console.error("Error getting room data:", error);
    throw error;
  }
};

/**
 * GET MEMBERS
 * Fetches current room members
 * @param {string} roomId - Room ID
 * @returns {Promise<Array>}
 */
export const getMembers = async (roomId) => {
  try {
    const membersRef = ref(db, `rooms/${roomId}/members`);
    const snapshot = await get(membersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const membersData = snapshot.val();
    return Object.keys(membersData).map(userId => ({
      id: userId,
      ...membersData[userId]
    }));
  } catch (error) {
    console.error("Error getting members:", error);
    throw error;
  }
};

/**
 * LISTEN TO ROOM CHANGES
 * Real-time listener for room data
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function(roomData)
 * @returns {Function} Unsubscribe function
 */
export const listenToRoom = (roomId, callback) => {
  const roomRef = ref(db, `rooms/${roomId}`);
  
  const listener = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        roomId,
        ...snapshot.val()
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to room:", error);
    callback(null);
  });

  // Return unsubscribe function
  return () => off(roomRef, "value", listener);
};

/**
 * LISTEN TO MEMBERS
 * Real-time listener for room members
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function(members[])
 * @returns {Function} Unsubscribe function
 */
export const listenToMembers = (roomId, callback) => {
  const membersRef = ref(db, `rooms/${roomId}/members`);
  
  const listener = onValue(membersRef, (snapshot) => {
    if (snapshot.exists()) {
      const membersData = snapshot.val();
      const membersArray = Object.keys(membersData).map(userId => ({
        id: userId,
        ...membersData[userId]
      }));
      callback(membersArray);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error listening to members:", error);
    callback([]);
  });

  // Return unsubscribe function
  return () => off(membersRef, "value", listener);
};

/**
 * DELETE ROOM
 * Permanently deletes a room (owner only)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID (must be owner)
 * @returns {Promise<void>}
 */
export const deleteRoom = async (roomId, userId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    const roomData = snapshot.val();

    // Verify user is owner
    if (roomData.ownerId !== userId) {
      throw new Error("Only the room owner can delete the room");
    }

    await remove(roomRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

/**
 * GET USER'S ACTIVE ROOMS
 * Fetches all active rooms where user is a member
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export const getUserRooms = async (userId) => {
  try {
    const roomsRef = ref(db, 'rooms');
    const snapshot = await get(roomsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const allRooms = snapshot.val();
    const userRooms = [];

    Object.keys(allRooms).forEach(roomId => {
      const room = allRooms[roomId];
      if (room.isActive && room.members && room.members[userId]) {
        userRooms.push({
          roomId,
          ...room
        });
      }
    });

    return userRooms;
  } catch (error) {
    console.error("Error getting user rooms:", error);
    throw error;
  }
};
