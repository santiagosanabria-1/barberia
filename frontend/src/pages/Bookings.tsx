import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/tables/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money, shortDate, time12 } from '../utils/format';
import type { Appointment } from '../types';

const schema = z.object({ barber: z.string().min(1), service: z.string().min(1), date: z.string().min(1), time: z.string().regex(/^\d{2}:\d{2}$/), notes: z.string().optional() });
type Form = z.infer<typeof schema>;

export function Bookings() {
  const appointments = useApi(resources.appointments, []);
  const services = useApi(resources.services, []);
  const barbers = useApi(resources.barbers, []);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = handleSubmit(async (values) => { await resources.createAppointment(values); toast.success('Reserva creada sin conflicto'); reset(); await appointments.refetch(); });
  const rows = appointments.data || [];
  const attendanceLabel = (status?: string) => status === 'asistira' ? 'Sí asistirá' : status === 'no_asistira' ? 'No asistirá' : 'Sin confirmar';
  return <div className="page grid gap-6 xl:grid-cols-[420px_1fr]"><Card><h2 className="text-2xl font-black">Nueva reserva</h2><form onSubmit={onSubmit} className="mt-6 grid gap-4"><select {...register('barber')}><option value="">Elegir barbero</option>{barbers.data?.map((b) => <option value={b._id} key={b._id}>{b.user.name}</option>)}</select><select {...register('service')}><option value="">Elegir servicio</option>{services.data?.map((s) => <option value={s._id} key={s._id}>{s.name} · {money(s.price)}</option>)}</select><input type="date" {...register('date')} /><input type="time" {...register('time')} /><textarea placeholder="Notas del cliente" {...register('notes')} /><Button disabled={isSubmitting}>Reservar cita</Button></form></Card><Card><h2 className="mb-5 text-2xl font-black">Reservas</h2>{rows.length ? <DataTable<Appointment> columns={['Cliente','Servicio','Fecha','Estado','Asistencia','Acción']} rows={rows} render={(row) => <><td className="px-5 py-4">{row.client?.name}</td><td className="px-5 py-4">{row.service?.name}<br/><span className="text-white/45">{money(row.price)}</span></td><td className="px-5 py-4">{shortDate(row.date)} · {time12(row.time)}</td><td className="px-5 py-4 text-crown-gold">{row.status}</td><td className="px-5 py-4">{attendanceLabel(row.attendanceStatus)}</td><td className="px-5 py-4"><button className="text-white/60 hover:text-crown-gold" onClick={() => resources.updateAppointment(row._id, { status: 'cancelada' }).then(appointments.refetch)}>Cancelar</button></td></>} /> : <EmptyState title="Sin reservas" text="Crea la primera cita para ver la agenda dinámica." />}</Card></div>;
}
