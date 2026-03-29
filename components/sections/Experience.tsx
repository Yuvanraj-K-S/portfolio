'use client';

import { useRef, useEffect, useState } from 'react';
import { useData, ExperienceData } from '@/lib/context/DataContext';

function RoadNode({ exp, index, isLeft }: { exp: ExperienceData; index: number; isLeft: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        position: 'relative',
        width: '100%',
        marginBottom: '80px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : `translateX(${isLeft ? '-40px' : '40px'})`,
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
      }}
    >
      {/* Card */}
      <div
        style={{
          width: 'calc(50% - 60px)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s var(--ease)',
          boxShadow: expanded ? '0 8px 40px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Road marker connector */}
        <div style={{
          position: 'absolute',
          top: '50%',
          [isLeft ? 'right' : 'left']: '-60px',
          width: '60px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, var(--border))',
          transform: 'translateY(-50%)',
        }} />

        {/* Node dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          [isLeft ? 'right' : 'left']: '-68px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: expanded ? 'var(--text-primary)' : 'var(--surface-high)',
          border: '2px solid var(--border)',
          transform: 'translateY(-50%)',
          transition: 'all 0.3s ease',
          boxShadow: expanded ? '0 0 12px rgba(240,240,240,0.3)' : 'none',
          zIndex: 5,
        }} />

        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {exp.duration}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.1 }}>
          {exp.role}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: expanded ? '16px' : '0', transition: 'margin 0.3s ease' }}>
          {exp.company} {exp.location ? `· ${exp.location}` : ''}
        </div>

        <div style={{
          maxHeight: expanded ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {exp.description.map((desc, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>▸</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { data } = useData();
  const roadRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [roadProgress, setRoadProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start: number | null = null;
        const animate = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / 1500, 1);
          setRoadProgress(progress);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const nodeCount = data.experience.length;
  const nodeSpacing = 160;
  const totalHeight = (nodeCount + 1) * nodeSpacing;

  let roadPath = `M 50 20`;
  for (let i = 0; i < nodeCount; i++) {
    const y = (i + 1) * nodeSpacing;
    const prevY = i * nodeSpacing + 20;
    const cpX = 50 + (i % 2 === 0 ? 30 : -30);
    roadPath += ` C ${cpX} ${prevY + nodeSpacing * 0.4}, ${cpX} ${y - nodeSpacing * 0.4}, 50 ${y}`;
  }
  roadPath += ` C 50 ${totalHeight - 30}, 50 ${totalHeight - 10}, 50 ${totalHeight}`;

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          02 — EXPERIENCE
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', marginBottom: '80px', lineHeight: 1 }}>
        The Road So Far
      </h2>

      <div style={{ position: 'relative' }}>
        {/* SVG Road */}
        <svg
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '100px',
            height: `${totalHeight}px`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
          viewBox={`0 0 100 ${totalHeight}`}
          preserveAspectRatio="none"
        >
          {/* Road base (wide) */}
          <path
            d={roadPath}
            stroke="var(--surface-high)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Road border left */}
          <path
            d={roadPath}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
          />
          {/* Road fill */}
          <path
            d={roadPath}
            stroke="var(--surface-high)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center dashed line */}
          {roadRef && (
            <path
              ref={roadRef}
              d={roadPath}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 10"
              strokeLinecap="round"
            />
          )}
          {/* Animated progress line */}
          <path
            d={roadPath}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${roadProgress * 2000} 2000`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.1s linear' }}
          />
        </svg>

        {/* Experience Nodes */}
        <div style={{ position: 'relative', zIndex: 2, paddingTop: '0' }}>
          {data.experience.map((exp, index) => (
            <RoadNode
              key={exp.id}
              exp={exp}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>

        {/* Road end marker */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid var(--border)',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        </div>
      </div>
    </section>
  );
}
