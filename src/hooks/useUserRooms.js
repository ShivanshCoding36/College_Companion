import { useState, useEffect, useCallback } from "react";
import { getUserRooms } from "@/firebase/roomService";

/**
 * Hook to fetch user's active rooms
 * @param {string} userId - User ID
 * @returns {{rooms: Array, loading: boolean, error: string, refreshRooms: Function}}
 */
export const useUserRooms = (userId) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const loadRooms = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userRooms = await getUserRooms(userId);
      setRooms(userRooms);
    } catch (err) {
      setError(err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms, refresh]);

  const refreshRooms = useCallback(() => {
    setRefresh(prev => prev + 1);
  }, []);

  return { rooms, loading, error, refreshRooms };
};
