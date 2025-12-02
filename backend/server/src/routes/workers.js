import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { listWorkers, createWorker, updateWorker, deleteWorker } from '../controllers/workersController.js';

const router = express.Router();

router.get('/', authMiddleware, listWorkers);
// admin creates/deletes workers; gestor can edit (update)
router.post('/', authMiddleware, authorize('admin'), createWorker);
router.put('/:id', authMiddleware, authorize('admin', 'gestor'), updateWorker);
router.delete('/:id', authMiddleware, authorize('admin'), deleteWorker);

export default router;
