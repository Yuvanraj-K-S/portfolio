'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BOOT_LINES = [
  { text: '> initializing portfolio...', delay: 0 },
  { text: '> loading experience........... [OK]', delay: 420 },
  { text: '> compiling projects........... [OK]', delay: 800 },
  { text: '> rendering skills............. [OK]', delay: 1160 },
  { text: '> establishing contact......... [OK]', delay: 1500 },
  { text: '> WELCOME.', delay: 1820, highlight: true },
];

export default function Loader() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay));
    });

    timers.push(setTimeout(() => setExiting(true), 2400));
    timers.push(setTimeout(() => setDone(true), 3200));

    const handleSkip = () => {
      timers.forEach(clearTimeout);
      setVisibleLines(BOOT_LINES.map((_, i) => i));
      setExiting(true);
      setTimeout(() => setDone(true), 700);
    };

    window.addEventListener('click', handleSkip);
    window.addEventListener('keydown', handleSkip);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
    };
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="terminal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 'min(520px, 90vw)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(11px, 1.5vw, 13px)',
            letterSpacing: '0.03em',
          }}>
            {/* Terminal chrome */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 10, letterSpacing: '0.15em' }}>
                portfolio.sh — bash
              </span>
            </div>

            {/* Boot lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    color: line.highlight ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: line.highlight ? 500 : 400,
                    fontSize: line.highlight ? 'clamp(14px, 2vw, 16px)' : undefined,
                    letterSpacing: line.highlight ? '0.2em' : undefined,
                  }}
                >
                  {line.text}
                  {/* Blinking cursor on last visible line */}
                  {i === Math.max(...visibleLines, -1) && !line.highlight && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      style={{ display: 'inline-block', width: 7, height: '1em', background: 'var(--text-secondary)', marginLeft: 3, verticalAlign: 'middle' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Skip hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: 32,
                color: 'var(--text-muted)',
                fontSize: 9,
                letterSpacing: '0.2em',
              }}
            >
              CLICK ANYWHERE TO SKIP
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Curtain wipe — two panels slide off */}
          <motion.div
            key="curtain-left"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '50%', height: '100%',
              background: 'var(--bg)',
              zIndex: 9998,
            }}
          />
          <motion.div
            key="curtain-right"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0, right: 0,
              width: '50%', height: '100%',
              background: 'var(--bg)',
              zIndex: 9998,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
