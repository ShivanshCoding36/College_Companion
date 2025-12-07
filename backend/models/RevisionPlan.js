import mongoose from 'mongoose';

const revisionPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  syllabusText: {
    type: String,
    required: true,
  },
  preferences: {
    studyHoursPerDay: Number,
    preferredTimes: [String],
    topics: [String],
  },
  plan: {
    weeks: [{
      weekNumber: Number,
      topics: [String],
      dailySchedule: [{
        day: String,
        tasks: [String],
        duration: String,
      }],
    }],
    tips: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

revisionPlanSchema.index({ userId: 1, createdAt: -1 });

const RevisionPlan = mongoose.model('RevisionPlan', revisionPlanSchema);

export default RevisionPlan;
