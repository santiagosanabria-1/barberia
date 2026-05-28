import { Download, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export function InstallAppBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && Boolean(window.navigator.standalone)));
    const handler = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone) return null;

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') setPrompt(null);
  };

  return <div className="mb-4 rounded-3xl border border-crown-gold/25 bg-crown-gold/10 p-4 text-sm text-white/75 md:hidden">
    <div className="flex items-start gap-3"><Smartphone className="mt-0.5 shrink-0 text-crown-gold" size={20} /><div><strong className="text-white">Instalar como app</strong><p className="mt-1">Ábrela desde la pantalla principal del teléfono, como una app normal.</p>{prompt ? <button onClick={install} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-crown-gold px-4 py-2 font-semibold text-black"><Download size={16} /> Instalar app</button> : <p className="mt-3 text-xs text-white/55">Si no aparece el botón: menú del navegador, luego “Agregar a pantalla principal”.</p>}</div></div>
  </div>;
}
