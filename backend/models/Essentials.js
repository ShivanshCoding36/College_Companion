import mongoose from 'mongoose';

const essentialsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
  },
  essentials: {
    creativeQuestions: [{
      question: String,
      unit: String,
    }],
    theoryTopics: [{
      topic: String,
      unit: String,
      importance: String,
    }],
    numericalTopics: [{
      topic: String,
      unit: String,
      difficulty: String,
    }],
    marksDistribution: {
      twoMarks: [String],
      threeMarks: [String],
      fourteenMarks: [String],
      sixteenMarks: [String],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

essentialsSchema.index({ userId: 1, createdAt: -1 });

const Essentials = mongoose.model('Essentials', essentialsSchema);

export default Essentials;
