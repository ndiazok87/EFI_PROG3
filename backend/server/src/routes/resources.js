import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { listResources, createResource, updateResource, deleteResource } from '../controllers/resourcesController.js';

const router = express.Router();

// require auth to view resources
router.get('/', authMiddleware, listResources);
// only admin/gestor can create/update/delete
router.post('/', authMiddleware, authorize('admin', 'gestor'), createResource);
router.put('/:id', authMiddleware, authorize('admin', 'gestor'), updateResource);
// only admin can delete resources
router.delete('/:id', authMiddleware, authorize('admin'), deleteResource);

export default router;
