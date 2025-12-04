import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle, Hash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom as useRoomContext } from "@/contexts/RoomContext";
import { joinRoom } from "@/firebase/roomService";

export default function JoinRoom() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { enterRoom } = useRoomContext();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userName = userProfile?.fullName || currentUser?.email || "Anonymous";
      await joinRoom(roomId.trim(), currentUser.uid, userName);

      enterRoom(roomId.trim(), {});
      navigate(`/study-arena/room/${roomId.trim()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-full">
          <LogIn className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Join Room</h2>
          <p className="text-gray-400 text-sm">Enter a room ID to join</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleJoinRoom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Room ID
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
              disabled={loading}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !roomId.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Join Room
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-4 text-sm text-gray-400 text-center">
        Get the room ID from your friend who created the room
      </p>
    </motion.div>
  );
}
