import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/:id - Get user by Firebase UID or MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let user;
    
    // Try to find by Firebase UID first
    user = await User.findOne({ firebaseUID: id });
    
    // If not found, try MongoDB ObjectId
    if (!user) {
      user = await User.findById(id);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data'
    });
  }
});

// POST /api/users - Create or update user
router.post('/', async (req, res) => {
  try {
    const { email, name, firebaseUID, photoURL } = req.body;
    
    if (!email || !name || !firebaseUID) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and firebaseUID are required'
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUID });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      if (photoURL) user.photoURL = photoURL;
      user.updatedAt = new Date();
      await user.save();
      
      console.log('✅ User updated:', email);
    } else {
      // Create new user
      user = new User({
        email,
        name,
        firebaseUID,
        photoURL
      });
      await user.save();
      
      console.log('✅ New user created:', email);
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating/updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create/update user'
    });
  }
});

// DELETE /api/users/:id - Delete user by Firebase UID or MongoDB ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let user;
    
    // Try to find and delete by Firebase UID first
    user = await User.findOneAndDelete({ firebaseUID: id });
    
    // If not found, try MongoDB ObjectId
    if (!user) {
      user = await User.findByIdAndDelete(id);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    console.log('✅ User deleted:', user.email);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

export default router;
