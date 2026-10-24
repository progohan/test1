import { ReactNode, useEffect, useRef, useState } from 'react';

export default function DeferredContent({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host}>{ready ? children : <>{fallback}<button type="button" onClick={() => setReady(true)} className="text-primary underline mt-4">Load interactive charts</button></>}</div>;
}
