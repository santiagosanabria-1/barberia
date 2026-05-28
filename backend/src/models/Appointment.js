import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pendiente', 'confirmada', 'completada', 'cancelada'], default: 'pendiente' },
  attendanceStatus: { type: String, enum: ['sin_confirmar', 'asistira', 'no_asistira'], default: 'sin_confirmar' },
  attendanceToken: { type: String, unique: true, sparse: true },
  attendanceConfirmedAt: Date,
  notes: { type: String, default: '' }
}, { timestamps: true });

appointmentSchema.index({ barber: 1, date: 1, time: 1, status: 1 });

export default mongoose.model('Appointment', appointmentSchema);
