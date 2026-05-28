import { Router } from 'express';
import { login, logout, profile, register } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.post('/logout', logout);
router.get('/profile', protect, profile);
export default router;
