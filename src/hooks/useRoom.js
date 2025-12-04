import { useState, useEffect } from "react";
import { listenToRoom } from "@/firebase/roomService";

/**
 * Hook to listen to room data in real-time
 * @param {string} roomId - Room ID
 * @returns {{room: Object, loading: boolean, error: string}}
 */
export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Start listening to room
    const unsubscribe = listenToRoom(roomId, (roomData) => {
      setRoom(roomData);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId]);

  return { room, loading, error };
};
