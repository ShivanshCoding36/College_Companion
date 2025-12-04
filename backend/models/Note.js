import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['survival-plan', 'question-generator', 'notes-repository', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema, 'notes');

export default Note;
