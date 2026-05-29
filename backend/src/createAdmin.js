import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado a MongoDB');

  const db = mongoose.connection.db;
  
  const user = await db.collection('users').findOne({ email: 'admin@blackcrown.co' });
  console.log('👤 Usuario:', user.email);
  console.log('🔑 Hash guardado:', user.password);

  const match = await bcrypt.compare('admin1234', user.password);
  console.log('🔐 ¿Contraseña correcta?', match);

  await mongoose.disconnect();
  process.exit(0);
}

testLogin().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});