import React from "react";
import { motion } from "framer-motion";
import CreateRoom from "@/components/rooms/CreateRoom";
import JoinRoom from "@/components/rooms/JoinRoom";
import ExistingRooms from "@/components/rooms/ExistingRooms";

export default function StudyArenaHub() {
  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Study Arena
          </h1>
          <p className="text-xl text-gray-300">
            Collaborate with friends in real-time study rooms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CreateRoom />
          <JoinRoom />
        </div>

        <ExistingRooms />
      </motion.div>
    </div>
  );
}
