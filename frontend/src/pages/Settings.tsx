import { Card } from '../components/ui/Card';

export function Settings() {
  return <div className="page grid gap-6 lg:grid-cols-2"><Card><h2 className="text-2xl font-black">Configuración operativa</h2><div className="mt-6 grid gap-4"><input defaultValue="Black Crown Barber" /><input defaultValue="Cra. Premium 45 #10-20" /><select defaultValue="America/Bogota"><option>America/Bogota</option></select></div></Card><Card><h2 className="text-2xl font-black">Reglas de agenda</h2><div className="mt-6 grid gap-4"><input defaultValue="9:00 a.m." /><input defaultValue="9:00 p.m." /><input defaultValue="45" /></div></Card></div>;
}
