import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, Crown, Home, LayoutDashboard, LogOut, Package, Receipt, Scissors, Settings, ShoppingCart, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { InstallAppBanner } from '../components/InstallAppBanner';

const links = [
  ['Inicio', '/app', Home], ['Dashboard', '/dashboard', LayoutDashboard], ['Agenda', '/agenda', CalendarDays], ['Reservas', '/reservas', Scissors], ['POS', '/pos', ShoppingCart], ['Inventario', '/inventario', Package], ['Clientes', '/clientes', Users], ['Contabilidad', '/contabilidad', Receipt], ['Configuración', '/configuracion', Settings], ['Perfil', '/perfil', BarChart3]
] as const;

const mobileLinks = [
  ['Inicio', '/app', Home], ['Agenda', '/agenda', CalendarDays], ['Reservas', '/reservas', Scissors], ['POS', '/pos', ShoppingCart]
] as const;

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(214,168,79,.14),transparent_30%),#050505] lg:grid lg:grid-cols-[280px_1fr]">
    <aside className="glass sticky top-0 z-20 hidden h-auto flex-col gap-6 border-x-0 border-t-0 p-4 lg:flex lg:h-screen lg:border-r">
      <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-4"><div className="grid h-11 w-11 place-items-center rounded-2xl gold-gradient text-black"><Crown /></div><div><strong>Black Crown</strong><p className="text-xs text-white/50">Business OS</p></div></div>
      <nav className="grid gap-1">{links.map(([label, path, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10 ${isActive ? 'bg-crown-gold/15 text-crown-gold' : 'text-white/68'}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <button onClick={() => { void logout(); navigate('/login'); }} className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-white/60 hover:bg-white/10"><LogOut size={18}/>Salir</button>
    </aside>
    <section className="min-w-0 px-4 pb-28 pt-4 md:p-8"><header className="sticky top-0 z-10 -mx-4 mb-5 flex items-center justify-between gap-4 border-b border-white/10 bg-crown-black/85 px-4 py-3 backdrop-blur-xl md:static md:mx-0 md:mb-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-0"><div><p className="text-xs text-crown-gold md:text-sm">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p><h2 className="text-xl font-black md:text-3xl">Panel operativo</h2></div><div className="glass rounded-2xl px-3 py-2 text-xs text-white/70 md:px-4 md:py-3 md:text-sm">{user?.name}</div></header><InstallAppBanner /><Outlet /></section>
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-crown-black/92 px-2 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 backdrop-blur-xl lg:hidden">{mobileLinks.map(([label, path, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${isActive ? 'bg-crown-gold/15 text-crown-gold' : 'text-white/55'}`}><Icon size={20} />{label}</NavLink>)}</nav>
  </div>;
}
