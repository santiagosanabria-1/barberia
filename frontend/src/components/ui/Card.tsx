import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`glass rounded-3xl p-6 ${className}`}>{children}</motion.div>;
}
