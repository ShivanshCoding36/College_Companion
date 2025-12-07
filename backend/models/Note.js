import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  type: {
    type: String,
    enum: ['survival-plan', 'question-generator', 'notes-repository', 'study-session', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

noteSchema.index({ userId: 1, createdAt: -1 });

const Note = mongoose.model('Note', noteSchema, 'notes');

export default Note;
