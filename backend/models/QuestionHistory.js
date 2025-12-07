import mongoose from 'mongoose';

const questionHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  syllabus: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ['2m', '3m', '14m', '16m'],
  },
  questions: [{
    question: String,
    marks: Number,
    topic: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Index for efficient user queries
questionHistorySchema.index({ userId: 1, createdAt: -1 });

const QuestionHistory = mongoose.model('QuestionHistory', questionHistorySchema);

export default QuestionHistory;
