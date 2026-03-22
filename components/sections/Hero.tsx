'use client';

import { useEffect, useRef } from 'react';
import { useHeroData } from '../../lib/hooks/useFirestore';

class BreathingPolygon {
  private ctx: CanvasRenderingContext2D;
  private vertices: { x: number; y: number; amplitude: number; phase: number; frequency: number }[] = [];
  private animationId: number | null = null;
  private mousePos = { x: 0, y: 0 };
  private time = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.initVertices();
  }

  private initVertices() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.vertices.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        amplitude: 20 + Math.random() * 15,
        phase: Math.random() * Math.PI * 2,
        frequency: 0.5 + Math.random() * 0.5
      });
    }
  }

  public updateMouse(x: number, y: number) {
    this.mousePos = { x, y };
  }

  public animate = () => {
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw polygon
    this.ctx.beginPath();
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--polygon-color');
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < this.vertices.length; i++) {
      const vertex = this.vertices[i];
      const nextVertex = this.vertices[(i + 1) % this.vertices.length];
      
      // Calculate breathing offset
      const breathingOffset = Math.sin(this.time * vertex.frequency + vertex.phase) * vertex.amplitude;
      
      // Calculate mouse repulsion
      const dx = this.mousePos.x - vertex.x;
      const dy = this.mousePos.y - vertex.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;
      const repulsionStrength = Math.max(0, 1 - distance / maxDistance);
      
      const repulsionX = (dx / distance) * repulsionStrength * 30;
      const repulsionY = (dy / distance) * repulsionStrength * 30;
      
      const x = vertex.x + breathingOffset + repulsionX;
      const y = vertex.y + repulsionY;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.stroke();
  };

  public start = () => {
    const loop = () => {
      this.animate();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  };

  public stop = () => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  public resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.vertices = [];
    this.initVertices();
  };
}

export default function Hero() {
  const { data: heroData, loading } = useHeroData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const polygonRef = useRef<BreathingPolygon | null>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || loading) return;

    const canvas = canvasRef.current;
    const polygon = new BreathingPolygon(canvas);
    polygonRef.current = polygon;

    // Start animation
    polygon.start();

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      polygon.updateMouse(e.clientX, e.clientY);
    };

    // Handle resize
    const handleResize = () => {
      polygon.resize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      polygon.stop();
    };
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollHintRef.current) {
        const scrollY = window.scrollY;
        const opacity = scrollY > 100 ? 0 : 1;
        scrollHintRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return null; // Show nothing while loading
  }

  if (!heroData) {
    return null;
  }

  return (
    <section style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      />

      {/* Text Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        {/* Role Label */}
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-muted)',
          opacity: 0,
          animation: 'fadeIn 0.5s ease-out 0ms forwards'
        }}>
          {heroData.role}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 11vw, 140px)',
          color: 'var(--text-primary)',
          fontVariationSettings: "'MORF' 15, 'SHLN' 50",
          opacity: 0,
          transform: 'translateY(20px)',
          animation: 'fadeInSlideUp 0.8s ease-out 200ms forwards'
        }}>
          {heroData.name}
        </div>

        {/* Punchline */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          fontWeight: '300',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          opacity: 0,
          transform: 'translateY(20px)',
          animation: 'fadeInSlideUp 0.8s ease-out 500ms forwards'
        }}>
          {heroData.punchline}
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          SCROLL
        </div>
        
        {/* Animated Scroll Line */}
        <div style={{
          width: '2px',
          height: '20px',
          background: 'var(--text-muted)',
          transform: 'scaleY(0)',
          transformOrigin: 'top',
          animation: 'scrollLine 1.8s ease-in-out infinite'
        }} />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scrollLine {
          0%, 100% { 
            transform: scaleY(0); 
            transform-origin: top; 
          }
          49% { 
            transform: scaleY(1); 
            transform-origin: top; 
          }
          50% { 
            transform: scaleY(1); 
            transform-origin: bottom; 
          }
          100% { 
            transform: scaleY(0); 
            transform-origin: bottom; 
          }
        }
      `}</style>
    </section>
  );
}
