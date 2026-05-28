import { Router } from 'express';
import { createPayment, getPayments } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { paymentValidator } from '../validators/payment.validator.js';

const router = Router();
router.use(protect);
router.get('/', getPayments);
router.post('/', validate(paymentValidator), createPayment);
export default router;
