import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, push, onValue, set, remove, update } from "firebase/database";
import { db } from "@/firebase/config";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  StickyNote,
  Calendar,
  User as UserIcon,
} from "lucide-react";

export default function SharedNotes({ roomId }) {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const userId = localStorage.getItem("studyArena_userId");
  const username = localStorage.getItem("studyArena_username");

  /**
   * Listen to notes from Firebase RTDB
   * Path: rooms/<roomId>/notes
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
        // Sort by timestamp (newest first)
        notesList.sort((a, b) => b.createdAt - a.createdAt);
        setNotes(notesList);
      } else {
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  /**
   * Create a new note
   */
  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const notesRef = ref(db, `rooms/${roomId}/notes`);
      const newNoteRef = push(notesRef);

      await set(newNoteRef, {
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        folder: "General", // Default folder
        createdBy: userId,
        createdByUsername: username,
        createdAt: Date.now(),
        lastModified: Date.now(),
        lastModifiedBy: userId,
      });

      setNewNoteTitle("");
      setNewNoteContent("");
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  /**
   * Start editing a note
   */
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  /**
   * Save edited note
   */
  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      const noteRef = ref(db, `rooms/${roomId}/notes/${editingNoteId}`);

      await update(noteRef, {
        title: editTitle.trim(),
        content: editContent.trim(),
        lastModified: Date.now(),
        lastModifiedBy: userId,
      });

      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  /**
   * Delete a note
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

  return (
    <div className="flex flex-col h-full bg-bgDark2/40 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Notes Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-bgDark3/30">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-neonPink" />
            Shared Notes Board
          </h2>
          <p className="text-xs text-white/60">Collaborate on notes together</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 rounded-lg transition-all duration-300 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Notes Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {/* Create Note Card */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-neonPink/10 to-neonPurple/10 backdrop-blur-xl border border-neonPink/30 rounded-xl p-4"
            >
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full bg-bgDark3/50 text-white placeholder:text-white/40 px-4 py-2 rounded-lg border border-white/10 focus:border-neonPink/40 outline-none mb-3"
                autoFocus
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Start typing your note..."
                rows={4}
                className="w-full bg-bgDark3/50 text-white placeholder:text-white/40 px-4 py-2 rounded-lg border border-white/10 focus:border-neonPink/40 outline-none resize-none"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteTitle("");
                    setNewNoteContent("");
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                  className="px-4 py-2 bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 border border-neonPink/40 disabled:border-white/10 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {notes.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/40 flex items-center justify-center mb-4"
            >
              <StickyNote className="w-8 h-8 text-neonPink" />
            </motion.div>
            <p className="text-white/60 mb-2">No notes yet</p>
            <p className="text-xs text-white/40">
              Create your first shared note to get started
            </p>
          </div>
        )}

        {/* Notes List */}
        {notes.map((note, index) => {
          const isEditing = editingNoteId === note.id;

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-bgDark3/50 backdrop-blur-xl border border-white/10 hover:border-neonPurple/30 rounded-xl p-4 transition-all duration-300 group"
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-bgDark3/50 text-white placeholder:text-white/40 px-4 py-2 rounded-lg border border-white/10 focus:border-neonPurple/40 outline-none mb-3"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full bg-bgDark3/50 text-white placeholder:text-white/40 px-4 py-2 rounded-lg border border-white/10 focus:border-neonPurple/40 outline-none resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editTitle.trim() || !editContent.trim()}
                      className="px-3 py-1.5 bg-gradient-to-br from-neonPink to-neonPurple hover:from-neonPink/80 hover:to-neonPurple/80 disabled:from-white/10 disabled:to-white/10 border border-neonPink/40 disabled:border-white/10 rounded-lg transition-all duration-300 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-white font-semibold text-base flex-1">
                      {note.title}
                    </h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1.5 bg-white/5 hover:bg-neonPurple/20 border border-white/10 hover:border-neonPurple/40 rounded-lg transition-all duration-300"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-white/60 hover:text-neonPurple" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white/60 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3 h-3" />
                        <span>{note.createdByUsername}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {note.lastModified !== note.createdAt && (
                      <span className="text-white/30 italic">Edited</span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
