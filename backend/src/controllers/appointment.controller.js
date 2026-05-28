import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Barber from '../models/Barber.js';
import { ApiError } from '../utils/apiError.js';
import { createAppointmentPayload, ensureSlotAvailable, getAvailabilityForDate } from '../services/appointment.service.js';
import { sendAppointmentConfirmation, notifyBarberAttendance } from '../services/whatsapp.service.js';
import crypto from 'crypto';

const populate = [{ path: 'client', select: 'name email phone' }, { path: 'service' }, { path: 'barber', populate: { path: 'user', select: 'name email phone' } }];

export const getAppointments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'cliente') query.client = req.user._id;
    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 }).populate(populate);
    res.json(appointments);
  } catch (error) { next(error); }
};

export const createAppointment = async (req, res, next) => {
  try {
    const payload = await createAppointmentPayload(req.body, req.user);
    const appointment = await Appointment.create(payload);
    res.status(201).json(await appointment.populate(populate));
  } catch (error) { next(error); }
};

export const getAvailability = async (req, res, next) => {
  try {
    const barber = req.query.barber || (await Barber.findOne({ isAvailable: true }).populate('user'))?._id;
    if (!barber) throw new ApiError(404, 'No barber available');
    if (!req.query.date) throw new ApiError(400, 'Date is required');
    res.json(await getAvailabilityForDate({ barber, date: req.query.date }));
  } catch (error) { next(error); }
};

export const createPublicAppointment = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.phone) throw new ApiError(400, 'Name and phone are required');
    const email = req.body.email || `cliente-${String(req.body.phone).replace(/\D/g, '')}@blackcrown.local`;
    let client = await User.findOne({ email });
    if (!client) {
      client = await User.create({ name: req.body.name, email, phone: req.body.phone, role: 'cliente', password: `Guest${Date.now()}` });
    } else {
      client.name = req.body.name;
      client.phone = req.body.phone;
      client.isActive = true;
      await client.save();
    }
    const payload = await createAppointmentPayload({ ...req.body, client: client._id, status: 'pendiente' });
    const appointment = await Appointment.create({ ...payload, attendanceToken: crypto.randomBytes(24).toString('hex') });
    const populated = await appointment.populate(populate);
    await sendAppointmentConfirmation({ appointment: populated }).catch((error) => console.error('[WhatsApp confirmation failed]', error.message));
    res.status(201).json(populated);
  } catch (error) { next(error); }
};

export const confirmAttendance = async (req, res, next) => {
  try {
    const willAttend = req.params.answer === 'yes';
    if (!['yes', 'no'].includes(req.params.answer)) throw new ApiError(400, 'Invalid confirmation answer');
    const appointment = await Appointment.findOneAndUpdate(
      { attendanceToken: req.params.token },
      { attendanceStatus: willAttend ? 'asistira' : 'no_asistira', attendanceConfirmedAt: new Date(), status: willAttend ? 'confirmada' : 'cancelada' },
      { new: true }
    ).populate(populate);
    if (!appointment) throw new ApiError(404, 'Confirmation link not found');
    await notifyBarberAttendance({ appointment, willAttend }).catch((error) => console.error('[WhatsApp barber notify failed]', error.message));
    res.type('html').send(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Black Crown Barber</title><style>body{margin:0;background:#050505;color:#f6f1e8;font-family:system-ui;display:grid;min-height:100vh;place-items:center}.card{max-width:520px;margin:24px;padding:32px;border:1px solid rgba(214,168,79,.3);border-radius:28px;background:rgba(255,255,255,.06);box-shadow:0 0 45px rgba(214,168,79,.14)}h1{margin:0 0 12px;font-size:32px}.gold{color:#d6a84f}p{color:rgba(246,241,232,.72);line-height:1.55}a{color:#d6a84f}</style></head><body><main class="card"><p class="gold">Black Crown Barber</p><h1>${willAttend ? 'Asistencia confirmada' : 'Reserva cancelada'}</h1><p>${willAttend ? `Gracias ${appointment.client.name}. Sebastian Gamboa ya fue notificado de que sí asistirás a tu cita.` : `Gracias por avisar. Sebastian Gamboa ya fue notificado para liberar este horario.`}</p><p>Servicio: ${appointment.service.name}</p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/reservar">Volver a reservar</a></main></body></html>`);
  } catch (error) { next(error); }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (req.body.barber || req.body.date || req.body.time) {
      await ensureSlotAvailable({ barber: req.body.barber || appointment.barber, date: req.body.date || appointment.date, time: req.body.time || appointment.time, appointmentId: appointment._id });
    }
    Object.assign(appointment, req.body);
    await appointment.save();
    if (appointment.status === 'completada') {
      await Payment.findOneAndUpdate({ appointment: appointment._id }, {
        client: appointment.client,
        barber: appointment.barber,
        appointment: appointment._id,
        service: appointment.service,
        items: [{ name: 'Servicio completado', quantity: 1, price: appointment.price, type: 'service' }],
        subtotal: appointment.price,
        tax: 0,
        total: appointment.price,
        method: req.body.method || 'efectivo',
        status: 'pagado'
      }, { upsert: true, new: true });
    }
    res.json(await appointment.populate(populate));
  } catch (error) { next(error); }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelada' }, { new: true });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    res.json(appointment);
  } catch (error) { next(error); }
};
