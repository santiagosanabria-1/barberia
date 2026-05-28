import { CalendarDays, CheckCircle2, Clock, Crown, Scissors, ShoppingCart, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money, shortDate, time12 } from '../utils/format';

const attendanceLabel = (status?: string) => status === 'asistira' ? 'Sí asistirá' : status === 'no_asistira' ? 'No asistirá' : 'Sin confirmar';

export function MobileHome() {
  const appointments = useApi(resources.appointments, []);
  const today = new Date().toDateString();
  const rows = (appointments.data || []).filter((item) => new Date(item.date).toDateString() === today && item.status !== 'cancelada').sort((a, b) => a.time.localeCompare(b.time));
  const confirmed = rows.filter((item) => item.attendanceStatus === 'asistira').length;
  const projected = rows.reduce((acc, item) => acc + item.price, 0);

  return <div className="page">
    <section className="rounded-[2rem] border border-crown-gold/20 bg-[linear-gradient(135deg,rgba(214,168,79,.22),rgba(255,255,255,.05))] p-5 shadow-glow md:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.3em] text-crown-gold">App móvil</p><h1 className="mt-2 text-3xl font-black">Sebastian Gamboa</h1><p className="mt-2 text-white/65">Agenda, reservas y caja del día en una vista rápida.</p></div><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gold-gradient text-black"><Crown /></div></div>
    </section>

    <section className="grid grid-cols-3 gap-3">
      <Card className="p-4"><CalendarDays className="mb-3 text-crown-gold" size={20} /><p className="text-xs text-white/50">Citas hoy</p><strong className="text-2xl">{rows.length}</strong></Card>
      <Card className="p-4"><UserCheck className="mb-3 text-crown-gold" size={20} /><p className="text-xs text-white/50">Asisten</p><strong className="text-2xl">{confirmed}</strong></Card>
      <Card className="p-4"><CheckCircle2 className="mb-3 text-crown-gold" size={20} /><p className="text-xs text-white/50">Proyectado</p><strong className="text-lg">{money(projected)}</strong></Card>
    </section>

    <section className="grid grid-cols-2 gap-3">
      <Link to="/agenda" className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-crown-gold/50"><Clock className="mb-3 text-crown-gold" /><strong>Ver agenda</strong><p className="mt-1 text-sm text-white/50">Citas del día</p></Link>
      <Link to="/reservas" className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-crown-gold/50"><Scissors className="mb-3 text-crown-gold" /><strong>Reservas</strong><p className="mt-1 text-sm text-white/50">Gestionar citas</p></Link>
      <Link to="/pos" className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-crown-gold/50"><ShoppingCart className="mb-3 text-crown-gold" /><strong>POS</strong><p className="mt-1 text-sm text-white/50">Cobrar rápido</p></Link>
      <Link to="/dashboard" className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-crown-gold/50"><Crown className="mb-3 text-crown-gold" /><strong>Negocio</strong><p className="mt-1 text-sm text-white/50">Métricas</p></Link>
    </section>

    <Card>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Próximas citas</h2><Link to="/agenda" className="text-sm text-crown-gold">Ver todo</Link></div>
      {rows.length ? <div className="grid gap-3">{rows.slice(0, 6).map((item) => <div key={item._id} className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="flex items-start justify-between gap-3"><div><strong>{time12(item.time)} · {item.client?.name || 'Cliente sin nombre'}</strong><p className="mt-1 text-sm text-white/55">{item.service?.name || 'Servicio'} · {shortDate(item.date)}</p></div><span className="rounded-full border border-crown-gold/30 px-3 py-1 text-xs text-crown-gold">{attendanceLabel(item.attendanceStatus)}</span></div></div>)}</div> : <EmptyState title="Día libre" text="No tienes citas activas para hoy." />}
    </Card>
  </div>;
}
