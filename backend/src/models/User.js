import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'barbero', 'cliente'], default: 'cliente' },
  password: { type: String, required: true, minlength: 8 },
  notes: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastVisitAt: Date
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
