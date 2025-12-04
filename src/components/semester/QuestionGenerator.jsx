import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, Copy, Check, Save, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function QuestionGenerator() {
  const { currentUser } = useAuth();
  const [syllabus, setSyllabus] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const questionTypes = [
    { value: "mcq", label: "Multiple Choice Questions (MCQ)" },
    { value: "short-answer", label: "Short Answer (2-3 sentences)" },
    { value: "long-answer", label: "Long Answer (Detailed)" },
    { value: "true-false", label: "True/False" },
    { value: "fill-in-blank", label: "Fill in the Blanks" },
    { value: "numerical", label: "Numerical/Problem Solving" },
    { value: "conceptual", label: "Conceptual Questions" },
    { value: "case-study", label: "Case Study" },
    { value: "mixed", label: "Mixed Types" }
  ];

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      setError("Please enter syllabus content");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      // Try proxy first, then direct connection
      const endpoints = [
        "/api/questions/generate",
        "http://localhost:5001/api/questions/generate"
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              syllabus: syllabus.trim(),
              questionType
            })
          });
          
          if (response.ok) break;
          lastError = await response.text();
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError?.error || "Failed to generate questions. Make sure backend is running on port 5001.");
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.questions) {
        setQuestions(data.data.questions);
      } else {
        throw new Error("Invalid response format from server");
      }

    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate questions. Please ensure backend is running on port 5001.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsNotes = async () => {
    if (!currentUser) {
      setError("Please login to save notes");
      return;
    }

    if (questions.length === 0) {
      setError("No questions to save");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Try proxy first, then direct connection
      const endpoints = [
        "/api/questions/saveNotes",
        "http://localhost:5001/api/questions/saveNotes"
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.uid,
              title: `${questionType.toUpperCase()} Questions - ${new Date().toLocaleDateString()}`,
              questions,
              questionType,
              syllabus: syllabus.substring(0, 500)
            })
          });
          
          if (response.ok) break;
          lastError = await response.text();
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error("Failed to save notes. Make sure backend is running.");
      }

      const data = await response.json();
      
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }

    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 rounded-[14px] px-[22px] py-[18px] flex items-start gap-3"
          style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 rounded-[14px] px-[22px] py-[18px] flex items-start gap-3"
          style={{ border: '1px solid rgba(34, 197, 94, 0.3)' }}
        >
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-green-300">Questions saved successfully!</p>
        </motion.div>
      )}

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bgDark3/50 backdrop-blur-xl rounded-[14px] px-[22px] py-[18px]"
        style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center gap-3 mb-[18px]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-white">AI Question Generator</h3>
            <p className="text-[14px] text-white/60">Powered by Groq AI - Real-time question generation</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Syllabus Input */}
          <div>
            <label className="text-[14px] font-medium text-white/80 mb-2 block">Syllabus Content</label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Paste your syllabus here... (e.g., Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Binary Search Trees, Graphs, Hash Tables, Sorting and Searching Algorithms...)"
              rows={6}
              className="w-full px-[22px] py-[14px] bg-bgDark2/50 rounded-[14px] text-[13px] text-white placeholder:text-white/40 focus:outline-none transition-colors resize-none"
              style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
          </div>

          {/* Question Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-medium text-white/80 mb-2 block">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-[22px] py-[14px] bg-blue-500/20 rounded-[14px] text-[13px] text-white focus:outline-none transition-colors cursor-pointer"
                style={{ border: '1px solid rgba(59, 130, 246, 0.3)', colorScheme: 'dark' }}
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !syllabus.trim()}
                className="w-full px-[22px] py-[14px] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-white/10 disabled:to-white/10 rounded-[14px] text-white text-[14px] font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bgDark3/50 backdrop-blur-xl rounded-[14px] px-[22px] py-[18px]"
          style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div className="flex items-center justify-between mb-[18px]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-[20px] font-semibold text-white">
                Generated Questions ({questionTypes.find(t => t.value === questionType)?.label})
              </h3>
            </div>
            <span className="text-[13px] text-white/60 bg-white/5 px-3 py-1 rounded-full">
              {questions.length} questions
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-bgDark2/50 rounded-[14px] px-[18px] py-[14px] hover:border-blue-500/30 transition-all duration-300 group"
                style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-[13px]"
                    style={{ border: '1px solid rgba(59, 130, 246, 0.4)' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 text-[13px] leading-relaxed whitespace-pre-wrap">{question}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(question, index)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-300 opacity-0 group-hover:opacity-100"
                    style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    title="Copy question"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-[18px] pt-[18px] grid grid-cols-1 md:grid-cols-2 gap-3"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <button 
              onClick={handleSaveAsNotes}
              disabled={isSaving}
              className="px-[22px] py-[14px] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-white/10 disabled:to-white/10 rounded-[14px] text-white text-[14px] font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save as Notes
                </>
              )}
            </button>
            <button className="px-[22px] py-[14px] bg-white/5 hover:bg-white/10 rounded-[14px] text-white text-[14px] font-semibold transition-all duration-300"
              style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              Export as PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isGenerating && (
        <div className="bg-bgDark3/30 backdrop-blur-xl rounded-[14px] px-[22px] py-[48px] text-center"
          style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-[14px] mb-2">
            Enter your syllabus content and select question type
          </p>
          <p className="text-white/30 text-[13px]">
            Click "Generate Questions" to get AI-powered exam questions
          </p>
        </div>
      )}
    </div>
  );
}
