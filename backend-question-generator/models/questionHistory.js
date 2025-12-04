import mongoose from 'mongoose';

/**
 * Question History Schema
 * Stores all generated question sets with their context
 */
const questionHistorySchema = new mongoose.Schema({
  syllabus: {
    type: String,
    required: [true, 'Syllabus content is required'],
    trim: true,
    minlength: [10, 'Syllabus must be at least 10 characters long']
  },
  questionType: {
    type: String,
    required: [true, 'Question type is required'],
    enum: {
      values: [
        'mcq',
        'short-answer',
        'long-answer',
        'true-false',
        'fill-in-blank',
        'case-study',
        'numerical',
        'conceptual',
        'mixed'
      ],
      message: '{VALUE} is not a valid question type'
    }
  },
  generatedQuestions: {
    type: [String],
    required: [true, 'Generated questions are required'],
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one question must be generated'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'questionHistory' // Explicit collection name
});

// Index for faster queries
questionHistorySchema.index({ createdAt: -1 });
questionHistorySchema.index({ questionType: 1 });

// Virtual for question count
questionHistorySchema.virtual('questionCount').get(function() {
  return this.generatedQuestions.length;
});

// Method to get formatted date
questionHistorySchema.methods.getFormattedDate = function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Ensure virtuals are included in JSON responses
questionHistorySchema.set('toJSON', { virtuals: true });
questionHistorySchema.set('toObject', { virtuals: true });

const QuestionHistory = mongoose.model('QuestionHistory', questionHistorySchema);

export default QuestionHistory;
