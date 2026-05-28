import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money } from '../utils/format';

type CartItem = { name: string; quantity: number; price: number; type: 'service' | 'product' };

export function POS() {
  const services = useApi(resources.services, []);
  const products = useApi(resources.products, []);
  const users = useApi(resources.users, []);
  const [client, setClient] = useState('');
  const [method, setMethod] = useState('efectivo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + tax;
  const add = (item: CartItem) => setCart((current) => [...current, item]);
  const checkout = async () => { await resources.createPayment({ client, method, items: cart }); toast.success('Pago registrado y factura generada'); setCart([]); };
  return <div className="page grid gap-6 xl:grid-cols-[1fr_420px]"><Card><h2 className="text-2xl font-black">Catálogo POS</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{services.data?.map((s) => <button key={s._id} onClick={() => add({ name: s.name, price: s.price, quantity: 1, type: 'service' })} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-crown-gold/50"><strong>{s.name}</strong><p className="text-crown-gold">{money(s.price)}</p></button>)}{products.data?.map((p) => <button key={p._id} onClick={() => add({ name: p.name, price: p.price, quantity: 1, type: 'product' })} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-crown-gold/50"><strong>{p.name}</strong><p className="text-crown-gold">{money(p.price)} · stock {p.stock}</p></button>)}</div></Card><Card><h2 className="text-2xl font-black">Factura</h2><div className="mt-5 grid gap-3"><select value={client} onChange={(e) => setClient(e.target.value)}><option value="">Cliente</option>{users.data?.filter((u) => u.role === 'cliente').map((u) => <option value={u._id} key={u._id}>{u.name}</option>)}</select><select value={method} onChange={(e) => setMethod(e.target.value)}><option>efectivo</option><option>tarjeta</option><option>transferencia</option><option>Nequi</option><option>Daviplata</option></select>{cart.map((item, index) => <div className="flex justify-between rounded-2xl bg-white/5 p-3" key={index}><span>{item.name}</span><b>{money(item.price)}</b></div>)}<div className="mt-4 space-y-2 border-t border-white/10 pt-4"><p className="flex justify-between text-white/60"><span>Subtotal</span><span>{money(subtotal)}</span></p><p className="flex justify-between text-white/60"><span>Impuestos</span><span>{money(tax)}</span></p><p className="flex justify-between text-xl font-black"><span>Total</span><span>{money(total)}</span></p></div><Button disabled={!client || !cart.length} onClick={checkout}>Finalizar compra</Button><button onClick={() => window.print()} className="rounded-2xl border border-white/10 py-3 text-white/70 hover:bg-white/10">Imprimir ticket</button></div></Card></div>;
}
