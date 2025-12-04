import { useState, useEffect } from "react";
import { listenToRoomNotes } from "@/firebase/roomService";

/**
 * Custom hook to listen to live room notes
 * @param {string} roomCode - Room code to listen to
 * @returns {Object} Notes array with live updates
 */
export const useRoomNotes = (roomCode) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomCode) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = listenToRoomNotes(roomCode, (notesData) => {
        setNotes(notesData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("useRoomNotes error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [roomCode]);

  return { notes, loading, error };
};
