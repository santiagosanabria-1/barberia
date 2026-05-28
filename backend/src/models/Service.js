import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  duration: { type: Number, default: 45 },
  category: { type: String, default: 'barberia' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
