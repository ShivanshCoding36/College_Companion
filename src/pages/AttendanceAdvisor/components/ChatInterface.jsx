import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Paperclip, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";

export default function ChatInterface({ messages, isLoading, onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // TODO: Handle file upload (calendar/timetable)
      onSendMessage(`I've uploaded a file: ${file.name}`);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
    console.log("Voice recording:", !isRecording ? "started" : "stopped");
  };

  return (
    <div className="flex flex-col h-full bg-bgDark2/40 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white">AI Attendance Advisor</h2>
          <p className="text-sm text-white/60">Powered by Groq</p>
        </div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-3 h-3 rounded-full bg-green-500"
        />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} message={message} index={index} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 mb-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bgDark3/80 border border-neonPurple/40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-neonPurple animate-spin" />
            </div>
            <div className="bg-bgDark3/50 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-neonPurple/60 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-neonPurple/60 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-neonPurple/60 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-bgDark3/50 backdrop-blur-xl rounded-2xl border border-white/10 p-3 focus-within:border-neonPurple/40 transition-colors duration-300">
            {/* File Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xls,.xlsx,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-bgDark2 hover:bg-neonPurple/20 border border-white/10 hover:border-neonPurple/40 flex items-center justify-center transition-all duration-300 group"
              title="Upload calendar or timetable"
            >
              <Paperclip className="w-4 h-4 text-white/60 group-hover:text-neonPurple" />
            </button>

            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about leave planning, attendance strategy..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none resize-none max-h-32 px-2 py-2"
              style={{ minHeight: "36px" }}
            />

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? "bg-red-500/20 border-red-500/40 animate-pulse"
                  : "bg-bgDark2 hover:bg-neonPink/20 border-white/10 hover:border-neonPink/40"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <Mic
                className={`w-4 h-4 ${
                  isRecording ? "text-red-500" : "text-white/60 hover:text-neonPink"
                }`}
              />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 border border-neonPink/40 disabled:border-white/10 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed group"
            >
              <Send className="w-4 h-4 text-white group-disabled:text-white/40" />
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-2 px-2">
          <p className="text-xs text-white/40">
            💡 Tip: Share your timetable, attendance %, and upcoming events for personalized advice
          </p>
        </div>
      </div>
    </div>
  );
}
