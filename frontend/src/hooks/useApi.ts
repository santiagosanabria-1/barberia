import { useEffect, useState } from 'react';

export function useApi<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refetch = async () => {
    setLoading(true);
    try { setData(await loader()); setError(null); } catch (err) { setError(err instanceof Error ? err.message : 'Error'); } finally { setLoading(false); }
  };
  useEffect(() => { void refetch(); }, deps);
  return { data, loading, error, refetch };
}
