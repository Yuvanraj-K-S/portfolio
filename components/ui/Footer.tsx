'use client';

import { useData } from '@/lib/context/DataContext';

export default function Footer() {
  const { data } = useData();
  const year = new Date().getFullYear();

  const links = [
    { label: 'GitHub',   href: data.hero.github },
    { label: 'LinkedIn', href: data.hero.linkedin },
    { label: 'Codolio',  href: data.hero.codolio },
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '32px clamp(24px, 8vw, 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      background: 'var(--bg)',
    }}>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 9,
        letterSpacing: '0.18em',
        color: 'var(--text-muted)',
      }}>
        © {year} {data.hero.name.toUpperCase()} — BUILT WITH NEXT.JS
      </span>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {links.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {link.label.toUpperCase()} ↗
          </a>
        ))}
      </div>
    </footer>
  );
}
