import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom as useRoomContext } from "@/contexts/RoomContext";
import { useUserRooms } from "@/hooks/useUserRooms";

export default function ExistingRooms() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { enterRoom } = useRoomContext();
  const { rooms, loading, error, refreshRooms } = useUserRooms(currentUser?.uid);

  const handleGoToRoom = (room) => {
    enterRoom(room.roomId, {
      ownerId: room.ownerId
    });
    navigate(`/study-arena/room/${room.roomId}`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20"
      >
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
          <p className="text-gray-300">Loading your rooms...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500/20 rounded-full">
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Active Rooms</h2>
            <p className="text-gray-400 text-sm">Continue where you left off</p>
          </div>
        </div>
        <motion.button
          onClick={refreshRooms}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
        >
          <RefreshCw className="w-5 h-5 text-gray-300" />
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="py-12 text-center">
          <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">You haven't joined any rooms yet</p>
          <p className="text-sm text-gray-500 mt-2">Create a new room or join an existing one to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => {
            const memberCount = room.members ? Object.keys(room.members).length : 0;
            const createdDate = new Date(room.createdAt).toLocaleDateString();
            const createdTime = new Date(room.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            const isOwner = room.ownerId === currentUser?.uid;

            return (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 cursor-pointer transition group"
                onClick={() => handleGoToRoom(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg font-mono text-sm font-bold">
                        {room.roomId.substring(0, 8)}...
                      </code>
                      {isOwner && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold">
                          OWNER
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{memberCount}/5 members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{createdDate} at {createdTime}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
