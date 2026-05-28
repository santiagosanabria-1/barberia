import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['entrada', 'salida', 'ajuste'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
