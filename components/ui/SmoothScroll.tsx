'use client';

import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis');
      
      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });

      lenisRef.current = lenis;

      // Expose lenis instance globally for Nav component
      (window as any).lenis = lenis;

      // RAF loop
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        (window as any).lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}
