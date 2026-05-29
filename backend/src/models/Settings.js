import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  shopName: { type: String, default: 'Black Crown Barber' },
  address: { type: String, default: '' },
  timezone: { type: String, default: 'America/Bogota' },
  openTime: { type: String, default: '09:00' },
  closeTime: { type: String, default: '21:00' },
  slotDuration: { type: Number, default: 45 },
  openDays: {
    type: [Number],
    default: [1, 2, 3, 4, 5, 6] // 0=domingo, 1=lunes... 6=sábado
  }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);