'use client';

import { useRef, useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

const NOTE_ROTATIONS = [-11, 7, -4, 12, -8, 5];

const NOTE_OFFSETS: { x: number; y: number }[] = [
  { x: 0,   y: 14  },
  { x: 10,  y: -18 },
  { x: -6,  y: 26  },
  { x: 8,   y: -10 },
  { x: -10, y: 8   },
  { x: 4,   y: -22 },
];

const CATEGORY_GLOW: Record<string, { glow: string; label: string; dot: string }> = {
  Languages: { glow: 'rgba(251,191,36,0.18)',  label: 'rgba(251,191,36,0.75)',  dot: '#fbbf24' },
  Frontend:  { glow: 'rgba(96,165,250,0.18)',  label: 'rgba(96,165,250,0.75)',  dot: '#60a5fa' },
  Backend:   { glow: 'rgba(74,222,128,0.18)',  label: 'rgba(74,222,128,0.75)',  dot: '#4ade80' },
  'ML / AI': { glow: 'rgba(167,139,250,0.18)', label: 'rgba(167,139,250,0.75)', dot: '#a78bfa' },
  NLP:       { glow: 'rgba(251,113,133,0.18)', label: 'rgba(251,113,133,0.75)', dot: '#fb7185' },
  Cloud:     { glow: 'rgba(34,211,238,0.18)',  label: 'rgba(34,211,238,0.75)',  dot: '#22d3ee' },
};

const DEFAULT_COLOR = { glow: 'rgba(255,255,255,0.08)', label: 'rgba(255,255,255,0.4)', dot: '#fff' };

// Three scattered-position templates for tags inside each card
const TAG_TEMPLATES: { top: number; left: number; rot: number }[][] = [
  [
    { top: 48,  left: 36,  rot: -4 },
    { top: 54,  left: 118, rot:  6 },
    { top: 102, left: 42,  rot: -7 },
    { top: 108, left: 115, rot:  3 },
    { top: 158, left: 52,  rot:  5 },
  ],
  [
    { top: 46,  left: 114, rot:  5 },
    { top: 60,  left: 36,  rot: -3 },
    { top: 108, left: 120, rot: -6 },
    { top: 104, left: 40,  rot:  4 },
    { top: 162, left: 112, rot: -5 },
  ],
  [
    { top: 54,  left: 50,  rot:  6 },
    { top: 48,  left: 122, rot: -5 },
    { top: 106, left: 36,  rot:  3 },
    { top: 100, left: 116, rot: -7 },
    { top: 164, left: 54,  rot: -3 },
  ],
];

function SkillCard({
  category, skills, index,
}: {
  category: string; skills: string[]; index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colors = CATEGORY_GLOW[category] ?? DEFAULT_COLOR;
  const rotation = NOTE_ROTATIONS[index % NOTE_ROTATIONS.length];
  const offset   = NOTE_OFFSETS[index % NOTE_OFFSETS.length];
  const template = TAG_TEMPLATES[index % TAG_TEMPLATES.length];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeRot   = hovered ? rotation * 0.2  : rotation;
  const activeY     = hovered ? offset.y - 14   : offset.y;
  const activeScale = hovered ? 1.06 : 1;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 210,
        height: 228,
        flexShrink: 0,
        zIndex: hovered ? 10 : 1,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `rotate(${activeRot}deg) translate(${offset.x}px, ${activeY}px) scale(${activeScale})`
          : `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y + 30}px) scale(0.88)`,
        transition: [
          `opacity 0.5s ease ${index * 0.1}s`,
          `transform ${hovered
            ? '0.38s cubic-bezier(0.34,1.56,0.64,1)'
            : `0.55s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.1}s`}`,
        ].join(', '),
        cursor: 'default',
      }}
    >
      {/* Glow halo */}
      <div style={{
        position: 'absolute',
        inset: -20,
        borderRadius: 24,
        background: `radial-gradient(ellipse at 50% 50%, ${colors.glow}, transparent 70%)`,
        opacity: hovered ? 1 : 0.55,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        filter: 'blur(6px)',
      }} />

      {/* Card surface */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 12,
        background: 'var(--surface)',
        border: `1px solid ${hovered ? colors.dot + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? `0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px ${colors.dot}22, inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
      }}>

        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          borderRadius: '12px 12px 0 0',
          background: `linear-gradient(90deg, transparent, ${colors.dot}88, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Category header */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          paddingBottom: 10,
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}>
          <div style={{
            width: 5, height: 5,
            borderRadius: '50%',
            background: colors.dot,
            flexShrink: 0,
            boxShadow: `0 0 6px ${colors.dot}`,
          }} />
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 9,
            letterSpacing: '0.22em',
            color: colors.label,
          }}>
            {category.toUpperCase()}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-ui)',
            fontSize: 8,
            color: 'var(--text-muted)',
          }}>
            {skills.length}
          </span>
        </div>

        {/* Tech tags — scattered */}
        {skills.map((skill, i) => {
          const pos = template[i] ?? { top: 50 + i * 32, left: 36, rot: 0 };
          return (
            <span
              key={skill}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rot}deg)`,
                transformOrigin: 'left top',
                fontFamily: 'var(--font-body)',
                fontSize: 12.5,
                fontWeight: 400,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Skills() {
  const { data } = useData();
  const categories = Object.entries(data.skills);
  const totalSkills = categories.reduce((acc, [, s]) => acc + s.length, 0);

  return (
    <section
      id="skills"
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          04 — SKILLS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(36px, 6vw, 72px)',
        color: 'var(--text-primary)',
        marginBottom: 12,
        lineHeight: 1,
      }}>
        Tools &amp; Technologies
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--text-muted)',
        marginBottom: 72,
      }}>
        {totalSkills} skills across {categories.length} domains
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '52px 44px',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 16,
        paddingBottom: 80,
      }}>
        {categories.map(([category, skillList], i) => (
          <SkillCard
            key={category}
            category={category}
            skills={skillList}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
