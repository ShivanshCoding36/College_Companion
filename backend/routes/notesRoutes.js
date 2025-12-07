import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/notes
 * Add new note to user's notes repository
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { title, content, pdfURL } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.notesRepository.push({
      title,
      content: content || '',
      pdfURL: pdfURL || '',
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      note: user.notesRepository[user.notesRepository.length - 1]
    });
  } catch (error) {
    console.error('❌ Add note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add note',
      message: error.message
    });
  }
});

/**
 * GET /api/notes
 * Get all notes for current user
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        notes: []
      });
    }

    res.json({
      success: true,
      notes: user.notesRepository
    });
  } catch (error) {
    console.error('❌ Get notes error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      message: error.message
    });
  }
});

/**
 * GET /api/notes/:id
 * Get a specific note by ID
 */
router.get('/:id', verifyFirebaseToken, async (req, res) => {
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

    const note = user.notesRepository.find(n => n._id.toString() === id);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('❌ Get note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note',
      message: error.message
    });
  }
});

/**
 * PUT /api/notes/:id
 * Update a note by ID
 */
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { title, content, pdfURL } = req.body;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const note = user.notesRepository.find(n => n._id.toString() === id);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    // Update note fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (pdfURL !== undefined) note.pdfURL = pdfURL;

    await user.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('❌ Update note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
      message: error.message
    });
  }
});

/**
 * DELETE /api/notes/:id
 * Delete a note by ID
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

    user.notesRepository = user.notesRepository.filter(
      note => note._id.toString() !== id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
      message: error.message
    });
  }
});

export default router;
