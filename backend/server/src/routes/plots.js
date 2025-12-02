import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { listPlots, createPlot, updatePlot, deletePlot } from '../controllers/plotsController.js';

const router = express.Router();

router.get('/', authMiddleware, listPlots);
// Only admin can create plots. Admin and gestor can update. Only admin can delete.
router.post('/', authMiddleware, authorize('admin'), createPlot);
router.put('/:id', authMiddleware, authorize('admin', 'gestor'), updatePlot);
router.delete('/:id', authMiddleware, authorize('admin'), deletePlot);

export default router;
