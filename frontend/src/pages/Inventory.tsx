import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/tables/DataTable';
import { useApi } from '../hooks/useApi';
import { resources } from '../services/resources';
import { money } from '../utils/format';
import type { Product } from '../types';

const schema = z.object({ name: z.string().min(2), sku: z.string().min(2), category: z.string().min(2), price: z.coerce.number().min(0), cost: z.coerce.number().min(0), stock: z.coerce.number().min(0), minStock: z.coerce.number().min(0) });
type Form = z.infer<typeof schema>;

export function Inventory() {
  const products = useApi(resources.products, []);
  const { register, handleSubmit, reset } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { minStock: 5, stock: 0, cost: 0 } });
  const onSubmit = handleSubmit(async (values) => { await resources.createProduct(values); toast.success('Producto creado'); reset(); await products.refetch(); });
  return <div className="page grid gap-6 xl:grid-cols-[380px_1fr]"><Card><h2 className="text-2xl font-black">Nuevo producto</h2><form onSubmit={onSubmit} className="mt-6 grid gap-3"><input placeholder="Nombre" {...register('name')} /><input placeholder="SKU" {...register('sku')} /><input placeholder="Categoría" {...register('category')} /><input type="number" placeholder="Precio" {...register('price')} /><input type="number" placeholder="Costo" {...register('cost')} /><input type="number" placeholder="Stock" {...register('stock')} /><input type="number" placeholder="Stock mínimo" {...register('minStock')} /><Button>Guardar</Button></form></Card><Card><h2 className="mb-5 text-2xl font-black">Inventario</h2><DataTable<Product> columns={['Producto','SKU','Categoría','Precio','Stock','Alerta']} rows={products.data || []} render={(row) => <><td className="px-5 py-4">{row.name}</td><td className="px-5 py-4">{row.sku}</td><td className="px-5 py-4">{row.category}</td><td className="px-5 py-4">{money(row.price)}</td><td className="px-5 py-4">{row.stock}</td><td className="px-5 py-4">{row.stock <= row.minStock ? <span className="text-red-300">Stock bajo</span> : <span className="text-green-300">OK</span>}</td></>} /></Card></div>;
}
