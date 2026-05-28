import { Router } from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.get('/', async (req, res, next) => {
  try { res.json(await Notification.find({ $or: [{ user: req.user._id }, { user: null }] }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});
router.put('/:id/read', async (req, res, next) => {
  try { res.json(await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })); } catch (error) { next(error); }
});
export default router;
