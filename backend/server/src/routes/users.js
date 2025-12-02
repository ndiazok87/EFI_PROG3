import express from 'express';
import { signUp, signIn, me } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', signUp);
router.post('/login', signIn);
router.get('/profile', authMiddleware, me);

export default router;
