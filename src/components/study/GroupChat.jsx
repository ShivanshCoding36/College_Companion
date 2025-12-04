import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, push, onValue, set, serverTimestamp } from "firebase/database";
import { db } from "@/firebase/config";
import { Send, Bot, User as UserIcon, Loader2, Copy, CheckCircle } from "lucide-react";

export default function GroupChat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [copiedRoomCode, setCopiedRoomCode] = useState(false);

  const userId = localStorage.getItem("studyArena_userId");
  const username = localStorage.getItem("studyArena_username");

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Listen to messages from Firebase RTDB
   * Path: rooms/<roomId>/messages
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
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  /**
   * Listen to typing indicators
   * Path: rooms/<roomId>/typing
   */
  useEffect(() => {
    const typingRef = ref(db, `rooms/${roomId}/typing`);
    
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter out current user
        const otherUsers = Object.entries(data)
          .filter(([id, isTyping]) => id !== userId && isTyping)
          .map(([id]) => id);
        setTypingUsers(otherUsers);
      } else {
        setTypingUsers([]);
      }
    });

    return () => unsubscribe();
  }, [roomId, userId]);

  /**
   * Handle typing indicator
   */
  const handleTyping = (typing) => {
    const typingRef = ref(db, `rooms/${roomId}/typing/${userId}`);
    set(typingRef, typing);
  };

  /**
   * Send message to queue and process with LLM
   * 
   * Flow:
   * 1. User sends message -> push to queue
   * 2. Queue listener (backend) picks up message
   * 3. Backend processes with Groq API
   * 4. Backend pushes response to messages
   * 
   * For now: Mock LLM response after 2 seconds
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsSending(true);
    handleTyping(false);

    try {
      // 1. Add user message to messages
      const messagesRef = ref(db, `rooms/${roomId}/messages`);
      const userMsgRef = push(messagesRef);
      
      await set(userMsgRef, {
        userId,
        username,
        message: userMessage,
        type: "user",
        timestamp: Date.now(),
      });

      // 2. Push to queue for LLM processing
      const queueRef = ref(db, `rooms/${roomId}/queue`);
      const queueMsgRef = push(queueRef);
      
      await set(queueMsgRef, {
        userId,
        username,
        message: userMessage,
        timestamp: Date.now(),
        status: "pending",
      });

      // TODO: Integrate Groq API here
      // The backend should listen to queue and process messages
      // For now, simulate LLM response after 2 seconds
      
      setTimeout(async () => {
        const mockResponses = [
          "That's an interesting point! Let me help you understand this concept better. In simple terms, this relates to the fundamental principles we discussed earlier.",
          "Great question! To break this down: First, consider the core concept. Then, think about how it applies to your specific scenario. Finally, practice with examples.",
          "I can help with that! Here's a detailed explanation: The key is to understand the underlying mechanism and how different components interact with each other.",
          "Let me clarify this for you. This concept is essential because it forms the foundation for more advanced topics. Think of it as building blocks.",
        ];

        const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        const aiMsgRef = push(messagesRef);
        await set(aiMsgRef, {
          userId: "ai_assistant",
          username: "AI Study Assistant",
          message: aiResponse,
          type: "assistant",
          timestamp: Date.now(),
        });

        setIsSending(false);
      }, 2000);

    } catch (err) {
      console.error("Error sending message:", err);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedRoomCode(true);
    setTimeout(() => setCopiedRoomCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bgDark2/40 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-bgDark3/30">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-neonPurple" />
            Shared AI Chat
          </h2>
          <p className="text-xs text-white/60">Collaborative learning space</p>
        </div>
        <button
          onClick={copyRoomCode}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neonPurple/40 rounded-lg transition-all duration-300 group"
        >
          {copiedRoomCode ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white/60 group-hover:text-neonPurple" />
              <span className="text-sm text-white/80 font-mono">{roomId}</span>
            </>
          )}
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPurple/40 flex items-center justify-center mb-4"
            >
              <Bot className="w-8 h-8 text-neonPurple" />
            </motion.div>
            <p className="text-white/60 mb-2">Start your collaborative study session</p>
            <p className="text-xs text-white/40">
              Messages are synced in real-time with all room members
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isAssistant = message.type === "assistant";
              const isCurrentUser = message.userId === userId;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex gap-3 ${isCurrentUser && !isAssistant ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isAssistant
                        ? "bg-gradient-to-br from-neonPurple/30 to-neonPink/30 border border-neonPurple/40"
                        : isCurrentUser
                        ? "bg-gradient-to-br from-neonPink to-neonPurple"
                        : "bg-bgDark3/80 border border-white/20"
                    }`}
                  >
                    {isAssistant ? (
                      <Bot className="w-5 h-5 text-neonPurple" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] ${isCurrentUser && !isAssistant ? "items-end" : "items-start"}`}>
                    {/* Username */}
                    <p className={`text-xs text-white/60 mb-1 px-1 ${isCurrentUser && !isAssistant ? "text-right" : "text-left"}`}>
                      {message.username}
                    </p>

                    {/* Message Content */}
                    <div
                      className={`px-4 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                        isAssistant
                          ? "bg-gradient-to-br from-neonPurple/20 to-neonPink/20 border border-neonPurple/30 rounded-tl-sm"
                          : isCurrentUser
                          ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 rounded-tr-sm"
                          : "bg-bgDark3/50 border border-white/10 rounded-tl-sm hover:border-white/20"
                      }`}
                    >
                      <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-white/40 mt-1 px-1 ${isCurrentUser && !isAssistant ? "text-right" : "text-left"}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bgDark3/80 border border-white/20 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                </div>
                <div className="bg-bgDark3/50 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* LLM Backend Status Banner */}
      <div className="px-6 py-2 bg-orange-500/10 border-t border-orange-500/30">
        <p className="text-xs text-orange-400 text-center">
          ⚠️ Waiting for LLM backend connection… (Using mock responses)
        </p>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-2 bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-3 focus-within:border-neonPurple/40 transition-colors duration-300">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or share your thoughts..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none resize-none max-h-32 px-2 py-2"
            style={{ minHeight: "36px" }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 border border-neonPink/40 disabled:border-white/10 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
