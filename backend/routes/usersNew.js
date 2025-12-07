import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { createUser, getUser, updateSection } from '../controllers/usersController.js';

const router = express.Router();

/**
 * POST /api/users/create
 * Create new user document (protected)
 */
router.post('/create', verifyFirebaseToken, createUser);

/**
 * GET /api/users/:uid
 * Get user document (protected)
 */
router.get('/:uid', verifyFirebaseToken, getUser);

/**
 * PUT /api/users/:uid/updateSection
 * Update specific section of user data (protected)
 * Body: { section: string, data: any }
 */
router.put('/:uid/updateSection', verifyFirebaseToken, updateSection);

export default router;
