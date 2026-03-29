'use client';

import { useEffect, useState } from 'react';

interface MeteorProps {
  top: number;
  left: number;
  delay: number;
  duration: number;
}

interface MeteorsProps {
  number?: number;
}

export function Meteors({ number = 20 }: MeteorsProps) {
  const [meteors, setMeteors] = useState<MeteorProps[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: number }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 3,
    }));
    setMeteors(generated);
  }, [number]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {meteors.map((m, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: '2px',
            height: '2px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 4px 1px rgba(255,255,255,0.4)',
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            animationName: 'meteor-fall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              right: '100%',
              transform: 'translateY(-50%)',
              width: '100px',
              height: '1px',
              background: 'linear-gradient(to left, rgba(255,255,255,0.7), transparent)',
            }}
          />
        </span>
      ))}
    </div>
  );
}
