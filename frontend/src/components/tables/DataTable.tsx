import type { ReactNode } from 'react';

export function DataTable<T>({ columns, rows, render }: { columns: string[]; rows: T[]; render: (row: T) => ReactNode }) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];
  return <div className="overflow-hidden rounded-3xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-white/60"><tr>{safeColumns.map((column) => <th key={column} className="px-5 py-4 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{safeRows.map((row, index) => <tr key={index} className="transition hover:bg-white/[0.04]">{render(row)}</tr>)}</tbody></table></div>;
}
