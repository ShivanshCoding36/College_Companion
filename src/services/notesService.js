/**
 * MongoDB Notes Service
 * Handles saved notes from ended rooms
 */

const API_BASE_URL = '/api';

/**
 * Save room notes to MongoDB after room ends
 * @param {string} userId - Firebase Auth UID
 * @param {Object} roomData - Exported room data from Firebase
 * @returns {Promise<Object>} Saved notes document
 */
export const saveRoomNotes = async (userId, roomData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        roomCode: roomData.roomCode,
        roomOwner: roomData.ownerName,
        createdAt: roomData.createdAt,
        endedAt: roomData.endedAt,
        members: roomData.members,
        notes: roomData.notes
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save room notes');
    }

    const data = await response.json();
    return data.savedNotes;
  } catch (error) {
    console.error('Save room notes error:', error);
    throw error;
  }
};

/**
 * Get all saved notes for a user
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<Array>} Array of saved note sessions
 */
export const getUserSavedNotes = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch saved notes');
    }

    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error('Get saved notes error:', error);
    throw error;
  }
};

/**
 * Get specific saved notes session
 * @param {string} notesId - MongoDB notes document ID
 * @returns {Promise<Object>} Saved notes session
 */
export const getSavedNotesById = async (notesId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${notesId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch saved notes');
    }

    const data = await response.json();
    return data.notes;
  } catch (error) {
    console.error('Get saved notes by ID error:', error);
    throw error;
  }
};

/**
 * Delete saved notes session
 * @param {string} notesId - MongoDB notes document ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteSavedNotes = async (notesId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${notesId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete saved notes');
    }

    return true;
  } catch (error) {
    console.error('Delete saved notes error:', error);
    throw error;
  }
};

/**
 * Export notes as downloadable text file
 * @param {Object} notesData - Saved notes data
 * @returns {string} Download URL
 */
export const exportNotesAsText = (notesData) => {
  try {
    let content = `Study Room Notes\n`;
    content += `Room Code: ${notesData.roomCode}\n`;
    content += `Created: ${new Date(notesData.createdAt).toLocaleString()}\n`;
    content += `Ended: ${new Date(notesData.endedAt).toLocaleString()}\n`;
    content += `\n--- MEMBERS ---\n`;
    
    if (notesData.members) {
      Object.values(notesData.members).forEach(member => {
        content += `- ${member.name}\n`;
      });
    }

    content += `\n--- NOTES ---\n\n`;
    
    if (notesData.notes && notesData.notes.length > 0) {
      notesData.notes.forEach((note, index) => {
        content += `[${index + 1}] ${note.userName} (${new Date(note.createdAt).toLocaleString()})\n`;
        content += `${note.content}\n\n`;
      });
    } else {
      content += 'No notes in this session.\n';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Export notes error:', error);
    throw new Error('Failed to export notes');
  }
};

/**
 * Download notes as text file
 * @param {Object} notesData - Saved notes data
 */
export const downloadNotesAsText = (notesData) => {
  try {
    const url = exportNotesAsText(notesData);
    const link = document.createElement('a');
    link.href = url;
    link.download = `room-${notesData.roomCode}-notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download notes error:', error);
    throw error;
  }
};

/**
 * Export notes as JSON
 * @param {Object} notesData - Saved notes data
 */
export const downloadNotesAsJSON = (notesData) => {
  try {
    const json = JSON.stringify(notesData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `room-${notesData.roomCode}-notes.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download JSON error:', error);
    throw error;
  }
};
