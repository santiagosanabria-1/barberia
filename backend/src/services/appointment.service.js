import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Barber from '../models/Barber.js';
import { ApiError } from '../utils/apiError.js';

const OPEN_DAYS = [1, 2, 3, 4, 5];
const OPEN_TIME = '09:00';
const CLOSE_TIME = '21:00';

const parseBusinessDate = (value) => {
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day);
};

const minutesToTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getBusinessSchedule = () => ({
  days: OPEN_DAYS,
  open: OPEN_TIME,
  close: CLOSE_TIME,
  label: 'Lunes a viernes, 9:00 a.m. a 9:00 p.m.'
});

export const generateSlots = () => {
  const slots = [];
  for (let minutes = timeToMinutes(OPEN_TIME); minutes < timeToMinutes(CLOSE_TIME); minutes += 30) {
    slots.push(minutesToTime(minutes));
  }
  return slots;
};

export const ensureSlotAvailable = async ({ barber, date, time, appointmentId }) => {
  const barberDoc = await Barber.findById(barber);
  if (!barberDoc || !barberDoc.isAvailable) throw new ApiError(400, 'Barber is not available');

  const appointmentDate = String(date).includes('-') ? parseBusinessDate(date) : new Date(date);
  appointmentDate.setHours(0, 0, 0, 0);
  if (!OPEN_DAYS.includes(appointmentDate.getDay())) throw new ApiError(400, 'Black Crown opens only Monday to Friday');
  if (!generateSlots().includes(time)) throw new ApiError(400, 'Selected time is outside business hours');

  const nextDay = new Date(appointmentDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const conflict = await Appointment.findOne({
    barber,
    time,
    status: { $in: ['pendiente', 'confirmada'] },
    date: { $gte: appointmentDate, $lt: nextDay },
    ...(appointmentId ? { _id: { $ne: appointmentId } } : {})
  });
  if (conflict) throw new ApiError(409, 'This slot is already booked');

  const blocked = barberDoc.shifts.some((shift) =>
    shift.blockedSlots?.some((slot) => new Date(slot.date).toDateString() === appointmentDate.toDateString() && slot.time === time)
  );
  if (blocked) throw new ApiError(409, 'This slot is blocked');
};

export const createAppointmentPayload = async (body, user) => {
  const service = await Service.findById(body.service);
  if (!service || !service.isActive) throw new ApiError(400, 'Invalid service');
  await ensureSlotAvailable({ barber: body.barber, date: body.date, time: body.time });
  return {
    client: body.client || user?._id,
    barber: body.barber,
    service: body.service,
    price: service.price,
    date: String(body.date).includes('-') ? parseBusinessDate(body.date) : body.date,
    time: body.time,
    status: body.status || 'pendiente',
    notes: body.notes || ''
  };
};

export const getAvailabilityForDate = async ({ barber, date }) => {
  const appointmentDate = parseBusinessDate(date);
  appointmentDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(appointmentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const isOpen = OPEN_DAYS.includes(appointmentDate.getDay());
  const slots = generateSlots();
  const appointments = isOpen ? await Appointment.find({
    barber,
    date: { $gte: appointmentDate, $lt: nextDay },
    status: { $in: ['pendiente', 'confirmada'] }
  }).select('time status') : [];
  const reserved = new Set(appointments.map((appointment) => appointment.time));

  return {
    date,
    isOpen,
    schedule: getBusinessSchedule(),
    slots: slots.map((time) => ({ time, reserved: reserved.has(time), available: isOpen && !reserved.has(time) }))
  };
};
