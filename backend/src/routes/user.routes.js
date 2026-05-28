import { Router } from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.get('/', authorize('admin', 'barbero'), async (_req, res, next) => {
  try { res.json(await User.find().select('-password').sort({ createdAt: -1 })); } catch (error) { next(error); }
});
router.put('/:id', authorize('admin'), async (req, res, next) => {
  try { res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')); } catch (error) { next(error); }
});
export default router;
