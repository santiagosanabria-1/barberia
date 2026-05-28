import { Router } from 'express';
import { confirmAttendance, createAppointment, createPublicAppointment, deleteAppointment, getAppointments, getAvailability, updateAppointment } from '../controllers/appointment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { appointmentValidator } from '../validators/appointment.validator.js';

const router = Router();
router.get('/availability', getAvailability);
router.post('/public', validate(appointmentValidator), createPublicAppointment);
router.get('/attendance/:token/:answer', confirmAttendance);
router.use(protect);
router.get('/', getAppointments);
router.post('/', validate(appointmentValidator), createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
export default router;
