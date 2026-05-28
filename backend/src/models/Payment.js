import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  items: [{ name: String, quantity: Number, price: Number, type: { type: String, enum: ['service', 'product'], default: 'service' } }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  method: { type: String, enum: ['efectivo', 'tarjeta', 'transferencia', 'Nequi', 'Daviplata'], required: true },
  status: { type: String, enum: ['pendiente', 'pagado', 'anulado'], default: 'pagado' },
  invoiceNumber: { type: String, unique: true }
}, { timestamps: true });

paymentSchema.pre('save', function setInvoice(next) {
  if (!this.invoiceNumber) this.invoiceNumber = `BC-${Date.now().toString(36).toUpperCase()}`;
  next();
});

export default mongoose.model('Payment', paymentSchema);
