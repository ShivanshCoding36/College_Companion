import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "@/firebase/config";
import {
  Folder,
  StickyNote,
  Trash2,
  FolderOpen,
  Star,
  BookOpen,
  HelpCircle,
  FileText,
  Eye,
  X,
} from "lucide-react";

const FOLDERS = [
  { id: "General", label: "General", icon: Folder, color: "text-blue-400" },
  { id: "Important", label: "Important", icon: Star, color: "text-yellow-400" },
  { id: "Doubts", label: "Doubts", icon: HelpCircle, color: "text-red-400" },
  { id: "References", label: "References", icon: BookOpen, color: "text-green-400" },
];

export default function NotesManager({ roomId }) {
  const [notes, setNotes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [previewNote, setPreviewNote] = useState(null);

  /**
   * Listen to notes from Firebase RTDB
   */
  useEffect(() => {
    const notesRef = ref(db, `rooms/${roomId}/notes`);

    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesList = Object.entries(data).map(([id, note]) => ({
          id,
          ...note,
        }));
        notesList.sort((a, b) => b.createdAt - a.createdAt);
        setNotes(notesList);
      } else {
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  /**
   * Filter notes by folder
   */
  useEffect(() => {
    if (selectedFolder === "all") {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter((note) => note.folder === selectedFolder));
    }
  }, [notes, selectedFolder]);

  /**
   * Move note to different folder
   */
  const handleMoveNote = async (noteId, newFolder) => {
    try {
      const noteRef = ref(db, `rooms/${roomId}/notes/${noteId}`);
      await update(noteRef, {
        folder: newFolder,
        lastModified: Date.now(),
      });
    } catch (err) {
      console.error("Error moving note:", err);
    }
  };

  /**
   * Delete note
   */
  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note? This action cannot be undone.")) return;

    try {
      const noteRef = ref(db, `rooms/${roomId}/notes/${noteId}`);
      await remove(noteRef);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  /**
   * Get folder statistics
   */
  const getFolderStats = (folderId) => {
    return notes.filter((note) => note.folder === folderId).length;
  };

  return (
    <div className="flex flex-col h-full bg-bgDark2/40 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-bgDark3/30">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-neonPink" />
          Notes Manager
        </h2>
        <p className="text-xs text-white/60 mt-1">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Folder Navigation */}
      <div className="px-6 py-4 border-b border-white/10 bg-bgDark3/20">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFolder("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedFolder === "all"
                ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPurple/40 text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
          >
            <FileText className="w-4 h-4" />
            All ({notes.length})
          </button>

          {FOLDERS.map((folder) => {
            const FolderIcon = folder.icon;
            const count = getFolderStats(folder.id);

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedFolder === folder.id
                    ? "bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPurple/40 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                }`}
              >
                <FolderIcon className={`w-4 h-4 ${folder.color}`} />
                {folder.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/40 flex items-center justify-center mb-4"
            >
              <StickyNote className="w-8 h-8 text-neonPink" />
            </motion.div>
            <p className="text-white/60 mb-2">No notes in this folder</p>
            <p className="text-xs text-white/40">
              Create notes from the Shared Notes Board
            </p>
          </div>
        ) : (
          filteredNotes.map((note, index) => {
            const currentFolder = FOLDERS.find((f) => f.id === note.folder);
            const FolderIcon = currentFolder?.icon || Folder;

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="bg-bgDark3/50 backdrop-blur-xl border border-white/10 hover:border-neonPurple/30 rounded-xl p-4 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br from-neonPink/10 to-neonPurple/10 border border-white/10 flex items-center justify-center flex-shrink-0`}
                    >
                      <FolderIcon
                        className={`w-5 h-5 ${currentFolder?.color || "text-white"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {note.title}
                      </h3>
                      <p className="text-white/60 text-xs line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setPreviewNote(note)}
                      className="p-1.5 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 rounded-lg transition-all duration-300"
                    >
                      <Eye className="w-3.5 h-3.5 text-white/60 hover:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white/60 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Move to Folder Dropdown */}
                <div className="flex items-center justify-between text-xs text-white/40 pt-3 mt-3 border-t border-white/5">
                  <span>
                    By {note.createdByUsername} •{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={note.folder}
                    onChange={(e) => handleMoveNote(note.id, e.target.value)}
                    className="bg-bgDark3/80 text-white/80 border border-white/10 rounded px-2 py-1 text-xs outline-none hover:border-neonPurple/40 transition-colors duration-300 cursor-pointer"
                  >
                    {FOLDERS.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewNote(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bgDark2 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white pr-4">
                  {previewNote.title}
                </h3>
                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {previewNote.content}
              </p>

              <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <span>Created by {previewNote.createdByUsername}</span>
                  <span>
                    {new Date(previewNote.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">
                  {previewNote.folder}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
