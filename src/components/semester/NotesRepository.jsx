import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, X, Eye, Download, Trash2 } from "lucide-react";

export default function NotesRepository() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "OOP Concepts Summary",
      category: "Object Oriented Programming",
      type: "pdf",
      uploadDate: "2025-11-28",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Inheritance Examples",
      category: "Object Oriented Programming",
      type: "image",
      uploadDate: "2025-11-25",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Data Structures Notes",
      category: "Data Structures",
      type: "pdf",
      uploadDate: "2025-11-20",
      size: "3.2 MB",
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    category: "",
    file: null,
  });

  const categories = [
    "Object Oriented Programming",
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Other",
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewNote({ ...newNote, file });
    }
  };

  const handleUpload = () => {
    if (!newNote.title || !newNote.category || !newNote.file) {
      alert("Please fill all fields and select a file");
      return;
    }

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const newNoteData = {
        id: Date.now(),
        title: newNote.title,
        category: newNote.category,
        type: newNote.file.type.includes("pdf") ? "pdf" : "image",
        uploadDate: new Date().toISOString().split("T")[0],
        size: `${(newNote.file.size / (1024 * 1024)).toFixed(1)} MB`,
      };

      setNotes([newNoteData, ...notes]);
      setNewNote({ title: "", category: "", file: null });
      setShowUploadForm(false);
      setIsUploading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const getFileIcon = (type) => {
    return type === "pdf" ? (
      <FileText className="w-8 h-8 text-red-400" />
    ) : (
      <ImageIcon className="w-8 h-8 text-blue-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white glow-purple">Notes Repository</h3>
              <p className="text-sm text-[#1A1A1A] dark:text-[#E4E4E4]">Upload and organize your study materials</p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Upload className="w-4 h-4" />
            {showUploadForm ? "Cancel" : "Upload Notes"}
          </button>
        </div>

        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] space-y-5 mt-4 transition-all duration-300">
                {/* Title Input */}
                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="e.g., OOP Concepts Summary"
                    className="w-full px-4 py-3 bg-white dark:bg-[#111418] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Category (Subject)</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-[#111418] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">File</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-white dark:bg-[#111418] border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2F35] hover:border-green-500 dark:hover:border-green-500 rounded-xl cursor-pointer transition-colors group"
                    >
                      <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-green-500" />
                      <span className="text-[#1A1A1A] dark:text-[#E4E4E4] group-hover:text-[#0A0A0A] dark:group-hover:text-[#FFFFFF] font-medium">
                        {newNote.file ? newNote.file.name : "Click to upload PDF or Image"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full px-4 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 rounded-xl text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isUploading ? "Uploading..." : "Upload Note"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#111418] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2A2F35] p-6 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-[#FFFFFF]">My Notes</h3>
          <span className="text-sm text-[#1A1A1A] dark:text-[#E4E4E4] bg-[#F8F9FB] dark:bg-[#0D1117] px-4 py-1.5 rounded-full font-medium">
            {notes.length} files
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm">No notes uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] hover:border-[#E5E7EB] dark:hover:border-[#2A2F35] transition-all duration-300 group"
              >
                {/* File Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] flex items-center justify-center">
                    {getFileIcon(note.type)}
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 flex items-center justify-center transition-all duration-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>

                {/* Note Info */}
                <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-semibold mb-1 line-clamp-1">{note.title}</h4>
                <p className="text-xs text-[#1A1A1A] dark:text-[#E4E4E4] mb-4">{note.category}</p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-[#1A1A1A] dark:text-[#E4E4E4] mb-4">
                  <span>{note.uploadDate}</span>
                  <span>{note.size}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2.5 bg-white dark:bg-[#111418] hover:bg-[#F8F9FB] dark:hover:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg text-[#0A0A0A] dark:text-[#FFFFFF] text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2.5 bg-white dark:bg-[#111418] hover:bg-[#F8F9FB] dark:hover:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] hover:border-pink-500 dark:hover:border-pink-500 rounded-lg text-[#0A0A0A] dark:text-[#FFFFFF] text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
