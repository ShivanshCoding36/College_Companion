import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, BookOpen, Calculator, Target, X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/services/api";

export default function SemesterEssentials() {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [essentials, setEssentials] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    creative: true,
    theory: true,
    numerical: true,
    twoMarks: true,
    threeMarks: true,
    fourteenMarks: true,
    sixteenMarks: true,
  });

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a JPG, PNG, or PDF file");
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setEssentials(null);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleExtractAndGenerate = async () => {
    if (!file) {
      setError("Upload a syllabus file first");
      return;
    }

    if (!currentUser) {
      setError("Please login to extract essentials");
      return;
    }

    setError(null);
    setIsExtracting(true);
    setIsGenerating(true);
    setEssentials(null);

    try {
      const data = await API.extractEssentials(file);

      if (data.success && data.essentials) {
        setEssentials({
          creativeQuestions: data.essentials.creativeQuestions || [],
          theoryTopics: data.essentials.theoryTopics || [],
          numericalTopics: data.essentials.numericalTopics || [],
          marksDistribution: {
            twoMarks: data.essentials.marksDistribution?.twoMarks || [],
            threeMarks: data.essentials.marksDistribution?.threeMarks || [],
            fourteenMarks: data.essentials.marksDistribution?.fourteenMarks || [],
            sixteenMarks: data.essentials.marksDistribution?.sixteenMarks || [],
          },
        });
      } else {
        throw new Error("Failed to extract essentials from file");
      }
    } catch (error) {
      console.error("Error extracting essentials:", error);
      setError(error.message || "Failed to extract essentials. Ensure you are logged in and backend is running.");
    } finally {
      setIsExtracting(false);
      setIsGenerating(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const AccordionSection = ({ title, items, icon: Icon, color, sectionKey }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{items?.length || 0} items</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-6 py-5 space-y-3 bg-gray-50 dark:bg-gray-800/30">
                {items && items.length > 0 ? (
                  items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className={`mt-2 w-2 h-2 rounded-full bg-gradient-to-r ${color} flex-shrink-0`} />
                      <span className="leading-relaxed">{item}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm">No items available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Syllabus</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload image or PDF to extract essentials</p>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            isDragging
              ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf,video/mp4"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Drag & drop your syllabus file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supports JPG, PNG, PDF, MP4 (Max 10MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" 
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                  setEssentials(null);
                }}
                className="px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium transition-colors border border-red-200 dark:border-red-500/30"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 dark:bg-red-500/10 rounded-2xl p-4 flex items-start gap-3 border border-red-200 dark:border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleExtractAndGenerate}
          disabled={!file || isExtracting || isGenerating}
          className="w-full mt-4 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 rounded-xl text-white text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Extracting Syllabus...
            </>
          ) : isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Essentials...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              Extract Syllabus & Generate Essentials
            </>
          )}
        </button>
      </motion.div>

      {/* Generated Essentials */}
      {essentials && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-5 flex items-start gap-3 border border-green-200 dark:border-green-500/30"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Essentials Generated Successfully!</p>
              <p className="text-sm text-green-600/70 dark:text-green-400/70">Your exam preparation guide is ready</p>
            </div>
          </motion.div>

          {/* Creative Questions */}
          <AccordionSection
            title="Creative Questions"
            items={essentials.creativeQuestions}
            icon={Lightbulb}
            color="from-yellow-500 to-orange-500"
            sectionKey="creative"
          />

          {/* Theory Topics */}
          <AccordionSection
            title="Theory Topics"
            items={essentials.theoryTopics}
            icon={BookOpen}
            color="from-blue-500 to-cyan-500"
            sectionKey="theory"
          />

          {/* Numerical Topics */}
          <AccordionSection
            title="Sums / Numerical"
            items={essentials.numericalTopics}
            icon={Calculator}
            color="from-green-500 to-emerald-500"
            sectionKey="numerical"
          />

          {/* Marks Distribution */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Marks Distribution
            </h2>

            <AccordionSection
              title="Important 2 Mark Areas"
              items={essentials.marksDistribution?.twoMarks}
              icon={Target}
              color="from-pink-500 to-rose-500"
              sectionKey="twoMarks"
            />

            <AccordionSection
              title="Important 3 Mark Areas"
              items={essentials.marksDistribution?.threeMarks}
              icon={Target}
              color="from-purple-500 to-pink-500"
              sectionKey="threeMarks"
            />

            <AccordionSection
              title="Important 14 Mark Areas"
              items={essentials.marksDistribution?.fourteenMarks}
              icon={Target}
              color="from-orange-500 to-red-500"
              sectionKey="fourteenMarks"
            />

            <AccordionSection
              title="Important 16 Mark Areas"
              items={essentials.marksDistribution?.sixteenMarks}
              icon={Target}
              color="from-red-500 to-pink-500"
              sectionKey="sixteenMarks"
            />
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!essentials && !isExtracting && !isGenerating && (
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Lightbulb className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Upload a syllabus file to generate exam essentials
          </p>
        </div>
      )}
    </div>
  );
}