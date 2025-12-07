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
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8"
      >
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading your rooms...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Your Active Rooms</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Continue where you left off</p>
          </div>
        </div>
        <motion.button
          onClick={refreshRooms}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition"
        >
          <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="py-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">You haven't joined any rooms yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Create a new room or join an existing one to get started</p>
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
                className="p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition group"
                onClick={() => handleGoToRoom(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-mono text-sm font-bold">
                        {room.roomId.substring(0, 8)}...
                      </code>
                      {isOwner && (
                        <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs font-semibold">
                          OWNER
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
