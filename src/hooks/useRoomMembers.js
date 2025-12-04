import { useState, useEffect } from "react";
import { listenToMembers } from "@/firebase/roomService";

/**
 * 7. REAL-TIME MEMBER LIST HOOK
 * Listens to room members and updates in real-time
 * @param {string} roomId - Room ID
 * @returns {{members: Array, loading: boolean, error: string}}
 */
export const useRoomMembers = (roomId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Start listening to members
    const unsubscribe = listenToMembers(roomId, (membersData) => {
      setMembers(membersData);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId]);

  return { members, loading, error };
};
