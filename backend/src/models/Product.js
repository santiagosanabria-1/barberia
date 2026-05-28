import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  supplier: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
