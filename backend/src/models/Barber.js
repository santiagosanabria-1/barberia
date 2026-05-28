import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  blockedSlots: [{ date: Date, time: String, reason: String }]
}, { _id: false });

const barberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty: { type: String, default: 'Cortes premium' },
  bio: { type: String, default: '' },
  commissionRate: { type: Number, default: 45 },
  rating: { type: Number, default: 5 },
  shifts: { type: [shiftSchema], default: [] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Barber', barberSchema);
