import { Card } from '../components/ui/Card';
import { DataTable } from '../components/tables/DataTable';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money, shortDate } from '../utils/format';
import type { Payment } from '../types';

export function Accounting() {
  const payments = useApi(resources.payments, []);
  const rows = payments.data || [];
  const total = rows.reduce((acc, row) => acc + row.total, 0);
  return <div className="page"><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-white/55">Historial financiero</p><strong className="text-3xl">{money(total)}</strong></Card><Card><p className="text-white/55">Movimientos</p><strong className="text-3xl">{rows.length}</strong></Card><Card><p className="text-white/55">Estado dominante</p><strong className="text-3xl">Pagado</strong></Card></div><Card><h2 className="mb-5 text-2xl font-black">Pagos recientes</h2><DataTable<Payment> columns={['Factura','Cliente','Método','Fecha','Estado','Total']} rows={rows} render={(row) => <><td className="px-5 py-4">{row.invoiceNumber}</td><td className="px-5 py-4">{row.client?.name}</td><td className="px-5 py-4">{row.method}</td><td className="px-5 py-4">{shortDate(row.createdAt)}</td><td className="px-5 py-4 text-crown-gold">{row.status}</td><td className="px-5 py-4">{money(row.total)}</td></>} /></Card></div>;
}
