import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { listActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activitiesController.js';

const router = express.Router();

router.get('/', authMiddleware, listActivities);
// Only admin/gestor can create/update/delete activities
// allow gestor to create and update activities, but only admin can delete
router.post('/', authMiddleware, authorize('admin', 'gestor'), createActivity);
router.put('/:id', authMiddleware, authorize('admin', 'gestor'), updateActivity);
router.delete('/:id', authMiddleware, authorize('admin'), deleteActivity);

export default router;
