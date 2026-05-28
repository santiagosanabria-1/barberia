import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type Form = z.infer<typeof schema>;

const demoAccounts: Array<{ label: string; role: Role; email: string; password: string; target: string }> = [
  { label: 'Admin', role: 'admin', email: 'admin@blackcrown.co', password: 'Admin12345', target: '/app' },
  { label: 'Barbero', role: 'barbero', email: 'admin@blackcrown.co', password: 'Admin12345', target: '/agenda' }
];

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [target, setTarget] = useState('/app');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: 'admin@blackcrown.co', password: 'Admin12345' } });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      toast.success('Sesión iniciada');
      navigate(target);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión';
      toast.error(message.includes('Network') ? 'No se pudo conectar con el backend. Verifica que esté encendido.' : message);
    }
  });
  return <Card className="mx-auto w-full max-w-md"><h2 className="text-3xl font-black">Ingresar</h2><p className="mt-2 text-white/55">Acceso interno de Sebastian Gamboa para operar como admin y barbero.</p><div className="mt-6 grid grid-cols-2 gap-2">{demoAccounts.map((account) => <button key={account.role} type="button" onClick={() => { setValue('email', account.email); setValue('password', account.password); setTarget(account.target); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70 transition hover:border-crown-gold/60 hover:text-crown-gold">{account.label}</button>)}</div><form onSubmit={onSubmit} className="mt-6 grid gap-4"><input placeholder="Email" {...register('email')} /><small className="text-red-300">{errors.email?.message}</small><input type="password" placeholder="Contraseña" {...register('password')} /><small className="text-red-300">{errors.password?.message}</small><Button disabled={isSubmitting}>Entrar al panel</Button></form><p className="mt-6 text-sm text-white/55">¿Eres cliente? <Link className="text-crown-gold" to="/reservar">Reserva sin iniciar sesión</Link></p></Card>;
}
