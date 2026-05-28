import { Card } from '../components/ui/Card';
import { DataTable } from '../components/tables/DataTable';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import type { User } from '../types';

export function Clients() {
  const users = useApi(resources.users, []);
  const clients = (users.data || []).filter((user) => user.role === 'cliente');
  return <div className="page"><Card><h2 className="mb-5 text-2xl font-black">CRM de clientes</h2><DataTable<User> columns={['Cliente','Email','Teléfono','Frecuencia','Notas']} rows={clients} render={(row) => <><td className="px-5 py-4">{row.name}</td><td className="px-5 py-4">{row.email}</td><td className="px-5 py-4">{row.phone || 'Sin teléfono'}</td><td className="px-5 py-4 text-crown-gold">Cliente activo</td><td className="px-5 py-4 text-white/55">{row.notes || 'Sin notas'}</td></>} /></Card></div>;
}
