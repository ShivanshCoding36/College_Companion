import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom as useRoomContext } from "@/contexts/RoomContext";
import { createRoom } from "@/firebase/roomService";

export default function CreateRoom() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { enterRoom } = useRoomContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      setError(null);

      const userName = userProfile?.fullName || currentUser?.email || "Anonymous";
      const { roomId } = await createRoom(currentUser.uid, userName);

      setSuccess(true);
      enterRoom(roomId, { ownerId: currentUser.uid });

      // Redirect to room after 1 second
      setTimeout(() => {
        navigate(`/study-arena/room/${roomId}`);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-neonPurple/20 rounded-xl">
          <Plus className="w-6 h-6 text-neonPurple" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Create Room</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Start a new study session</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-400">Room created! Redirecting...</p>
        </div>
      )}

      <motion.button
        onClick={handleCreateRoom}
        disabled={loading || success}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 md:py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Room...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Created!
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Create Study Room
          </>
        )}
      </motion.button>

      <p className="mt-4 text-sm text-gray-400 text-center">
        You'll be the room owner and can invite up to 4 friends
      </p>
    </motion.div>
  );
}
