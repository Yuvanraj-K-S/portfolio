'use client';

import { useEffect, useRef, useState } from 'react';

const STAR_POSITIONS = [
  { top: '15%', left: '10%' }, { top: '45%', left: '25%' },
  { top: '25%', left: '55%' }, { top: '60%', left: '80%' },
  { top: '10%', left: '70%' }, { top: '75%', left: '40%' },
  { top: '35%', left: '90%' }
];

export default function Loader() {
  const [isMounted, setIsMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start progress bar animation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return prev + (100 / 15); // 100% over 1500ms (60fps = 15 intervals per 250ms)
      });
    }, 25); // Update every 25ms for smooth animation

    // Auto-fade after 1500ms minimum
    fadeTimeoutRef.current = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsMounted(false), 600);
    }, 1500);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleSkip = () => {
      if (isMounted && !isFading) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        if (fadeTimeoutRef.current) {
          clearTimeout(fadeTimeoutRef.current);
        }
        setProgress(100);
        setIsFading(true);
        setTimeout(() => setIsMounted(false), 600);
      }
    };

    // Add event listeners for skip
    window.addEventListener('click', handleSkip);
    window.addEventListener('keydown', handleSkip);

    return () => {
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [isMounted, isFading]);

  if (!isMounted) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: isFading ? 0 : 1,
      transition: 'opacity 600ms ease-out'
    }}>
      {/* Astronaut and Stars */}
      <div className="box-of-star1">
        {STAR_POSITIONS.map((pos, i) => (
          <div key={`star1-${i}`} className="star" style={{ 
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            animation: `starAnimation 2s infinite ${i * 0.3}s`
          }} />
        ))}
      </div>
      <div className="box-of-star2">
        {STAR_POSITIONS.map((pos, i) => (
          <div key={`star2-${i}`} className="star" style={{ 
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            animation: `starAnimation 2s infinite ${i * 0.3}s`
          }} />
        ))}
      </div>
      <div className="box-of-star3">
        {STAR_POSITIONS.map((pos, i) => (
          <div key={`star3-${i}`} className="star" style={{ 
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            animation: `starAnimation 2s infinite ${i * 0.3}s`
          }} />
        ))}
      </div>
      <div className="box-of-star4">
        {STAR_POSITIONS.map((pos, i) => (
          <div key={`star4-${i}`} className="star" style={{ 
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            animation: `starAnimation 2s infinite ${i * 0.3}s`
          }} />
        ))}
      </div>

      {/* Astronaut */}
      <div className="astronaut">
        <div className="head"></div>
        <div className="arm arm-left"></div>
        <div className="arm arm-right"></div>
        <div className="body">
          <div className="panel"></div>
        </div>
        <div className="leg leg-left"></div>
        <div className="leg leg-right"></div>
        <div className="schoolbag"></div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '1px',
        background: 'var(--surface-high)'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--text-primary)',
          transition: 'width 0.1s ease-out'
        }} />
      </div>

      {/* Skip Label */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        color: 'var(--text-muted)'
      }}>
        CLICK ANYWHERE TO SKIP
      </div>

      {/* CSS Animations */}
      <style>{`
        .box-of-star1,
        .box-of-star2,
        .box-of-star3,
        .box-of-star4 {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        @keyframes starAnimation {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-40px); }
        }

        .astronaut {
          position: relative;
          width: 60px;
          height: 80px;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 30px;
          background: #f5f5f5;
          border-radius: 50%;
          border: 2px solid #333;
        }

        .head::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
        }

        .head::after {
          content: '';
          position: absolute;
          top: 5px;
          right: 5px;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
        }

        .body {
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 35px;
          background: #f5f5f5;
          border: 2px solid #333;
          border-radius: 10px 10px 5px 5px;
        }

        .panel {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 15px;
          background: #333;
          border-radius: 3px;
        }

        .panel::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 4px;
          height: 4px;
          background: #0f0;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        .panel::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 4px;
          height: 4px;
          background: #f00;
          border-radius: 50%;
          animation: blink 1s infinite 0.5s;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .arm {
          position: absolute;
          width: 8px;
          height: 25px;
          background: #f5f5f5;
          border: 2px solid #333;
          border-radius: 10px;
        }

        .arm-left {
          top: 28px;
          left: 8px;
          transform: rotate(-30deg);
          transform-origin: top center;
          animation: armSwing 2s ease-in-out infinite;
        }

        .arm-right {
          top: 28px;
          right: 8px;
          transform: rotate(30deg);
          transform-origin: top center;
          animation: armSwing 2s ease-in-out infinite 1s;
        }

        @keyframes armSwing {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(10deg); }
        }

        .leg {
          position: absolute;
          width: 10px;
          height: 20px;
          background: #f5f5f5;
          border: 2px solid #333;
          border-radius: 5px;
        }

        .leg-left {
          bottom: 0;
          left: 15px;
          transform: rotate(-10deg);
          transform-origin: top center;
          animation: legSwing 1.5s ease-in-out infinite;
        }

        .leg-right {
          bottom: 0;
          right: 15px;
          transform: rotate(10deg);
          transform-origin: top center;
          animation: legSwing 1.5s ease-in-out infinite 0.75s;
        }

        @keyframes legSwing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        .schoolbag {
          position: absolute;
          top: 30px;
          right: -5px;
          width: 15px;
          height: 20px;
          background: #333;
          border-radius: 5px;
          border: 2px solid #555;
        }
      `}</style>
    </div>
  );
}
