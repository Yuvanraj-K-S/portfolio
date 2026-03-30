'use client';

import { useRef, useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

// Each note's tilt angle — readable range roughly ±15deg
const NOTE_ROTATIONS = [-11, 7, -4, 12, -8, 5];

// Vertical / horizontal nudge to break the grid look
const NOTE_OFFSETS: { x: number; y: number }[] = [
  { x: 0,   y: 14  },
  { x: 10,  y: -18 },
  { x: -6,  y: 26  },
  { x: 8,   y: -10 },
  { x: -10, y: 8   },
  { x: 4,   y: -22 },
];

// Pastel paper colors — pop against the dark background
const NOTE_PALETTE = [
  { bg: '#fef08a', pin: '#ef4444', accent: '#a16207', text: '#1c1917', line: '#ca8a0422', margin: 'rgba(220,38,38,0.25)' },  // yellow
  { bg: '#bfdbfe', pin: '#3b82f6', accent: '#1e40af', text: '#1e3a5f', line: '#1e40af22', margin: 'rgba(220,38,38,0.25)' },  // blue
  { bg: '#bbf7d0', pin: '#16a34a', accent: '#15803d', text: '#14532d', line: '#15803d22', margin: 'rgba(220,38,38,0.25)' },  // green
  { bg: '#e9d5ff', pin: '#9333ea', accent: '#7e22ce', text: '#3b0764', line: '#7e22ce22', margin: 'rgba(220,38,38,0.25)' },  // purple
  { bg: '#fecdd3', pin: '#e11d48', accent: '#be123c', text: '#4c0519', line: '#be123c22', margin: 'rgba(220,38,38,0.25)' },  // pink/rose
  { bg: '#a5f3fc', pin: '#0891b2', accent: '#0e7490', text: '#083344', line: '#0e749022', margin: 'rgba(220,38,38,0.25)' },  // cyan
];

// Three positional "templates" so every note looks different inside
// Each entry = { top, left, rot } for up to 5 tags
// Note usable area: top 44–220px, left 32–190px. Max-width kept at 80px per tag.
const TAG_TEMPLATES: { top: number; left: number; rot: number }[][] = [
  [
    { top: 48,  left: 36,  rot: -4 },
    { top: 54,  left: 118, rot:  6 },
    { top: 102, left: 42,  rot: -7 },
    { top: 108, left: 115, rot:  3 },
    { top: 160, left: 52,  rot:  5 },
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

type Palette = typeof NOTE_PALETTE[0];

interface StickyNoteProps {
  category: string;
  skills: string[];
  palette: Palette;
  rotation: number;
  offset: { x: number; y: number };
  index: number;
}

function StickyNote({ category, skills, palette, rotation, offset, index }: StickyNoteProps) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const template = TAG_TEMPLATES[index % TAG_TEMPLATES.length];
  const activeRot = hovered ? rotation * 0.25 : rotation;
  const activeY   = hovered ? offset.y - 12 : offset.y;
  const activeScale = hovered ? 1.07 : 1;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 216,
        height: 236,
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `rotate(${activeRot}deg) translate(${offset.x}px, ${activeY}px) scale(${activeScale})`
          : `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y + 32}px) scale(0.88)`,
        transition: [
          `opacity 0.5s ease ${index * 0.11}s`,
          `transform ${hovered ? '0.35s cubic-bezier(0.34,1.56,0.64,1)' : `0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.11}s`}`,
        ].join(', '),
        cursor: 'default',
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* Push pin */}
      <div style={{
        position: 'absolute',
        top: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}>
        <div style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 35%, ${palette.pin}dd, ${palette.pin})`,
          boxShadow: `0 3px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)`,
        }} />
        <div style={{
          width: 2,
          height: 8,
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '0 0 1px 1px',
          margin: '-2px auto 0',
        }} />
      </div>

      {/* Paper body */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: palette.bg,
        borderRadius: '2px 3px 3px 2px',
        boxShadow: hovered
          ? `0 20px 48px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.1)`
          : `0 8px 20px rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.25), 3px 3px 0 rgba(0,0,0,0.08)`,
        transition: 'box-shadow 0.3s ease',
        overflow: 'hidden',
      }}>

        {/* Paper texture — ruled lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 30,
            right: 10,
            top: 44 + i * 26,
            height: 1,
            background: palette.line,
          }} />
        ))}

        {/* Red margin line */}
        <div style={{
          position: 'absolute',
          left: 30,
          top: 40,
          bottom: 10,
          width: 1,
          background: palette.margin,
        }} />

        {/* Bottom-right fold crease */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 22px 22px',
          borderColor: `transparent transparent rgba(0,0,0,0.13) transparent`,
        }} />

        {/* Category heading */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 12,
          right: 12,
          fontFamily: '"Caveat", cursive, var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          color: palette.accent,
          letterSpacing: '0.02em',
          paddingBottom: 7,
          borderBottom: `1.5px solid ${palette.accent}66`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {category}
        </div>

        {/* Tech tags — scattered at randomized positions */}
        {skills.map((skill, i) => {
          const pos = template[i] ?? { top: 48 + i * 34, left: 36, rot: 0 };
          return (
            <div
              key={skill}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rot}deg)`,
                transformOrigin: 'left top',
                fontFamily: '"Caveat", cursive, var(--font-display)',
                fontSize: 14,
                fontWeight: 500,
                color: palette.text,
                maxWidth: 84,
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {skill}
            </div>
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
      {/* Header */}
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
        {totalSkills} skills across {categories.length} domains — hover a note to lift it
      </p>

      {/* Sticky notes board */}
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
          <StickyNote
            key={category}
            category={category}
            skills={skillList}
            palette={NOTE_PALETTE[i % NOTE_PALETTE.length]}
            rotation={NOTE_ROTATIONS[i % NOTE_ROTATIONS.length]}
            offset={NOTE_OFFSETS[i % NOTE_OFFSETS.length]}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
