import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { RevenueChart } from '../components/charts/RevenueChart';
import { DataTable } from '../components/tables/DataTable';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money, shortDate, time12 } from '../utils/format';
import type { Appointment } from '../types';

const labels: Record<string, string> = { totalRevenue: 'Ingresos totales', dailyRevenue: 'Ingresos diarios', monthlyRevenue: 'Ingresos mensuales', todayAppointments: 'Reservas del día', registeredClients: 'Clientes', totalServices: 'Servicios', topService: 'Servicio top', topBarber: 'Barbero top' };

export function Dashboard() {
  const { data, loading } = useApi(resources.dashboard, []);
  if (loading || !data) return <div className="grid gap-5 md:grid-cols-4"><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/></div>;
  return <div className="page"><div className="grid gap-4 md:grid-cols-4">{Object.entries(data.cards).map(([key, value]) => <Card key={key}><p className="text-sm text-white/50">{labels[key]}</p><strong className="mt-2 block text-2xl">{typeof value === 'number' && key.toLowerCase().includes('revenue') ? money(value) : value}</strong></Card>)}</div><div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]"><Card><h3 className="mb-5 text-xl font-bold">Ingresos mensuales</h3><RevenueChart data={data.charts.monthlyRevenue} /></Card><Card><h3 className="mb-5 text-xl font-bold">Servicios más vendidos</h3><ResponsiveContainer width="100%" height={290}><BarChart data={data.charts.serviceSales}><XAxis dataKey="name" stroke="#aaa" /><Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(214,168,79,.25)' }} /><Bar dataKey="total" fill="#d6a84f" radius={[12,12,0,0]} /></BarChart></ResponsiveContainer></Card></div><Card><h3 className="mb-4 text-xl font-bold">Últimas reservas</h3><DataTable<Appointment> columns={['Cliente','Servicio','Barbero','Fecha','Estado']} rows={data.recentAppointments} render={(row) => <><td className="px-5 py-4">{row.client?.name}</td><td className="px-5 py-4">{row.service?.name}</td><td className="px-5 py-4">{row.barber?.user?.name}</td><td className="px-5 py-4">{shortDate(row.date)} · {time12(row.time)}</td><td className="px-5 py-4 text-crown-gold">{row.status}</td></>} /></Card></div>;
}
