import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(214,168,79,.22),transparent_30%),#050505]"><div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_.9fr]"><section><p className="mb-4 text-sm uppercase tracking-[.45em] text-crown-gold">Premium SaaS</p><h1 className="max-w-2xl text-5xl font-black leading-tight md:text-7xl">Black Crown Barber</h1><p className="mt-6 max-w-xl text-lg text-white/65">Reservas, POS, CRM, inventario, finanzas y analítica para barberías modernas con una experiencia premium de alto rendimiento.</p></section><Outlet /></div></main>;
}
