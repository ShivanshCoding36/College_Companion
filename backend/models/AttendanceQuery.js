import mongoose from 'mongoose';

const attendanceQuerySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  question: {
    type: String,
    required: true,
  },
  context: {
    calendarData: Object,
    timetableData: Object,
    attendanceStats: Object,
    leaveHistory: Array,
    absenceTimeline: Array,
  },
  response: {
    canTakeLeave: Boolean,
    impactPercent: Number,
    recommendedDates: [String],
    reasoning: String,
    rawResponse: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

attendanceQuerySchema.index({ userId: 1, createdAt: -1 });

const AttendanceQuery = mongoose.model('AttendanceQuery', attendanceQuerySchema);

export default AttendanceQuery;
