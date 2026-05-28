import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../../types';

export function RevenueChart({ data }: { data: ChartPoint[] }) {
  return <ResponsiveContainer width="100%" height={290}><AreaChart data={data}><defs><linearGradient id="gold" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#d6a84f" stopOpacity={0.45}/><stop offset="95%" stopColor="#d6a84f" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.08)" /><XAxis dataKey="month" stroke="#aaa" /><YAxis stroke="#aaa" /><Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(214,168,79,.25)', borderRadius: 16 }} /><Area type="monotone" dataKey="value" stroke="#d6a84f" fill="url(#gold)" strokeWidth={3}/></AreaChart></ResponsiveContainer>;
}
