import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/attendance
 * Add attendance record to user's history
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { date, subject, present, total, predicted } = req.body;

    if (!date || !subject || present === undefined || total === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Date, subject, present, and total are required'
      });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.attendanceAdvisor.history.push({
      date,
      subject,
      present,
      total,
      predicted: predicted || '',
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Attendance record added successfully',
      record: user.attendanceAdvisor.history[user.attendanceAdvisor.history.length - 1]
    });
  } catch (error) {
    console.error('❌ Add attendance error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add attendance record',
      message: error.message
    });
  }
});

/**
 * GET /api/attendance
 * Get all attendance records for current user
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        history: []
      });
    }

    res.json({
      success: true,
      history: user.attendanceAdvisor.history
    });
  } catch (error) {
    console.error('❌ Get attendance error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance records',
      message: error.message
    });
  }
});

/**
 * GET /api/attendance/stats
 * Get attendance statistics for current user
 */
router.get('/stats', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user || user.attendanceAdvisor.history.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalClasses: 0,
          totalPresent: 0,
          percentage: 0,
          bySubject: {}
        }
      });
    }

    // Calculate statistics
    const history = user.attendanceAdvisor.history;
    const totalPresent = history.reduce((sum, record) => sum + record.present, 0);
    const totalClasses = history.reduce((sum, record) => sum + record.total, 0);
    const percentage = totalClasses > 0 ? (totalPresent / totalClasses * 100).toFixed(2) : 0;

    // Calculate by subject
    const bySubject = {};
    history.forEach(record => {
      if (!bySubject[record.subject]) {
        bySubject[record.subject] = { present: 0, total: 0 };
      }
      bySubject[record.subject].present += record.present;
      bySubject[record.subject].total += record.total;
    });

    // Calculate percentage for each subject
    Object.keys(bySubject).forEach(subject => {
      const data = bySubject[subject];
      bySubject[subject].percentage = data.total > 0 
        ? (data.present / data.total * 100).toFixed(2)
        : 0;
    });

    res.json({
      success: true,
      stats: {
        totalClasses,
        totalPresent,
        percentage,
        bySubject
      }
    });
  } catch (error) {
    console.error('❌ Get attendance stats error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate attendance statistics',
      message: error.message
    });
  }
});

/**
 * DELETE /api/attendance/:id
 * Delete an attendance record by ID
 */
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.attendanceAdvisor.history = user.attendanceAdvisor.history.filter(
      record => record._id.toString() !== id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete attendance error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance record',
      message: error.message
    });
  }
});

export default router;
