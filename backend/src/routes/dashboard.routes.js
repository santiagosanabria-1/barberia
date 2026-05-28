import { Router } from 'express';
import { dashboard } from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', protect, authorize('admin'), dashboard);
export default router;
