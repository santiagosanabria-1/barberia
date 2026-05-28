import { Card } from '../components/ui/Card';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { shortDate, time12 } from '../utils/format';

export function Agenda() {
  const { data } = useApi(resources.appointments, []);
  const today = new Date().toDateString();
  const rows = (data || []).filter((item) => new Date(item.date).toDateString() === today);
  const attendanceLabel = (status?: string) => status === 'asistira' ? 'Sí asistirá' : status === 'no_asistira' ? 'No asistirá' : 'Sin confirmar';
  return <div className="page"><Card><h2 className="text-2xl font-black">Agenda diaria</h2><div className="mt-6 grid gap-3">{rows.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 p-4"><div><strong>{time12(item.time)} · {item.service?.name || 'Servicio'}</strong><p className="text-sm text-white/55">{item.client?.name || 'Cliente sin nombre'} con {item.barber?.user?.name || 'Sebastian Gamboa'} · {shortDate(item.date)}</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full border border-crown-gold/30 px-3 py-1 text-xs text-crown-gold">{item.status}</span><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">{attendanceLabel(item.attendanceStatus)}</span></div></div>)}</div></Card></div>;
}
