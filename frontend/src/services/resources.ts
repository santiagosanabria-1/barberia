import { api } from './api';
import type { Appointment, Availability, Barber, DashboardData, Payment, Product, Service, User } from '../types';

const toArray = <T>(value: unknown): T[] => Array.isArray(value) ? value : [];
const normalizeAvailability = (value: Availability): Availability => ({ ...value, slots: toArray(value?.slots) });

export const resources = {
  dashboard: () => api.get<DashboardData>('/dashboard').then((r) => r.data),
  services: () => api.get<Service[]>('/services').then((r) => toArray<Service>(r.data)),
  barbers: () => api.get<Barber[]>('/barbers').then((r) => toArray<Barber>(r.data)),
  appointments: () => api.get<Appointment[]>('/appointments').then((r) => toArray<Appointment>(r.data)),
  availability: (date: string, barber: string) => api.get<Availability>('/appointments/availability', { params: { date, barber } }).then((r) => normalizeAvailability(r.data)),
  createAppointment: (data: unknown) => api.post<Appointment>('/appointments', data).then((r) => r.data),
  createPublicAppointment: (data: unknown) => api.post<Appointment>('/appointments/public', data).then((r) => r.data),
  updateAppointment: (id: string, data: unknown) => api.put<Appointment>(`/appointments/${id}`, data).then((r) => r.data),
  users: () => api.get<User[]>('/users').then((r) => toArray<User>(r.data)),
  payments: () => api.get<Payment[]>('/payments').then((r) => toArray<Payment>(r.data)),
  createPayment: (data: unknown) => api.post<Payment>('/payments', data).then((r) => r.data),
  products: () => api.get<Product[]>('/products').then((r) => toArray<Product>(r.data)),
  createProduct: (data: unknown) => api.post<Product>('/products', data).then((r) => r.data),
  inventory: () => api.get('/inventory').then((r) => r.data),
  createInventory: (data: unknown) => api.post('/inventory', data).then((r) => r.data)
};
