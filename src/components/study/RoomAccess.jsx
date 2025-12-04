import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set, get, onValue } from "firebase/database";
import { db } from "@/firebase/config";
import { motion } from "framer-motion";
import { Users, LogIn, Sparkles, AlertCircle, Loader2 } from "lucide-react";

const MAX_USERS_PER_ROOM = 5;

export default function RoomAccess() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
  const [watchingRoomCode, setWatchingRoomCode] = useState("");

  // Watch for users in the entered room code (live preview)
  useEffect(() => {
    if (!roomCode || roomCode.length !== 6) {
      setCurrentRoomUsers([]);
      setWatchingRoomCode("");
      return;
    }

    const roomRef = ref(db, `rooms/${roomCode}/users`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userList = Object.entries(users).map(([id, data]) => ({
          userId: id,
          username: data.username,
          joinedAt: data.joinedAt,
        }));
        setCurrentRoomUsers(userList);
        setWatchingRoomCode(roomCode);
      } else {
        setCurrentRoomUsers([]);
        setWatchingRoomCode("");
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Generate 6-digit room code
  const generateRoomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Create a new room
  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const code = generateRoomCode();
      const roomRef = ref(db, `rooms/${code}`);
      
      // Check if room already exists (collision check)
      const snapshot = await get(roomRef);
      if (snapshot.exists()) {
        // Recursively try again with new code
        setLoading(false);
        return handleCreateRoom();
      }

      // Generate unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create minimal room structure in RTDB (NO messages, NO notes, NO files)
      await set(roomRef, {
        createdAt: Date.now(),
        users: {
          [userId]: {
            username: username.trim(),
            joinedAt: Date.now(),
          },
        },
      });

      // TODO: Create room metadata in MongoDB with POST /api/study-arena/rooms
      // Body: { roomCode: code, createdBy: userId, createdAt: Date.now() }

      // Store user session
      localStorage.setItem("studyArena_userId", userId);
      localStorage.setItem("studyArena_username", username.trim());
      localStorage.setItem("studyArena_currentRoom", code);

      // Navigate to room
      navigate(`/study-arena/${code}`);
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room. Please try again.");
      setLoading(false);
    }
  };

  // Join an existing room
  const handleJoinRoom = async () => {
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomCode.trim() || !/^\d{6}$/.test(roomCode.trim())) {
      setError("Please enter a valid 6-digit room code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setError("Room not found. Please check the code.");
        setLoading(false);
        return;
      }

      const roomData = snapshot.val();
      
      // Check if room is full (max 5 users)
      const currentUsers = roomData.users || {};
      const userCount = Object.keys(currentUsers).length;
      
      if (userCount >= MAX_USERS_PER_ROOM) {
        setError(`Room is full (max ${MAX_USERS_PER_ROOM} users)`);
        setLoading(false);
        return;
      }

      // Generate unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Add user to room in RTDB
      const userRef = ref(db, `rooms/${roomCode}/users/${userId}`);
      await set(userRef, {
        username: username.trim(),
        joinedAt: Date.now(),
      });

      // TODO: Add user to MongoDB room members with POST /api/study-arena/rooms/:roomId/members
      // Body: { userId, username: username.trim(), joinedAt: Date.now() }

      // Store user session
      localStorage.setItem("studyArena_userId", userId);
      localStorage.setItem("studyArena_username", username.trim());
      localStorage.setItem("studyArena_currentRoom", roomCode);

      // Navigate to room
      navigate(`/study-arena/${roomCode}`);
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room. Please try again.");
      setLoading(false);
    }
  };

  // Handle room code input - only allow digits, max 6
  const handleRoomCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setRoomCode(value);
    setError(""); // Clear error on input change
  };

  // Check if join button should be disabled
  const isJoinDisabled = !username.trim() || roomCode.length !== 6 || loading;
  const isCreateDisabled = !username.trim() || loading;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bgDark1">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,30,138,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-bgDark2/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neonPink to-neonPurple flex items-center justify-center"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Study Arena</h1>
            <p className="text-white/60 text-sm">Collaborative learning with AI assistance</p>
          </div>

          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="text-sm text-white/80 mb-2 block">Your Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(""); // Clear error on input change
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-bgDark3/50 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Create Room Button */}
          <motion.button
            whileHover={{ scale: isCreateDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isCreateDisabled ? 1 : 0.98 }}
            onClick={handleCreateRoom}
            disabled={isCreateDisabled}
            className="w-full mb-4 bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Room...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create New Room
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Join Room Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={handleRoomCodeChange}
                placeholder="Enter 6-digit code"
                className="w-full bg-bgDark3/50 text-white placeholder:text-white/40 px-4 py-3 rounded-xl border border-white/10 focus:border-neonPurple/40 outline-none transition-colors duration-300 font-mono text-center text-lg tracking-widest"
                maxLength={6}
                inputMode="numeric"
              />
            </div>

            <motion.button
              whileHover={{ scale: isJoinDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isJoinDisabled ? 1 : 0.98 }}
              onClick={handleJoinRoom}
              disabled={isJoinDisabled}
              className="w-full bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 hover:border-neonPurple/40 disabled:border-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining Room...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Join Room
                </>
              )}
            </motion.button>

            {/* Live Room Users Preview */}
            {watchingRoomCode && currentRoomUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-bgDark2/40 border border-neonPurple/20 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-neonPurple" />
                  <span className="text-sm font-semibold text-white/80">
                    Room {watchingRoomCode} ({currentRoomUsers.length}/{MAX_USERS_PER_ROOM})
                  </span>
                </div>
                <div className="space-y-2">
                  {currentRoomUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {user.username}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs">
              Maximum {MAX_USERS_PER_ROOM} users per room
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
