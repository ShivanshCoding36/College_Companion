import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, AlertCircle, Loader2 } from "lucide-react";

export default function DoubtSolver() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI Doubt Solver. I can help clarify concepts and answer questions. Upload your syllabus context first for better, context-aware responses.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusContext, setSyllabusContext] = useState("");
  const [hasContext, setHasContext] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const mockResponses = [
        "That's a great question! Let me explain: In Object-Oriented Programming, inheritance allows a class to inherit properties and methods from another class. This promotes code reusability and establishes a relationship between parent and child classes.",
        "To understand this concept better, think of it like a real-world hierarchy. For example, a 'Vehicle' class can have properties like wheels and color, and specific classes like 'Car' and 'Bike' can inherit these properties while adding their own unique features.",
        "The key difference here is that abstraction focuses on hiding implementation details and showing only essential features, while encapsulation bundles data and methods together and restricts direct access to some components.",
        "Let me break this down step by step: First, you need to understand the basic syntax. Then, consider how the data flows through the program. Finally, think about edge cases and potential errors.",
      ];

      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: hasContext
          ? mockResponses[Math.floor(Math.random() * mockResponses.length)]
          : "I can provide a better answer if you upload your syllabus context first. However, here's a general explanation: " +
            mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleContextSubmit = () => {
    if (syllabusContext.trim()) {
      setHasContext(true);
      const contextMsg = {
        id: Date.now(),
        role: "assistant",
        content:
          "Great! I've loaded your syllabus context. I can now provide more accurate and context-aware answers to your questions.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, contextMsg]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Context Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl rounded-xl border p-6 ${
          hasContext
            ? "bg-green-500/10 border-green-500/30"
            : "bg-orange-500/10 border-orange-500/30"
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              hasContext ? "text-green-400" : "text-orange-400"
            }`}
          />
          <div className="flex-1">
            <h3 className={`font-semibold mb-2 ${hasContext ? "text-green-400" : "text-orange-400"}`}>
              {hasContext ? "✓ Syllabus Context Loaded" : "⚠ Syllabus Context Not Loaded"}
            </h3>
            <p className="text-sm text-white/80 mb-3">
              {hasContext
                ? "I have your syllabus context and can provide more accurate, contextual answers."
                : "Upload your syllabus to get context-aware, accurate responses to your doubts."}
            </p>

            {!hasContext && (
              <div className="space-y-3">
                <textarea
                  value={syllabusContext}
                  onChange={(e) => setSyllabusContext(e.target.value)}
                  placeholder="Paste your syllabus here for better context-aware responses..."
                  rows={4}
                  className="w-full px-4 py-3 bg-bgDark2/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors resize-none"
                />
                <button
                  onClick={handleContextSubmit}
                  disabled={!syllabusContext.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 rounded-lg text-white text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                >
                  Load Context
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
        style={{ height: "600px" }}
      >
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-bgDark2/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neonPink to-neonPurple flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Concept Doubt Solver</h3>
                <p className="text-xs text-white/60">AI-powered learning assistant</p>
              </div>
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
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="overflow-y-auto px-6 py-4 space-y-4"
          style={{ height: "calc(100% - 140px)" }}
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                      ? "bg-gradient-to-br from-neonPink to-neonPurple"
                      : "bg-bgDark3/80 border border-neonPurple/40"
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-neonPurple" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl backdrop-blur-xl ${
                      isUser
                        ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 rounded-tr-sm"
                        : "bg-bgDark2/50 border border-white/10 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
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
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bgDark3/80 border border-neonPurple/40 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-neonPurple animate-spin" />
              </div>
              <div className="bg-bgDark2/50 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
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
        <div className="px-4 py-3 border-t border-white/10 bg-bgDark2/30">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your doubt here..."
              className="flex-1 px-4 py-2 bg-bgDark3/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 rounded-lg text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
