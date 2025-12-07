import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/profile
 * Get current user's profile
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        profile: {
          email: req.user.email,
          fullName: '',
          photoURL: '',
          course: '',
          semester: ''
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      profile: user.profile
    });
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

/**
 * PUT /api/profile/update
 * Update current user's profile
 */
router.put('/update', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { fullName, photoURL, course, semester } = req.body;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        profile: {
          email: req.user.email,
          fullName: fullName || '',
          photoURL: photoURL || '',
          course: course || '',
          semester: semester || ''
        }
      });
    } else {
      // Update profile fields
      if (fullName !== undefined) user.profile.fullName = fullName;
      if (photoURL !== undefined) user.profile.photoURL = photoURL;
      if (course !== undefined) user.profile.course = course;
      if (semester !== undefined) user.profile.semester = semester;
      user.profile.updatedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

/**
 * GET /api/profile/full
 * Get full user data including all sections
 */
router.get('/full', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        profile: {
          email: req.user.email
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      user: {
        profile: user.profile,
        survivalKit: user.survivalKit,
        notesRepository: user.notesRepository,
        attendanceAdvisor: user.attendanceAdvisor,
        questionGenerator: user.questionGenerator
      }
    });
  } catch (error) {
    console.error('❌ Get full user data error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
      message: error.message
    });
  }
});

export default router;
