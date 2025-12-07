import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    trim: true,
  },
  staffName: {
    type: String,
    trim: true,
  },
  credits: {
    type: Number,
    min: 0,
  },
}, { _id: false });

const notificationSettingsSchema = new mongoose.Schema({
  essentialAlerts: {
    type: Boolean,
    default: true,
  },
  studyReminders: {
    type: Boolean,
    default: true,
  },
  timetableChanges: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  darkMode: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: notificationSettingsSchema,
    default: () => ({}),
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'hi', 'ta'],
  },
}, { _id: false });

const userProfileSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // Basic user info
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  year: {
    type: String,
    trim: true,
  },
  section: {
    type: String,
    trim: true,
  },
  registerNumber: {
    type: String,
    trim: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  
  // Academic info
  semester: {
    type: Number,
    min: 1,
    max: 8,
    default: 1,
  },
  subjects: {
    type: [subjectSchema],
    default: [],
  },
  
  // Settings
  settings: {
    type: settingsSchema,
    default: () => ({}),
  },
  
}, {
  timestamps: true,
  collection: 'userprofiles',
});

// Index for faster lookups
userProfileSchema.index({ firebaseUid: 1 });

// Method to sanitize profile before sending to client
userProfileSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
