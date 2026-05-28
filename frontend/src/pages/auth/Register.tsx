import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().optional(), password: z.string().min(8), role: z.enum(['admin', 'barbero', 'cliente']) });
type Form = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();
  const create = useAuthStore((state) => state.register);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { role: 'cliente' } });
  const onSubmit = handleSubmit(async (values) => { await create(values); toast.success('Cuenta creada'); navigate('/dashboard'); });
  return <Card className="mx-auto w-full max-w-md"><h2 className="text-3xl font-black">Registro</h2><form onSubmit={onSubmit} className="mt-8 grid gap-4"><input placeholder="Nombre completo" {...register('name')} /><input placeholder="Email" {...register('email')} /><input placeholder="Teléfono" {...register('phone')} /><input type="password" placeholder="Contraseña segura" {...register('password')} /><select {...register('role')}><option value="cliente">Cliente</option><option value="barbero">Barbero</option><option value="admin">Admin</option></select><small className="text-red-300">{Object.values(errors)[0]?.message}</small><Button disabled={isSubmitting}>Crear cuenta</Button></form><p className="mt-6 text-sm text-white/55">Ya tienes cuenta <Link className="text-crown-gold" to="/login">Ingresar</Link></p></Card>;
}
