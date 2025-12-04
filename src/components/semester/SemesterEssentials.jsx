import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, ChevronDown, Lightbulb, BookOpen, Calculator, Target, X, Sparkles } from "lucide-react";

export default function SemesterEssentials() {
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

  // API Keys (placeholder - replace with actual keys)
  const VISION_API_KEY = "YOUR_VISION_API_KEY_HERE";
  const GROQ_API_KEY = "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";

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
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

  const extractSyllabusFromImage = async (file) => {
    // For now, we'll use a simulated extraction
    // In production, replace with actual vision API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Sample Syllabus Content:
        
Unit 1: Data Structures
- Arrays and Linked Lists
- Stacks and Queues
- Trees and Graphs

Unit 2: Algorithms
- Sorting Algorithms
- Searching Algorithms
- Dynamic Programming

Unit 3: Object-Oriented Programming
- Classes and Objects
- Inheritance and Polymorphism
- Design Patterns`);
      }, 2000);
    });
  };

  const generateEssentials = async (syllabusText) => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an expert exam preparation assistant. Analyze the syllabus and generate structured essentials for exam preparation. Return ONLY a valid JSON object with this exact structure:
{
  "creativeQuestions": ["topic1", "topic2", ...],
  "theoryTopics": ["topic1", "topic2", ...],
  "numericalTopics": ["topic1", "topic2", ...],
  "marksDistribution": {
    "twoMarks": ["topic1", "topic2", ...],
    "threeMarks": ["topic1", "topic2", ...],
    "fourteenMarks": ["topic1", "topic2", ...],
    "sixteenMarks": ["topic1", "topic2", ...]
  }
}
Do not include any markdown formatting or explanatory text. Return only the JSON object.`
            },
            {
              role: "user",
              content: `Analyze this syllabus and generate exam essentials:\n\n${syllabusText}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate essentials");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from API");
      }

      // Try to parse JSON from response
      let parsedEssentials;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedEssentials = JSON.parse(jsonMatch[0]);
        } else {
          parsedEssentials = JSON.parse(content);
        }
      } catch (parseError) {
        // Fallback structure if parsing fails
        parsedEssentials = {
          creativeQuestions: ["Problem-solving scenarios", "Application-based questions", "Critical thinking exercises"],
          theoryTopics: ["Core concepts", "Definitions and explanations", "Theoretical frameworks"],
          numericalTopics: ["Formula-based problems", "Calculations", "Quantitative analysis"],
          marksDistribution: {
            twoMarks: ["Definitions", "Short answers", "Basic concepts"],
            threeMarks: ["Brief explanations", "Diagram-based", "Short problems"],
            fourteenMarks: ["Detailed explanations", "Multiple concepts", "Medium problems"],
            sixteenMarks: ["Comprehensive answers", "Complex problems", "Essay-type questions"],
          },
        };
      }

      return parsedEssentials;
    } catch (error) {
      console.error("Error generating essentials:", error);
      throw error;
    }
  };

  const handleExtractAndGenerate = async () => {
    if (!file) {
      setError("Upload a syllabus file first");
      return;
    }

    setError(null);
    setIsExtracting(true);
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/essentials/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      const data = await response.json();

      if (data.success && data.essentials) {
        // Map backend response to frontend structure
        setEssentials({
          creativeQuestions: data.essentials.creative || [],
          theoryTopics: data.essentials.theory || [],
          numericalTopics: data.essentials.numerical || [],
          marksDistribution: {
            twoMarks: data.essentials.twoMarks || [],
            threeMarks: data.essentials.threeMarks || [],
            fourteenMarks: data.essentials.fourteenMarks || [],
            sixteenMarks: data.essentials.sixteenMarks || []
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }

      setIsExtracting(false);
      setIsGenerating(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to extract essentials. Make sure backend is running on port 5000.");
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
        className="bg-bgDark3/50 backdrop-blur-xl rounded-[14px] overflow-hidden"
        style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-[22px] py-[18px] flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-[20px] font-semibold text-white">{title}</h3>
              <p className="text-[14px] text-white/60">{items?.length || 0} items</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <div className="px-[22px] py-[18px] space-y-2">
                {items && items.length > 0 ? (
                  items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-2 text-[13px] text-white/80"
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`} />
                      <span>{item}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-white/40 text-[13px]">No items available</p>
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
        className="bg-bgDark3/50 backdrop-blur-xl rounded-[14px] px-[22px] py-[18px]"
        style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center gap-3 mb-[18px]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-white">Upload Syllabus</h3>
            <p className="text-[14px] text-white/60">Upload image or PDF to extract essentials</p>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-[14px] px-[22px] py-[24px] transition-all duration-300 ${
            isDragging
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-white/20 hover:border-white/30 bg-bgDark2/50"
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
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-[14px] font-medium text-white mb-2">
                Drag & drop your syllabus file here, or click to browse
              </p>
              <p className="text-[13px] text-white/60">Supports JPG, PNG, PDF, MP4 (Max 10MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }} />
              ) : (
                <div className="w-24 h-24 bg-bgDark2 rounded-lg flex items-center justify-center" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <FileText className="w-8 h-8 text-white/40" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-[14px] font-medium text-white">{file.name}</p>
                <p className="text-[13px] text-white/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                  setEssentials(null);
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-[13px] transition-colors"
                style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
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
            className="mt-4 bg-red-500/10 rounded-[14px] px-[22px] py-[18px] flex items-start gap-2"
            style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleExtractAndGenerate}
          disabled={!file || isExtracting || isGenerating}
          className="w-full mt-4 px-[22px] py-[14px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-white/10 disabled:to-white/10 rounded-[14px] text-white text-[14px] font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            className="bg-green-500/10 rounded-[14px] px-[22px] py-[18px] flex items-start gap-3"
            style={{ border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-green-400">Essentials Generated Successfully!</p>
              <p className="text-[13px] text-green-400/70">Your exam preparation guide is ready</p>
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
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-neonPurple" />
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
        <div className="bg-bgDark3/30 backdrop-blur-xl rounded-xl border border-white/5 p-12 text-center">
          <Lightbulb className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">
            Upload a syllabus file to generate exam essentials
          </p>
        </div>
      )}
    </div>
  );
}
