import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ message, index }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-neonPink to-neonPurple"
            : isError
            ? "bg-red-500/20 border border-red-500/40"
            : "bg-bgDark3/80 border border-neonPurple/40"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-neonPurple" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] group ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 rounded-tr-sm"
              : isError
              ? "bg-red-500/10 border border-red-500/30 rounded-tl-sm"
              : "bg-bgDark3/50 border border-white/10 rounded-tl-sm hover:border-neonPurple/40"
          }`}
        >
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-white/40 mt-1 px-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}
