import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ref, onValue, remove } from "firebase/database";
import { db } from "@/firebase/config";
import {
  History,
  Filter,
  Trash2,
  Bot,
  User as UserIcon,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function ChatHistoryManager({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all"); // all, today, last3days
  const [filteredMessages, setFilteredMessages] = useState([]);

  /**
   * Listen to messages from Firebase RTDB
   */
  useEffect(() => {
    const messagesRef = ref(db, `rooms/${roomId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        messagesList.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  /**
   * Apply filter whenever messages or filter changes
   */
  useEffect(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const threeDaysMs = 3 * oneDayMs;

    let filtered = messages;

    if (filter === "today") {
      filtered = messages.filter((msg) => now - msg.timestamp < oneDayMs);
    } else if (filter === "last3days") {
      filtered = messages.filter((msg) => now - msg.timestamp < threeDaysMs);
    }

    setFilteredMessages(filtered);
  }, [messages, filter]);

  /**
   * Clear all chat history
   */
  const handleClearHistory = async () => {
    if (
      !confirm(
        "Delete all chat messages? This will clear the chat history for everyone in the room. This action cannot be undone."
      )
    )
      return;

    try {
      const messagesRef = ref(db, `rooms/${roomId}/messages`);
      await remove(messagesRef);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bgDark2/40 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-bgDark3/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-neonPurple" />
              Chat History
            </h2>
            <p className="text-xs text-white/60">
              {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleClearHistory}
            disabled={messages.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
            <span className="text-sm text-red-400 group-hover:text-red-300">
              Clear All
            </span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "today", label: "Today" },
            { value: "last3days", label: "Last 3 Days" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === tab.value
                  ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPurple/40 text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              <Filter className="w-3.5 h-3.5 inline mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neonPurple/20 to-neonPink/20 border border-neonPurple/40 flex items-center justify-center mb-4"
            >
              <History className="w-8 h-8 text-neonPurple" />
            </motion.div>
            <p className="text-white/60 mb-2">No messages found</p>
            <p className="text-xs text-white/40">
              {filter === "all"
                ? "Start chatting to see your history"
                : "No messages in this time period"}
            </p>
          </div>
        ) : (
          filteredMessages.map((message, index) => {
            const isAssistant = message.type === "assistant";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="bg-bgDark3/50 backdrop-blur-xl border border-white/10 hover:border-neonPurple/30 rounded-xl p-4 transition-all duration-300"
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isAssistant
                          ? "bg-gradient-to-br from-neonPurple/30 to-neonPink/30 border border-neonPurple/40"
                          : "bg-bgDark3/80 border border-white/20"
                      }`}
                    >
                      {isAssistant ? (
                        <Bot className="w-4 h-4 text-neonPurple" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {message.username}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(message.timestamp).toLocaleDateString()}{" "}
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isAssistant && (
                    <span className="px-2 py-1 bg-neonPurple/20 border border-neonPurple/30 rounded-md text-xs text-neonPurple font-medium">
                      AI
                    </span>
                  )}
                </div>

                {/* Message Content */}
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap pl-10">
                  {message.message}
                </p>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Info Banner */}
      <div className="px-6 py-3 bg-blue-500/10 border-t border-blue-500/30">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-400 leading-relaxed">
            Chat history is synced across all room members. Clearing history will
            remove messages for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
