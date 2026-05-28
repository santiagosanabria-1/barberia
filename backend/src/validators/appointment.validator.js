export const appointmentValidator = (body) => {
  if (!body.barber) return 'Barber is required';
  if (!body.service) return 'Service is required';
  if (!body.date) return 'Date is required';
  if (!/^\d{2}:\d{2}$/.test(body.time || '')) return 'Time must use HH:mm format';
  if (body.status && !['pendiente', 'confirmada', 'completada', 'cancelada'].includes(body.status)) return 'Invalid appointment status';
  return true;
};
