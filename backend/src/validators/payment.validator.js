export const paymentValidator = (body) => {
  if (!body.client) return 'Client is required';
  if (!['efectivo', 'tarjeta', 'transferencia', 'Nequi', 'Daviplata'].includes(body.method)) return 'Invalid payment method';
  if (!Array.isArray(body.items) || body.items.length === 0) return 'Payment items are required';
  return true;
};
