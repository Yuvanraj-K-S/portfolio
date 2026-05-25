'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Meteors } from '@/registry/magicui/meteors';
import { useData } from '@/lib/context/DataContext';

const easeOut = [0.16, 1, 0.3, 1] as const;

function WordReveal({ text, delay = 0, style = {} }: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 0.28em', ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.72,
              delay: delay + i * 0.08,
              ease: easeOut,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function CharStagger({ text, delay = 0, style = {} }: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', ...style }}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.025, delayChildren: delay } },
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const { data } = useData();
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = window.scrollY > 80 ? '0' : '1';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    const about = document.getElementById('about');
    if (about) about.scrollIntoView({ behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <Meteors number={35} />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '20px',
        textAlign: 'center', padding: '0 24px',
      }}>

        {/* Role — slides in from top */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'var(--text-muted)',
          }}
        >
          {data.hero.role.toUpperCase()}
        </motion.div>

        {/* Name — word-by-word clip reveal */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(56px, 12vw, 150px)',
          lineHeight: 0.9,
          color: 'var(--text-primary)',
        }}>
          <WordReveal text={data.hero.name} delay={0.25} />
        </div>

        {/* Punchline — character stagger */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(14px, 2vw, 20px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          letterSpacing: '0.02em',
        }}>
          <CharStagger text={data.hero.punchline} delay={0.8} />
        </div>

        {/* CTAs — stagger fade-up */}
        <motion.div
          style={{ display: 'flex', gap: '16px', marginTop: '8px' }}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.1 } },
          }}
        >
          {[
            { label: 'RÉSUMÉ ↗', href: data.hero.resumeUrl, primary: true },
            { label: 'GITHUB ↗', href: data.hero.github, primary: false },
          ].map(({ label, href, primary }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: easeOut } },
              }}
              whileHover={primary
                ? { background: 'var(--text-primary)', color: 'var(--bg)' }
                : { color: 'var(--text-primary)' }
              }
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: primary ? 'var(--text-primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '10px 24px',
                border: primary ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius: '2px',
                transition: 'background 0.3s, color 0.3s',
                background: 'transparent',
                display: 'block',
              }}
            >
              {label}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        ref={scrollHintRef}
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '10px',
          cursor: 'pointer', transition: 'opacity 0.4s ease',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '8px',
          letterSpacing: '0.3em', color: 'var(--text-muted)',
        }}>
          SCROLL
        </span>
        <div style={{ width: '1px', height: '40px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </motion.div>
    </section>
  );
}
