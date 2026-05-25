'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useData, ExperienceData } from '@/lib/context/DataContext';

const ease = [0.16, 1, 0.3, 1] as const;

function RoadNode({ exp, index }: { exp: ExperienceData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease }}
      style={{
        display: 'flex',
        justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
        position: 'relative',
        width: '100%',
        marginBottom: '80px',
      }}
    >
      {/* Card */}
      <motion.div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{
          boxShadow: expanded
            ? '0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)'
            : '0 2px 12px rgba(0,0,0,0.2)',
          borderColor: expanded ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: 'calc(50% - 60px)',
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'default',
          position: 'relative',
        }}
      >
        {/* Connector line to road */}
        <div style={{
          position: 'absolute',
          top: '50%',
          [index % 2 === 0 ? 'right' : 'left']: '-60px',
          width: '60px',
          height: '1px',
          background: `linear-gradient(${index % 2 === 0 ? 'to right' : 'to left'}, transparent, rgba(255,255,255,0.1))`,
          transform: 'translateY(-50%)',
        }} />

        {/* Node dot on road */}
        <motion.div
          animate={{
            background: expanded ? 'var(--text-primary)' : 'var(--surface-high)',
            boxShadow: expanded ? '0 0 14px rgba(240,240,240,0.35)' : 'none',
            scale: expanded ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '50%',
            [index % 2 === 0 ? 'right' : 'left']: '-68px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.15)',
            transform: 'translateY(-50%)',
            zIndex: 5,
          }}
        />

        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: '9px',
          letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '8px',
        }}>
          {exp.duration}
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '20px',
          color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.1,
        }}>
          {exp.role}
        </div>

        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: expanded ? '16px' : '0',
          transition: 'margin 0.3s ease',
        }}>
          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
        </div>

        <motion.div
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ paddingTop: 4 }}>
            {exp.description.map((desc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={expanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease }}
                style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
              >
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>▸</span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px',
                  lineHeight: 1.65, color: 'var(--text-secondary)',
                }}>
                  {desc}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Experience() {
  const { data } = useData();
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
          const p = Math.min((ts - start) / 1800, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setRoadProgress(eased);
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
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

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh', position: 'relative' }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          02 — EXPERIENCE
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Heading */}
      <div ref={headerRef} style={{ overflow: 'hidden', marginBottom: '80px' }}>
        <motion.h2
          initial={{ y: '100%', opacity: 0 }}
          animate={headerInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          The Road So Far
        </motion.h2>
      </div>

      <div style={{ position: 'relative' }}>
        {/* SVG Road */}
        <svg
          style={{
            position: 'absolute', left: '50%', top: 0,
            transform: 'translateX(-50%)',
            width: '100px', height: `${totalHeight}px`,
            pointerEvents: 'none', zIndex: 1,
          }}
          viewBox={`0 0 100 ${totalHeight}`}
          preserveAspectRatio="none"
        >
          {/* Road base */}
          <path d={roadPath} stroke="var(--surface-high)" strokeWidth="18" fill="none" strokeLinecap="round" />
          {/* Road edge shimmer */}
          <path d={roadPath} stroke="rgba(255,255,255,0.04)" strokeWidth="22" fill="none" strokeLinecap="round" />
          {/* Center dash */}
          <path
            d={roadPath}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="7 11"
            strokeLinecap="round"
          />
          {/* Animated progress glow */}
          <path
            d={roadPath}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray={`${roadProgress * 2400} 2400`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.08s linear', filter: 'blur(0.5px)' }}
          />
        </svg>

        {/* Experience cards */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {data.experience.map((exp, index) => (
            <RoadNode key={exp.id} exp={exp} index={index} />
          ))}
        </div>

        {/* Road end marker */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={roadProgress > 0.9 ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '20px', height: '20px', borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.1)',
            background: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        </motion.div>
      </div>
    </section>
  );
}
