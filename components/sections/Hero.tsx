'use client';

import { useEffect, useRef, useState } from 'react';
import { Meteors } from '@/registry/magicui/meteors';
import { useData } from '@/lib/context/DataContext';

function JelloText({ text, style = {} }: { text: string; style?: React.CSSProperties }) {
  return (
    <div className="jello-container" style={style}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="jello-char"
          style={{ animationDelay: `${i * 0.04}s`, display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

function FlickerName({ name }: { name: string }) {
  return (
    <div className="flicker-name-wrapper">
      {name.split('').map((char, i) => (
        <span
          key={i}
          className="flicker-char"
          style={{ animationDelay: `${(i * 0.15 + Math.sin(i * 0.9) * 0.3).toFixed(2)}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const { data } = useData();
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollHintRef.current) {
        const opacity = window.scrollY > 80 ? 0 : 1;
        scrollHintRef.current.style.opacity = opacity.toString();
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
      ref={heroRef}
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'var(--text-muted)',
            opacity: 0,
            animation: 'heroFadeIn 0.6s ease-out 0.1s forwards',
          }}
        >
          {data.hero.role.toUpperCase()}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 12vw, 150px)',
            lineHeight: 0.9,
            color: 'var(--text-primary)',
            opacity: 0,
            animation: 'heroFadeIn 0.8s ease-out 0.3s forwards',
          }}
        >
          <FlickerName name={data.hero.name} />
        </div>

        <div
          style={{
            opacity: 0,
            animation: 'heroFadeIn 0.8s ease-out 0.7s forwards',
          }}
        >
          <JelloText
            text={data.hero.punchline}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2vw, 20px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
            opacity: 0,
            animation: 'heroFadeIn 0.8s ease-out 1s forwards',
          }}
        >
          <a
            href={data.hero.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              padding: '10px 24px',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              transition: 'all 0.3s var(--ease)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--text-primary)';
              e.currentTarget.style.color = 'var(--bg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            RÉSUMÉ ↗
          </a>
          <a
            href={data.hero.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              padding: '10px 24px',
              border: '1px solid transparent',
              borderRadius: '2px',
              transition: 'color 0.3s var(--ease)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            GITHUB ↗
          </a>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        onClick={handleScrollDown}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'opacity 0.4s ease',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '8px',
            letterSpacing: '0.3em',
            color: 'var(--text-muted)',
          }}
        >
          SCROLL
        </span>
        <div style={{ width: '1px', height: '40px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
