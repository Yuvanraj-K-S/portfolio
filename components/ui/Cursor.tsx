'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPositionRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.hasAttribute('data-cursor')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.hasAttribute('data-cursor')) {
        setIsHovering(false);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create particle burst
      const particles: Particle[] = [];
      const particleCount = 8;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 3 + Math.random() * 2;
        
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1
        });
      }
      
      particlesRef.current = particles;
    };

    const animate = () => {
      // Lerp ring position toward mouse
      const lerpFactor = 0.1;
      ringPositionRef.current.x += (mouseRef.current.x - ringPositionRef.current.x) * lerpFactor;
      ringPositionRef.current.y += (mouseRef.current.y - ringPositionRef.current.y) * lerpFactor;
      
      // Update ring position
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPositionRef.current.x}px`;
        ringRef.current.style.top = `${ringPositionRef.current.y}px`;
      }
      
      // Update particles
      const canvas = canvasRef.current;
      if (canvas && particlesRef.current.length > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particlesRef.current = particlesRef.current.filter(particle => {
            // Update physics
            particle.vy += 0.12; // gravity
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.045;
            
            // Draw particle
            if (particle.life > 0) {
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, 2.5 * particle.life, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(240,240,240,${particle.life})`;
              ctx.fill();
              return true;
            }
            return false;
          });
        }
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseEnter);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Handle canvas resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const dotStyle = {
    position: 'fixed' as const,
    width: '6px',
    height: '6px',
    background: 'var(--text-primary)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    pointerEvents: 'none'
  };

  const ringStyle = {
    position: 'fixed' as const,
    width: isHovering ? '44px' : '24px',
    height: isHovering ? '44px' : '24px',
    border: `1px solid ${isHovering ? 'rgba(240,240,240,0.8)' : 'rgba(240,240,240,0.35)'}`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9998,
    pointerEvents: 'none',
    transition: 'width 0.3s ease, height 0.3s ease, border 0.3s ease'
  };

  const canvasStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9997,
    pointerEvents: 'none'
  };

  return (
    <>
      <div ref={dotRef} style={dotStyle} />
      <div ref={ringRef} style={ringStyle} />
      <canvas ref={canvasRef} style={canvasStyle} />
    </>
  );
}
