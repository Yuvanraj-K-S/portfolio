'use client';

import { useRef, useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

// Card tilt angles — cycles through as many domains as needed
const CARD_ROTATIONS = [-11, 7, -4, 12, -8, 5, -6, 10, -3, 8];

// Vertical nudge per card to break the perfect-grid look
const CARD_OFFSETS_Y = [12, -16, 24, -8, 6, -20, 14, -10, 20, -4];

// Per-tag tilt — cycles for every skill added, looks organic but is deterministic
const TAG_TILTS = [-3, 2, -1.5, 4, -2.5, 1, -4, 3, -1, 2.5, -3.5, 1.5];

const CATEGORY_COLORS: Record<string, { glow: string; label: string; dot: string }> = {
  Languages: { glow: 'rgba(251,191,36,0.16)',  label: 'rgba(251,191,36,0.75)',  dot: '#fbbf24' },
  Frontend:  { glow: 'rgba(96,165,250,0.16)',  label: 'rgba(96,165,250,0.75)',  dot: '#60a5fa' },
  Backend:   { glow: 'rgba(74,222,128,0.16)',  label: 'rgba(74,222,128,0.75)',  dot: '#4ade80' },
  'ML / AI': { glow: 'rgba(167,139,250,0.16)', label: 'rgba(167,139,250,0.75)', dot: '#a78bfa' },
  NLP:       { glow: 'rgba(251,113,133,0.16)', label: 'rgba(251,113,133,0.75)', dot: '#fb7185' },
  Cloud:     { glow: 'rgba(34,211,238,0.16)',  label: 'rgba(34,211,238,0.75)',  dot: '#22d3ee' },
};

const DEFAULT_COLOR = { glow: 'rgba(255,255,255,0.08)', label: 'rgba(255,255,255,0.4)', dot: '#ffffff' };

function SkillCard({
  category,
  skills,
  index,
}: {
  category: string;
  skills: string[];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible]  = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const offsetY  = CARD_OFFSETS_Y[index % CARD_OFFSETS_Y.length];

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

  const activeRot   = hovered ? rotation * 0.18 : rotation;
  const activeY     = hovered ? offsetY - 14 : offsetY;
  const activeScale = hovered ? 1.05 : 1;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 230,
        zIndex: hovered ? 10 : 1,
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `rotate(${activeRot}deg) translateY(${activeY}px) scale(${activeScale})`
          : `rotate(${rotation}deg) translateY(${offsetY + 28}px) scale(0.9)`,
        transition: [
          `opacity 0.5s ease ${index * 0.1}s`,
          `transform ${
            hovered
              ? '0.35s cubic-bezier(0.34,1.56,0.64,1)'
              : `0.55s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.1}s`
          }`,
        ].join(', '),
        cursor: 'default',
      }}
    >
      {/* Glow halo */}
      <div style={{
        position: 'absolute',
        inset: -24,
        borderRadius: 28,
        background: `radial-gradient(ellipse at 50% 50%, ${colors.glow}, transparent 68%)`,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        filter: 'blur(4px)',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        borderRadius: 12,
        background: 'var(--surface)',
        border: `1px solid ${hovered ? colors.dot + '44' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? `0 18px 44px rgba(0,0,0,0.55), 0 0 0 1px ${colors.dot}18, inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
      }}>

        {/* Top accent stripe */}
        <div style={{
          height: 2,
          borderRadius: '12px 12px 0 0',
          background: `linear-gradient(90deg, transparent, ${colors.dot}77, transparent)`,
          opacity: hovered ? 1 : 0.35,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Category header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
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

        {/* Tags — flex-wrap so adding skills just appends naturally */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 12px',
          padding: '14px 16px 18px',
          alignItems: 'flex-start',
        }}>
          {skills.map((skill, i) => {
            // Deterministic tilt — cycles through TAG_TILTS, never random
            const tilt = TAG_TILTS[i % TAG_TILTS.length];
            return (
              <span
                key={skill}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.025em',
                  display: 'inline-block',
                  transform: `rotate(${tilt}deg)`,
                  // Small stagger on entry
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.4s ease ${index * 0.1 + i * 0.05}s`,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const { data } = useData();
  const categories  = Object.entries(data.skills);
  const totalSkills = categories.reduce((acc, [, s]) => acc + s.length, 0);

  return (
    <section
      id="skills"
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh' }}
    >
      {/* Section label */}
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

      {/* Cards — centered, wraps automatically for any number of domains */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '56px 48px',
        paddingTop: 20,
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
