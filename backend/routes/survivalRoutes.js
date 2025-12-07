import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/survival/essentials
 * Add new essential to user's survival kit
 */
router.post('/essentials', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.survivalKit.essentials.push({
      title,
      content,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Essential added successfully',
      essential: user.survivalKit.essentials[user.survivalKit.essentials.length - 1]
    });
  } catch (error) {
    console.error('❌ Add essential error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add essential',
      message: error.message
    });
  }
});

/**
 * GET /api/survival/essentials
 * Get all essentials for current user
 */
router.get('/essentials', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        essentials: []
      });
    }

    res.json({
      success: true,
      essentials: user.survivalKit.essentials
    });
  } catch (error) {
    console.error('❌ Get essentials error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch essentials',
      message: error.message
    });
  }
});

/**
 * DELETE /api/survival/essentials/:id
 * Delete an essential by ID
 */
router.delete('/essentials/:id', verifyFirebaseToken, async (req, res) => {
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

    user.survivalKit.essentials = user.survivalKit.essentials.filter(
      item => item._id.toString() !== id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Essential deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete essential error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete essential',
      message: error.message
    });
  }
});

/**
 * POST /api/survival/revision-strategies
 * Add new revision strategy to user's survival kit
 */
router.post('/revision-strategies', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { topic, strategy } = req.body;

    if (!topic || !strategy) {
      return res.status(400).json({
        success: false,
        error: 'Topic and strategy are required'
      });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.survivalKit.revisionStrategies.push({
      topic,
      strategy,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Revision strategy added successfully',
      strategy: user.survivalKit.revisionStrategies[user.survivalKit.revisionStrategies.length - 1]
    });
  } catch (error) {
    console.error('❌ Add revision strategy error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add revision strategy',
      message: error.message
    });
  }
});

/**
 * GET /api/survival/revision-strategies
 * Get all revision strategies for current user
 */
router.get('/revision-strategies', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        strategies: []
      });
    }

    res.json({
      success: true,
      strategies: user.survivalKit.revisionStrategies
    });
  } catch (error) {
    console.error('❌ Get revision strategies error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revision strategies',
      message: error.message
    });
  }
});

/**
 * POST /api/survival/plans
 * Add new survival plan to user's survival kit
 */
router.post('/plans', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { title, plan } = req.body;

    if (!title || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Title and plan are required'
      });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.survivalKit.survivalPlans.push({
      title,
      plan,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Survival plan added successfully',
      plan: user.survivalKit.survivalPlans[user.survivalKit.survivalPlans.length - 1]
    });
  } catch (error) {
    console.error('❌ Add survival plan error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add survival plan',
      message: error.message
    });
  }
});

/**
 * GET /api/survival/plans
 * Get all survival plans for current user
 */
router.get('/plans', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        plans: []
      });
    }

    res.json({
      success: true,
      plans: user.survivalKit.survivalPlans
    });
  } catch (error) {
    console.error('❌ Get survival plans error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch survival plans',
      message: error.message
    });
  }
});

/**
 * DELETE /api/survival/plans/:id
 * Delete a survival plan by ID
 */
router.delete('/plans/:id', verifyFirebaseToken, async (req, res) => {
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

    user.survivalKit.survivalPlans = user.survivalKit.survivalPlans.filter(
      item => item._id.toString() !== id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Survival plan deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete survival plan error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete survival plan',
      message: error.message
    });
  }
});

export default router;
