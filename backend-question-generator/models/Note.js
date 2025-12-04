import mongoose from 'mongoose';

/**
 * Notes Schema
 * Stores saved question sets as notes
 */
const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Note content is required']
  },
  questions: {
    type: [String],
    required: [true, 'Questions are required']
  },
  questionType: {
    type: String,
    required: true
  },
  syllabus: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true,
  collection: 'notes' // Explicit collection name in test database
});

// Index for faster queries
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ questionType: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
