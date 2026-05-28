export const money = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
export const shortDate = (date: string) => new Intl.DateTimeFormat('es-CO', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
export const time12 = (time: string) => {
  const [hoursValue, minutes] = time.split(':').map(Number);
  const period = hoursValue >= 12 ? 'p.m.' : 'a.m.';
  const hours = hoursValue % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
};
