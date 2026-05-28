import { Router } from 'express';
import Service from '../models/Service.js';
import { crudController } from '../controllers/crud.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();
const service = crudController(Service, { query: { isActive: true } });
router.get('/', service.list);
router.post('/', protect, authorize('admin'), service.create);
router.put('/:id', protect, authorize('admin'), service.update);
router.delete('/:id', protect, authorize('admin'), service.remove);
export default router;
