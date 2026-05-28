import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Barber from '../models/Barber.js';
import Product from '../models/Product.js';

dotenv.config();
await connectDB();

const ensureUser = async ({ name, email, password, role, phone }) => {
  let user = await User.findOne({ email });
  if (!user) return User.create({ name, email, password, role, phone });
  user.name = name;
  user.phone = phone;
  user.role = role;
  user.password = password;
  user.isActive = true;
  await user.save();
  return user;
};

const admin = await ensureUser({ name: 'Sebastian Gamboa', email: 'admin@blackcrown.co', password: 'Admin12345', role: 'admin', phone: '+57 300 000 0000' });

await Barber.updateMany({ user: { $ne: admin._id } }, { isAvailable: false });
await Barber.findOneAndUpdate({ user: admin._id }, { user: admin._id, specialty: 'Corte premium, fade y barba', commissionRate: 100, rating: 5, isAvailable: true, shifts: [{ day: 1, start: '09:00', end: '21:00' }, { day: 2, start: '09:00', end: '21:00' }, { day: 3, start: '09:00', end: '21:00' }, { day: 4, start: '09:00', end: '21:00' }, { day: 5, start: '09:00', end: '21:00' }] }, { upsert: true });

const client = await ensureUser({ name: 'Valentina Reyes', email: 'cliente@blackcrown.co', password: 'Cliente12345', role: 'cliente', phone: '+57 300 222 2222' });

await Service.bulkWrite([
  { updateOne: { filter: { name: 'Corte clásico' }, update: { price: 20000, duration: 40 }, upsert: true } },
  { updateOne: { filter: { name: 'Fade' }, update: { price: 25000, duration: 45 }, upsert: true } },
  { updateOne: { filter: { name: 'Barba' }, update: { price: 15000, duration: 30 }, upsert: true } },
  { updateOne: { filter: { name: 'Corte + barba' }, update: { price: 35000, duration: 60 }, upsert: true } }
]);

await Product.bulkWrite([
  { updateOne: { filter: { sku: 'BC-WAX-01' }, update: { name: 'Cera mate premium', sku: 'BC-WAX-01', category: 'styling', price: 32000, cost: 16000, stock: 18, minStock: 6 }, upsert: true } },
  { updateOne: { filter: { sku: 'BC-OIL-01' }, update: { name: 'Aceite para barba', sku: 'BC-OIL-01', category: 'barba', price: 28000, cost: 13000, stock: 9, minStock: 5 }, upsert: true } }
]);

console.log('Seed completed', {
  admin: { email: admin.email, password: 'Admin12345' },
  barber: { name: admin.name, email: admin.email, password: 'Admin12345' },
  client: { email: client.email, password: 'Cliente12345' }
});
process.exit(0);
