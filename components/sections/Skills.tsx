'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useData } from '@/lib/context/DataContext';

const ease = [0.16, 1, 0.3, 1] as const;

const CARD_ROTATIONS  = [-11, 7, -4, 12, -8, 5, -6, 10, -3, 8];
const CARD_OFFSETS_Y  = [12, -16, 24, -8, 6, -20, 14, -10, 20, -4];
const TAG_TILTS       = [-3, 2, -1.5, 4, -2.5, 1, -4, 3, -1, 2.5, -3.5, 1.5];

const CATEGORY_COLORS: Record<string, { glow: string; label: string; dot: string; sweep: string }> = {
  Languages: { glow: 'rgba(251,191,36,0.14)', label: 'rgba(251,191,36,0.75)', dot: '#fbbf24', sweep: 'rgba(251,191,36,0.18)' },
  Frontend:  { glow: 'rgba(96,165,250,0.14)',  label: 'rgba(96,165,250,0.75)',  dot: '#60a5fa', sweep: 'rgba(96,165,250,0.18)' },
  Backend:   { glow: 'rgba(74,222,128,0.14)',  label: 'rgba(74,222,128,0.75)',  dot: '#4ade80', sweep: 'rgba(74,222,128,0.18)' },
  'ML / AI': { glow: 'rgba(167,139,250,0.14)', label: 'rgba(167,139,250,0.75)', dot: '#a78bfa', sweep: 'rgba(167,139,250,0.18)' },
  NLP:       { glow: 'rgba(251,113,133,0.14)', label: 'rgba(251,113,133,0.75)', dot: '#fb7185', sweep: 'rgba(251,113,133,0.18)' },
  Cloud:     { glow: 'rgba(34,211,238,0.14)',  label: 'rgba(34,211,238,0.75)',  dot: '#22d3ee', sweep: 'rgba(34,211,238,0.18)' },
};
const DEFAULT_COLOR = { glow: 'rgba(255,255,255,0.06)', label: 'rgba(255,255,255,0.4)', dot: '#ffffff', sweep: 'rgba(255,255,255,0.1)' };

function SkillCard({ category, skills, index }: { category: string; skills: string[]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const offsetY  = CARD_OFFSETS_Y[index % CARD_OFFSETS_Y.length];

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 36, scale: 0.88 }}
      animate={isInView ? {
        opacity: 1,
        y: hovered ? offsetY - 14 : offsetY,
        scale: hovered ? 1.05 : 1,
        rotate: hovered ? rotation * 0.18 : rotation,
      } : { opacity: 0, y: offsetY + 36, scale: 0.88, rotate: rotation }}
      transition={isInView
        ? {
            opacity: { duration: 0.5, delay: index * 0.07, ease },
            y: hovered
              ? { type: 'spring', stiffness: 280, damping: 20 }
              : { duration: 0.55, delay: index * 0.07, ease },
            scale: hovered
              ? { type: 'spring', stiffness: 280, damping: 20 }
              : { duration: 0.55, delay: index * 0.07, ease },
            rotate: { duration: 0.55, delay: index * 0.07, ease },
          }
        : { duration: 0 }
      }
      style={{
        position: 'relative',
        width: 230,
        zIndex: hovered ? 10 : 1,
        flexShrink: 0,
        cursor: 'default',
      }}
    >
      {/* Glow halo */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute', inset: -24, borderRadius: 28,
          background: `radial-gradient(ellipse at 50% 50%, ${colors.glow}, transparent 68%)`,
          pointerEvents: 'none', filter: 'blur(4px)',
        }}
      />

      {/* Card */}
      <motion.div
        animate={{
          borderColor: hovered ? colors.dot + '40' : 'rgba(255,255,255,0.07)',
          boxShadow: hovered
            ? `0 18px 44px rgba(0,0,0,0.55), 0 0 0 1px ${colors.dot}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'relative', borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent stripe — sweeps on entry */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: hovered ? 1 : 0.4 } : {}}
          transition={{ duration: 0.55, delay: index * 0.07 + 0.2, ease }}
          style={{
            height: 2,
            borderRadius: '12px 12px 0 0',
            background: `linear-gradient(90deg, transparent, ${colors.dot}88, transparent)`,
            transformOrigin: 'left center',
          }}
        />

        {/* Category header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <motion.div
            animate={isInView ? { scale: [0, 1.3, 1] } : { scale: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 + 0.15, ease }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: colors.dot, flexShrink: 0, boxShadow: `0 0 6px ${colors.dot}` }}
          />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '0.22em', color: colors.label }}>
            {category.toUpperCase()}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 8, color: 'var(--text-muted)' }}>
            {skills.length}
          </span>
        </div>

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px 12px',
          padding: '14px 16px 18px', alignItems: 'flex-start',
        }}>
          {skills.map((skill, i) => {
            const tilt = TAG_TILTS[i % TAG_TILTS.length];
            return (
              <motion.span
                key={skill}
                initial={{ opacity: 0, y: 6 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.07 + 0.25 + i * 0.04, ease }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 400,
                  color: 'var(--text-secondary)', letterSpacing: '0.025em',
                  display: 'inline-block',
                  transform: `rotate(${tilt}deg)`,
                  userSelect: 'none', whiteSpace: 'nowrap',
                }}
              >
                {skill}
              </motion.span>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const { data } = useData();
  const categories  = Object.entries(data.skills);
  const totalSkills = categories.reduce((acc, [, s]) => acc + s.length, 0);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });

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

      <div ref={headerRef}>
        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <motion.h2
            initial={{ y: '100%', opacity: 0 }}
            animate={headerInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1 }}
          >
            Tools &amp; Technologies
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 72 }}
        >
          {totalSkills} skills across {categories.length} domains
        </motion.p>
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: '56px 48px', paddingTop: 20, paddingBottom: 80,
      }}>
        {categories.map(([category, skillList], i) => (
          <SkillCard key={category} category={category} skills={skillList} index={i} />
        ))}
      </div>
    </section>
  );
}
