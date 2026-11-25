import { useEffect, useState } from 'react';

export function Preloader() {
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'gone'>(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'gone';
    }
    return 'visible';
  });

  useEffect(() => {
    if (phase === 'gone') return;
    const t1 = window.setTimeout(() => setPhase('exiting'), 480);
    const t2 = window.setTimeout(() => setPhase('gone'), 1040);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 bg-[#0E0F11] flex flex-col items-center justify-center gap-6 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        phase === 'exiting' ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-3.5 h-3.5 rounded-full bg-[#C82333] animate-rish-bounce" />
        <span
          className="w-3.5 h-3.5 rounded-full bg-[#F7F4EE] animate-rish-bounce"
          style={{ animationDelay: '0.15s' }}
        />
        <span
          className="w-3.5 h-3.5 rounded-full bg-[#C82333] animate-rish-bounce"
          style={{ animationDelay: '0.3s' }}
        />
      </div>
      <span className="font-mono text-xs tracking-[0.28em] uppercase text-[#F7F4EE]/60">
        gr.dev
      </span>
    </div>
  );
}
