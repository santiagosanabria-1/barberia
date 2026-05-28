const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('57')) return digits;
  return `57${digits}`;
};

const isConfigured = () => Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);

const time12 = (time) => {
  const [hoursValue, minutes] = time.split(':').map(Number);
  const period = hoursValue >= 12 ? 'p.m.' : 'a.m.';
  const hours = hoursValue % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const sendWhatsAppText = async ({ to, message }) => {
  const phone = normalizePhone(to);
  if (!phone) return { sent: false, reason: 'missing_phone' };

  if (!isConfigured()) {
    console.log('[WhatsApp DEV]', { to: phone, message });
    return { sent: false, reason: 'whatsapp_not_configured' };
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { preview_url: true, body: message }
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'WhatsApp delivery failed');
  return { sent: true, data };
};

export const sendAppointmentConfirmation = async ({ appointment }) => {
  const client = appointment.client;
  const service = appointment.service;
  const barber = appointment.barber;
  const baseUrl = process.env.PUBLIC_API_URL || 'http://localhost:5000';
  const yesUrl = `${baseUrl}/api/appointments/attendance/${appointment.attendanceToken}/yes`;
  const noUrl = `${baseUrl}/api/appointments/attendance/${appointment.attendanceToken}/no`;
  const date = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(appointment.date));
  const message = `Hola ${client.name}, tu cita en Black Crown Barber quedó registrada.\n\nBarbero: ${barber.user.name}\nServicio: ${service.name}\nFecha: ${date}\nHora: ${time12(appointment.time)}\n\nConfirma tu asistencia aquí:\nSí asistiré: ${yesUrl}\nNo podré asistir: ${noUrl}`;

  return sendWhatsAppText({ to: client.phone, message });
};

export const notifyBarberAttendance = async ({ appointment, willAttend }) => {
  const client = appointment.client;
  const barberUser = appointment.barber.user;
  const state = willAttend ? 'SÍ asistirá' : 'NO asistirá';
  const date = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(appointment.date));
  const message = `Actualización de asistencia Black Crown:\n\n${client.name} ${state} a la cita.\nFecha: ${date}\nHora: ${time12(appointment.time)}\nServicio: ${appointment.service.name}\nWhatsApp cliente: ${client.phone}`;

  return sendWhatsAppText({ to: barberUser.phone, message });
};
