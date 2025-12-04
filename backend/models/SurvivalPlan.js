import mongoose from 'mongoose';

const survivalPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
  },
  userSkills: {
    type: [String],
    required: true,
  },
  stressLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
  },
  timeAvailable: {
    type: String,
    required: true,
  },
  examDates: {
    type: [String],
    required: true,
  },
  goals: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  generatedPlan: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SurvivalPlan = mongoose.model('SurvivalPlan', survivalPlanSchema, 'survivalplans');

export default SurvivalPlan;
