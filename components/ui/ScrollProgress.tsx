'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollProgress() {
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);

      const found = [...SECTIONS].reverse().find(({ id }) => {
        const el = id === 'hero'
          ? document.querySelector('section')
          : document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= window.innerHeight * 0.45;
      });
      if (found) setActive(found.id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            onClick={() => scrollTo(id)}
            title={label}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            {/* Tooltip label */}
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 8,
                letterSpacing: '0.15em',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'opacity 0.3s ease, color 0.3s ease',
                opacity: isActive ? 1 : 0,
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {label.toUpperCase()}
            </span>

            {/* Dot */}
            <div
              style={{
                width: isActive ? 8 : 4,
                height: isActive ? 8 : 4,
                borderRadius: '50%',
                background: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: isActive ? '0 0 8px rgba(240,240,240,0.4)' : 'none',
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
