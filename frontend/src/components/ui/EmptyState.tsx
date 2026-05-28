import { Crown } from 'lucide-react';

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="glass rounded-3xl p-10 text-center text-white/70"><Crown className="mx-auto mb-3 text-crown-gold" /><h3 className="text-xl font-semibold text-white">{title}</h3><p>{text}</p></div>;
}
