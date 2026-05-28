import { Router } from 'express';
import Barber from '../models/Barber.js';
import { crudController } from '../controllers/crud.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();
const barber = crudController(Barber, { populate: 'user' });
router.get('/', async (_req, res, next) => {
  try { res.json(await Barber.find({ isAvailable: true }).sort({ createdAt: -1 }).populate('user', '-password')); } catch (error) { next(error); }
});
router.post('/', protect, authorize('admin'), barber.create);
router.put('/:id', protect, authorize('admin'), barber.update);
router.delete('/:id', protect, authorize('admin'), barber.remove);
export default router;
