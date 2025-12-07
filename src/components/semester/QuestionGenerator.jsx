import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, Copy, Check, Save, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/services/api";

export default function QuestionGenerator() {
  const { currentUser } = useAuth();
  const [syllabus, setSyllabus] = useState("");
  const [questionType, setQuestionType] = useState("2m");
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const questionTypes = [
    { value: "2m", label: "2 Marks Questions" },
    { value: "3m", label: "3 Marks Questions" },
    { value: "14m", label: "14 Marks Questions" },
    { value: "16m", label: "16 Marks Questions" },
  ];

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      setError("Please enter syllabus content");
      return;
    }

    if (!currentUser) {
      setError("Please login to generate questions");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      const data = await API.generateQuestions({
        syllabus: syllabus.trim(),
        questionType,
        userId: currentUser.uid,
      });
      
      if (data.success && data.questions) {
        // Extract question text from objects
        const questionTexts = data.questions.map(q => 
          typeof q === 'string' ? q : q.question || JSON.stringify(q)
        );
        setQuestions(questionTexts);
      } else {
        throw new Error("No questions generated");
      }

    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate questions. Please ensure you are logged in and backend is running.");
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
      const data = await API.createNote({
        userId: currentUser.uid,
        title: `${questionType.toUpperCase()} Questions - ${new Date().toLocaleDateString()}`,
        content: questions.join('\n\n'),
        tags: [questionType, 'generated-questions'],
        type: 'question-generator',
      });
      
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
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Question Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate exam questions powered by Groq AI</p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-start gap-3"
        >
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 dark:text-green-300">Questions saved successfully!</p>
        </motion.div>
      )}

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Question Generator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Groq AI</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Syllabus Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Syllabus Content
            </label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Paste your syllabus here... (e.g., Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Binary Search Trees, Graphs, Hash Tables, Sorting and Searching Algorithms...)"
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Question Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
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
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
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
          className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Questions
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg font-medium">
                {questionTypes.find(t => t.value === questionType)?.label}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg font-medium">
                {questions.length} questions
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                      {question}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(question, index)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Copy question"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSaveAsNotes}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
            <button 
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-semibold transition-all duration-200 border border-gray-300 dark:border-gray-600"
            >
              Export as PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isGenerating && (
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-dark-border">
          <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-base mb-2 font-medium">
            Ready to generate questions
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Enter your syllabus content and click "Generate Questions" to get started
          </p>
        </div>
      )}
    </div>
  );
}
