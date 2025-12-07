import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getMyProfile,
  updateProfile,
  updateSettings,
  uploadAvatar,
  deleteProfile,
} from '../controllers/profileController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads/avatars directory if it doesn't exist
const avatarsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.uid}-${uniqueSuffix}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// All routes require authentication
router.use(verifyFirebaseToken);

/**
 * @route   GET /api/profile/me
 * @desc    Get or create user profile
 * @access  Private
 */
router.get('/me', getMyProfile);

/**
 * @route   PUT /api/profile/update
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update', updateProfile);

/**
 * @route   PUT /api/profile/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put('/settings', updateSettings);

/**
 * @route   POST /api/profile/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', avatarUpload.single('avatar'), uploadAvatar);

/**
 * @route   DELETE /api/profile/delete
 * @desc    Delete user profile
 * @access  Private
 */
router.delete('/delete', deleteProfile);

export default router;
