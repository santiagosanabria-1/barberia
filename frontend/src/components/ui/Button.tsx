import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button className={`rounded-2xl px-5 py-3 font-semibold transition hover:-translate-y-0.5 disabled:opacity-50 gold-gradient text-black shadow-glow ${className}`} {...props}>{children}</button>;
}
