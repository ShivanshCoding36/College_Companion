import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/notesController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyFirebaseToken, createNote);
router.get('/', verifyFirebaseToken, getNotes);
router.put('/:id', verifyFirebaseToken, updateNote);
router.delete('/:id', verifyFirebaseToken, deleteNote);

export default router;
