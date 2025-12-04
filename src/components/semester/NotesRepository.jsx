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
        className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Notes Repository</h3>
              <p className="text-sm text-white/60">Upload and organize your study materials</p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
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
              <div className="bg-bgDark2/50 rounded-lg p-4 border border-white/10 space-y-4 mt-4">
                {/* Title Input */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="e.g., OOP Concepts Summary"
                    className="w-full px-4 py-2 bg-bgDark3/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonPurple/40 focus:outline-none transition-colors"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">Category (Subject)</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    className="w-full px-4 py-2 bg-bgDark3/50 border border-white/10 rounded-lg text-white focus:border-neonPurple/40 focus:outline-none transition-colors cursor-pointer"
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
                  <label className="text-sm text-white/80 mb-2 block">File</label>
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
                      className="flex items-center justify-center gap-2 w-full px-4 py-8 bg-bgDark3/50 border-2 border-dashed border-white/20 hover:border-neonPurple/40 rounded-lg cursor-pointer transition-colors group"
                    >
                      <Upload className="w-6 h-6 text-white/60 group-hover:text-neonPurple" />
                      <span className="text-white/60 group-hover:text-white">
                        {newNote.file ? newNote.file.name : "Click to upload PDF or Image"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 rounded-lg text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed"
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
        className="bg-bgDark3/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">My Notes</h3>
          <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
            {notes.length} files
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">No notes uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-bgDark2/50 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                {/* File Icon */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                    {getFileIcon(note.type)}
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 flex items-center justify-center transition-all duration-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {/* Note Info */}
                <h4 className="text-white font-semibold mb-1 line-clamp-1">{note.title}</h4>
                <p className="text-xs text-white/60 mb-3">{note.category}</p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                  <span>{note.uploadDate}</span>
                  <span>{note.size}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neonPurple/40 rounded-lg text-white text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neonPink/40 rounded-lg text-white text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" />
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
