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
      className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-500/20 rounded-full">
          <Plus className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Create Room</h2>
          <p className="text-gray-400 text-sm">Start a new study session</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-200">Room created! Redirecting...</p>
        </div>
      )}

      <motion.button
        onClick={handleCreateRoom}
        disabled={loading || success}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
