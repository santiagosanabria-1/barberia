import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, CheckCircle2, Clock, Crown, LockKeyhole, Scissors } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import type { Availability } from '../types';
import { money, time12 } from '../utils/format';

const schema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre'),
  phone: z.string().min(7, 'Ingresa tu teléfono'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  service: z.string().min(1, 'Elige un servicio')
});

type Form = z.infer<typeof schema>;

const today = () => new Date().toISOString().slice(0, 10);

export function PublicBooking() {
  const services = useApi(resources.services, []);
  const barbers = useApi(resources.barbers, []);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('');
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const barber = barbers.data?.[0];
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!barber?._id || !date) return;
    setLoadingAvailability(true);
    setTime('');
    resources.availability(date, barber._id).then(setAvailability).finally(() => setLoadingAvailability(false));
  }, [barber?._id, date]);

  const onSubmit = handleSubmit(async (values) => {
    if (!barber?._id) return toast.error('No hay barbero disponible');
    if (!time) return toast.error('Elige una hora disponible');
    await resources.createPublicAppointment({ ...values, barber: barber._id, date, time });
    toast.success('Reserva recibida. Te confirmaremos pronto.');
    reset();
    setTime('');
    setLoadingAvailability(true);
    resources.availability(date, barber._id).then(setAvailability).finally(() => setLoadingAvailability(false));
  });

  return <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(214,168,79,.2),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,.08),transparent_22%),#050505] px-4 py-6 md:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl gold-gradient text-black"><Crown /></div><div><p className="text-sm uppercase tracking-[.35em] text-crown-gold">Black Crown Barber</p><h1 className="text-2xl font-black md:text-4xl">Reserva fácil sin iniciar sesión</h1></div></div>
        <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:border-crown-gold/50 hover:text-crown-gold"><LockKeyhole size={16} /> Acceso interno</Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="space-y-6">
          <div><p className="text-sm text-crown-gold">Horario</p><h2 className="mt-1 text-3xl font-black">Lunes a viernes</h2><p className="mt-2 text-white/60">Atendemos de 9:00 a.m. a 9:00 p.m. con Sebastian Gamboa como barbero principal.</p></div>
          <div className="grid gap-3 rounded-3xl bg-white/5 p-4 text-sm text-white/70">
            <span className="flex items-center gap-2"><Scissors className="text-crown-gold" size={18} /> Barbero: {barber?.user?.name || 'Sebastian Gamboa'}</span>
            <span className="flex items-center gap-2"><Clock className="text-crown-gold" size={18} /> {availability?.schedule.label || 'Lunes a viernes, 9:00 a.m. a 9:00 p.m.'}</span>
            <span className="flex items-center gap-2"><CalendarDays className="text-crown-gold" size={18} /> Elige un horario verde disponible</span>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <input placeholder="Tu nombre" {...register('name')} />
            <small className="text-red-300">{errors.name?.message}</small>
            <input placeholder="WhatsApp o teléfono" {...register('phone')} />
            <small className="text-red-300">{errors.phone?.message}</small>
            <input placeholder="Email opcional" {...register('email')} />
            <select {...register('service')}><option value="">Elige tu servicio</option>{services.data?.map((service) => <option key={service._id} value={service._id}>{service.name} · {money(service.price)}</option>)}</select>
            <small className="text-red-300">{errors.service?.message}</small>
            <Button disabled={isSubmitting || !time}>Confirmar reserva</Button>
          </form>
        </Card>

        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-crown-gold">Calendario de reservas</p><h2 className="text-3xl font-black">Disponibilidad</h2></div><input type="date" min={today()} value={date} onChange={(event) => setDate(event.target.value)} className="w-auto" /></div>
          {!availability?.isOpen && !loadingAvailability ? <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">Este día está cerrado. Selecciona un día de lunes a viernes.</div> : null}
          {loadingAvailability ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Skeleton className="h-14" /><Skeleton className="h-14" /><Skeleton className="h-14" /><Skeleton className="h-14" /></div> : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{(Array.isArray(availability?.slots) ? availability.slots : []).map((slot) => <button key={slot.time} type="button" disabled={!slot.available} onClick={() => setTime(slot.time)} className={`rounded-2xl border px-4 py-4 text-left transition ${slot.available ? time === slot.time ? 'border-crown-gold bg-crown-gold text-black shadow-glow' : 'border-green-400/30 bg-green-400/10 text-green-100 hover:border-crown-gold hover:bg-crown-gold/15' : 'cursor-not-allowed border-red-400/20 bg-red-400/10 text-red-200/55'}`}><span className="block text-lg font-black">{time12(slot.time)}</span><small>{slot.available ? 'Disponible' : 'Reservado'}</small></button>)}</div>}
          {time ? <div className="mt-5 flex items-center gap-2 rounded-3xl border border-crown-gold/30 bg-crown-gold/10 p-4 text-crown-gold"><CheckCircle2 size={18} /> Hora seleccionada: {time12(time)}</div> : null}
        </Card>
      </section>
    </div>
  </main>;
}
