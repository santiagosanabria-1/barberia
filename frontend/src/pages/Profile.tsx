import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export function Profile() {
  const user = useAuthStore((state) => state.user);
  return <Card><h2 className="text-2xl font-black">Perfil</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><input value={user?.name || ''} readOnly /><input value={user?.email || ''} readOnly /><input value={user?.role || ''} readOnly /><input value={user?.phone || 'Sin teléfono'} readOnly /></div></Card>;
}
