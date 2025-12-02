import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { listAssignments, createAssignment, deleteAssignment } from '../controllers/assignmentsController.js';

const router = express.Router();

router.get('/', authMiddleware, listAssignments);
// only admin can create/delete assignments
router.post('/', authMiddleware, authorize('admin'), createAssignment);
router.delete('/:id', authMiddleware, authorize('admin'), deleteAssignment);

export default router;
