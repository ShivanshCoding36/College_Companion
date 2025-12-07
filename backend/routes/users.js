import express from 'express';
import User from '../models/User.js';
import { getAuth, getDb } from '../services/firebase/index.js';

const router = express.Router();

// GET /api/users/:uid - Get user details from Firebase, Firestore, and MongoDB
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const auth = getAuth();
    const db = getDb();

    const [firebaseUser, firestoreDoc, mongoUser] = await Promise.all([
      auth.getUser(uid).catch(() => null),
      db.collection('users').doc(uid).get().catch(() => null),
      User.findOne({ firebaseUID: uid }).lean().catch(() => null)
    ]);

    let mongoDocument = mongoUser;

    if (!mongoDocument) {
      mongoDocument = await User.findById(uid).lean().catch(() => null);
    }

    if (!firebaseUser && !mongoDocument && !firestoreDoc?.exists) {
      return res.json({
        success: false,
        error: 'User not found',
        uid
      });
    }

    const firestoreData = firestoreDoc?.exists ? firestoreDoc.data() : null;

    const response = {
      uid: firebaseUser?.uid || mongoDocument?.firebaseUID || uid,
      email: firebaseUser?.email || mongoDocument?.email || firestoreData?.email || null,
      name: firebaseUser?.displayName || mongoDocument?.name || firestoreData?.name || null,
      photoURL: firebaseUser?.photoURL || mongoDocument?.photoURL || firestoreData?.photoURL || null,
      phoneNumber: firebaseUser?.phoneNumber || firestoreData?.phoneNumber || null,
      customClaims: firebaseUser?.customClaims || null,
      metadata: firebaseUser
        ? {
            creationTime: firebaseUser.metadata.creationTime,
            lastSignInTime: firebaseUser.metadata.lastSignInTime
          }
        : null,
      firestore: firestoreData,
      mongo: mongoDocument
        ? {
            id: mongoDocument._id,
            email: mongoDocument.email,
            name: mongoDocument.name,
            firebaseUID: mongoDocument.firebaseUID,
            photoURL: mongoDocument.photoURL,
            createdAt: mongoDocument.createdAt,
            updatedAt: mongoDocument.updatedAt,
            onboardingCompleted: mongoDocument.onboardingCompleted || false,
            onboardingData: mongoDocument.onboardingData || null
          }
        : null
    };

    res.json({
      success: true,
      user: response
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.json({
      success: false,
      error: 'Failed to fetch user data',
      details: error.message
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
    res.json({
      success: false,
      error: 'Failed to create/update user',
      details: error.message
    });
  }
});

// POST /api/users/:id/onboarding - Save onboarding data
router.post('/:id/onboarding', async (req, res) => {
  try {
    const { id } = req.params;
    const onboardingData = req.body;
    
    let user;
    
    // Try to find by Firebase UID first
    user = await User.findOne({ firebaseUID: id });
    
    // If not found, try MongoDB ObjectId
    if (!user) {
      user = await User.findById(id);
    }
    
    if (!user) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update user with onboarding data
    user.onboardingData = onboardingData;
    user.onboardingCompleted = true;
    user.updatedAt = new Date();
    await user.save();
    
    console.log('✅ Onboarding data saved for:', user.email);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
        onboardingCompleted: user.onboardingCompleted,
        onboardingData: user.onboardingData,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error saving onboarding data:', error);
    res.json({
      success: false,
      error: 'Failed to save onboarding data',
      details: error.message
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
      return res.json({
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
    res.json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

export default router;
