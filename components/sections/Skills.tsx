'use client';

import { useRef, useEffect, useState } from 'react';
import { useData } from '@/lib/context/DataContext';

const CATEGORY_COLORS: Record<string, { border: string; label: string; dot: string }> = {
  Languages:  { border: 'rgba(251,191,36,0.25)',  label: 'rgba(251,191,36,0.7)',  dot: '#fbbf24' },
  Frontend:   { border: 'rgba(96,165,250,0.25)',  label: 'rgba(96,165,250,0.7)',  dot: '#60a5fa' },
  Backend:    { border: 'rgba(74,222,128,0.25)',  label: 'rgba(74,222,128,0.7)',  dot: '#4ade80' },
  'ML / AI':  { border: 'rgba(167,139,250,0.25)', label: 'rgba(167,139,250,0.7)', dot: '#a78bfa' },
  NLP:        { border: 'rgba(251,113,133,0.25)', label: 'rgba(251,113,133,0.7)', dot: '#fb7185' },
  Cloud:      { border: 'rgba(34,211,238,0.25)',  label: 'rgba(34,211,238,0.7)',  dot: '#22d3ee' },
};

const DEFAULT_COLORS = { border: 'rgba(255,255,255,0.1)', label: 'rgba(255,255,255,0.4)', dot: '#ffffff' };

function SkillCategory({ category, skills, index }: { category: string; skills: string[]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colors = CATEGORY_COLORS[category] || DEFAULT_COLORS;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-20%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: colors.dot,
        opacity: 0.04,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: colors.label,
        }}>
          {category.toUpperCase()}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          color: 'var(--text-muted)',
        }}>
          {skills.length}
        </span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {skills.map((skill, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              background: 'var(--surface-high)',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              padding: '5px 12px',
              transition: 'all 0.25s ease',
              cursor: 'default',
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: `${index * 0.08 + i * 0.04}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `rgba(${colors.dot.slice(1).match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',')},0.15)`;
              e.currentTarget.style.borderColor = colors.dot;
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface-high)';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { data } = useData();
  const categories = Object.entries(data.skills);

  return (
    <section
      id="skills"
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          04 — SKILLS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1 }}>
        Tools &amp; Technologies
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '56px' }}>
        {categories.reduce((acc, [, s]) => acc + s.length, 0)} skills across {categories.length} domains
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {categories.map(([category, skillList], i) => (
          <SkillCategory key={category} category={category} skills={skillList} index={i} />
        ))}
      </div>
    </section>
  );
}
