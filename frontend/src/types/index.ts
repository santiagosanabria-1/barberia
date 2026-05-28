export type Role = 'admin' | 'barbero' | 'cliente';
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
export type AttendanceStatus = 'sin_confirmar' | 'asistira' | 'no_asistira';
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'Nequi' | 'Daviplata';

export interface User { _id: string; name: string; email: string; phone?: string; role: Role; notes?: string; createdAt?: string; }
export interface Service { _id: string; name: string; price: number; duration: number; category: string; }
export interface Barber { _id: string; user: User; specialty: string; rating: number; commissionRate: number; isAvailable: boolean; }
export interface Appointment { _id: string; client: User; barber: Barber; service: Service; price: number; date: string; time: string; status: AppointmentStatus; attendanceStatus?: AttendanceStatus; notes?: string; }
export interface Product { _id: string; name: string; sku: string; category: string; price: number; cost: number; stock: number; minStock: number; supplier?: string; }
export interface Payment { _id: string; client: User; service?: Service; subtotal: number; tax: number; total: number; method: PaymentMethod; status: string; invoiceNumber: string; createdAt: string; items: Array<{ name: string; quantity: number; price: number; type: string }>; }
export interface DashboardData { cards: Record<string, number | string>; charts: { monthlyRevenue: ChartPoint[]; weeklyAppointments: ChartPoint[]; clientGrowth: ChartPoint[]; serviceSales: ChartPoint[] }; recentPayments: Payment[]; recentAppointments: Appointment[]; }
export interface ChartPoint { [key: string]: string | number; }
export interface AvailabilitySlot { time: string; reserved: boolean; available: boolean; }
export interface Availability { date: string; isOpen: boolean; schedule: { days: number[]; open: string; close: string; label: string }; slots: AvailabilitySlot[]; }
