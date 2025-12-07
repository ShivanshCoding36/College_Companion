import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  question: {
    type: String,
    required: true,
  },
  contextNotes: {
    type: String,
  },
  answer: {
    type: String,
    required: true,
  },
  sources: [{
    noteId: mongoose.Schema.Types.ObjectId,
    noteTitle: String,
    relevance: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

doubtSchema.index({ userId: 1, createdAt: -1 });

const Doubt = mongoose.model('Doubt', doubtSchema);

export default Doubt;
