import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  LogOut, 
  Power, 
  Copy, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom as useRoomContext } from "@/contexts/RoomContext";
import { useRoom } from "@/hooks/useRoom";
import { useRoomMembers } from "@/hooks/useRoomMembers";
import { leaveRoom, endRoom } from "@/firebase/roomService";

export default function RoomPage() {
  const { roomCode: roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { exitRoom } = useRoomContext();
  
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);
  const { members, loading: membersLoading } = useRoomMembers(roomId);

  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const isOwner = room?.ownerId === currentUser?.uid;

  // 8. CLEANUP ON BROWSER CLOSE/REFRESH
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (room && !isOwner) {
        // Only non-owners are auto-removed
        try {
          await leaveRoom(roomId, currentUser.uid);
        } catch (error) {
          console.error("Auto leave failed:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId, currentUser.uid, isOwner, room]);

  // 9. EDGE CASE: Auto-kick if room becomes inactive
  useEffect(() => {
    if (room && !room.isActive) {
      alert("This room has ended");
      exitRoom();
      navigate("/study-arena");
    }
  }, [room, exitRoom, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveRoom = async () => {
    if (!confirm("Are you sure you want to leave this room?")) return;
    
    try {
      setActionLoading(true);
      await leaveRoom(roomId, currentUser.uid);
      exitRoom();
      navigate("/study-arena");
    } catch (error) {
      console.error("Failed to leave room:", error);
      alert(error.message || "Failed to leave room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndRoom = async () => {
    if (!confirm("Are you sure you want to end this room? All members will be removed.")) return;
    
    try {
      setActionLoading(true);
      await endRoom(roomId, currentUser.uid);
      exitRoom();
      navigate("/study-arena");
    } catch (error) {
      console.error("Failed to end room:", error);
      alert(error.message || "Failed to end room");
    } finally {
      setActionLoading(false);
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-500 mx-auto mb-4" />
          <p className="text-red-700 dark:text-red-400 text-xl mb-4">Room not found</p>
          <button
            onClick={() => navigate("/study-arena")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-lg"
          >
            Back to Study Arena
          </button>
        </div>
      </div>
    );
  }

  if (!room.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
          <p className="text-amber-700 dark:text-amber-400 text-xl mb-4">This room has ended</p>
          <button
            onClick={() => navigate("/study-arena")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-lg"
          >
            Back to Study Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505' }} className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card p-4 md:p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white glow-purple mb-2">Study Room</h1>
              <div className="flex items-center gap-3">
                <code className="px-3 md:px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-mono text-xs md:text-sm font-bold">
                  {roomId.substring(0, 12)}...
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Copy Room ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {/* 6. LEAVE/END ROOM BUTTON LOGIC */}
              {isOwner ? (
                <button
                  onClick={handleEndRoom}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition disabled:opacity-50"
                >
                  <Power className="w-4 h-4" />
                  <span className="hidden md:inline">End Room</span>
                </button>
              ) : (
                <button
                  onClick={handleLeaveRoom}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl transition disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Leave Room</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Members Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="neon-card p-4 md:p-6 lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-neonBlue" />
              <h2 className="text-lg md:text-xl font-bold text-white glow-blue">
                Members ({members.length}/5)
              </h2>
            </div>
            {membersLoading ? (
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-spin mx-auto" />
            ) : (
              <div className="space-y-2">
                {members.map((member) => {
                  const isMemberOwner = room.ownerId === member.id;
                  return (
                    <div
                      key={member.id}
                      className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-between"
                    >
                      <span className="text-gray-900 dark:text-gray-200">{member.name}</span>
                      {isMemberOwner && (
                        <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs font-semibold">
                          OWNER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="neon-card p-4 md:p-6 lg:col-span-2"
          >
            <h2 className="text-lg md:text-xl font-bold text-white glow-pink mb-4">Study Area</h2>
            <div className="text-center py-12 text-white/70">
              <p className="text-lg mb-2">Collaborate with your team</p>
              <p className="text-sm">Share notes, discuss topics, and study together</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
