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
        className={`rounded-2xl shadow-lg border-2 p-6 ${
          hasContext
            ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
            : "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30"
        }`}
      >
        <div className="flex items-start gap-4">
          <AlertCircle
            className={`w-6 h-6 mt-0.5 flex-shrink-0 ${
              hasContext ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
            }`}
          />
          <div className="flex-1">
            <h3 className={`font-semibold mb-2 text-lg ${
              hasContext ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
            }`}>
              {hasContext ? "✓ Syllabus Context Loaded" : "⚠ Syllabus Context Not Loaded"}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
                <button
                  onClick={handleContextSubmit}
                  disabled={!syllabusContext.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 rounded-xl text-white text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ height: "600px" }}
      >
        {/* Chat Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold">Concept Doubt Solver</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered learning assistant</p>
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
              className="w-3 h-3 rounded-full bg-green-500"
            />
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="overflow-y-auto px-6 py-5 space-y-5 bg-gray-50 dark:bg-gray-900/30"
          style={{ height: "calc(100% - 150px)" }}
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
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    isUser
                      ? "bg-gradient-to-br from-pink-500 to-purple-500"
                      : "bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-500/30"
                  }`}
                >
                  {isUser ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl shadow-sm ${
                      isUser
                        ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-tr-sm"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1 ${
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-md">
                <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your doubt here..."
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 rounded-xl text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
