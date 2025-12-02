import express from 'express';
import { listProfiles, getProfile, updateProfile } from '../controllers/profilesController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, listProfiles);
router.get('/:id', authMiddleware, getProfile);
router.put('/:id', authMiddleware, updateProfile);

export default router;
