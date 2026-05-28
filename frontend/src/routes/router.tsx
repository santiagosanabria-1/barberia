import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/Dashboard';
import { Agenda } from '../pages/Agenda';
import { Bookings } from '../pages/Bookings';
import { POS } from '../pages/POS';
import { Inventory } from '../pages/Inventory';
import { Clients } from '../pages/Clients';
import { Accounting } from '../pages/Accounting';
import { Settings } from '../pages/Settings';
import { Profile } from '../pages/Profile';
import { PublicBooking } from '../pages/PublicBooking';
import { MobileHome } from '../pages/MobileHome';

export const router = createBrowserRouter([
  { path: '/', element: <PublicBooking /> },
  { path: '/reservar', element: <PublicBooking /> },
  { element: <AuthLayout />, children: [{ path: '/login', element: <Login /> }, { path: '/registro', element: <Register /> }] },
  { element: <ProtectedRoute />, children: [{ element: <AppLayout />, children: [
    { path: '/app', element: <MobileHome /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/agenda', element: <Agenda /> },
    { path: '/reservas', element: <Bookings /> },
    { path: '/pos', element: <POS /> },
    { path: '/inventario', element: <Inventory /> },
    { path: '/clientes', element: <Clients /> },
    { path: '/contabilidad', element: <Accounting /> },
    { path: '/configuracion', element: <Settings /> },
    { path: '/perfil', element: <Profile /> }
  ] }] },
  { path: '*', element: <Navigate to="/reservar" replace /> }
]);
