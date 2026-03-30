'use client';

import { useState, useRef } from 'react';
import { useData, ProjectData } from '@/lib/context/DataContext';

const COVER_GRADIENTS = [
  ['#0d1b2a', '#1b2838'],
  ['#0f0c29', '#302b63'],
  ['#0a0a0a', '#1a1a2e'],
  ['#0d2137', '#1a3a52'],
  ['#1a0533', '#2d1b4e'],
  ['#001a2c', '#0a2d40'],
];

const SPINE_COLORS = [
  '#0a1220',
  '#0a0820',
  '#050505',
  '#091524',
  '#110225',
  '#00101a',
];

interface BookCardProps {
  project: ProjectData;
  colorIndex: number;
}

function BookCard({ project, colorIndex }: BookCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0=Brief, 1=Stack, 2=Purpose
  const [turningPage, setTurningPage] = useState<number | null>(null);

  const [c1, c2] = COVER_GRADIENTS[colorIndex % COVER_GRADIENTS.length];
  const spineColor = SPINE_COLORS[colorIndex % SPINE_COLORS.length];

  const PAGES = [
    {
      label: 'BRIEF',
      num: '01',
      content: (
        <div style={{ padding: '22px 18px 16px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.22em', color: 'var(--text-muted)', marginBottom: '8px' }}>BRIEF</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.1 }}>
            {project.title}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', lineHeight: 1.65, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden' }}>
            {project.description}
          </p>
          {(project.github || project.live) && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.14em', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  GITHUB ↗
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.14em', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  LIVE ↗
                </a>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'STACK',
      num: '02',
      content: (
        <div style={{ padding: '22px 18px 16px', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.22em', color: 'var(--text-muted)', marginBottom: '12px' }}>TECH STACK</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
            {project.tech.map((t, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-ui)', fontSize: '8.5px', letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px', padding: '3px 8px',
              }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>STATUS</span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.1em',
              color: project.status === 'Production' ? '#4ade80' : project.status === 'Live' ? '#60a5fa' : 'var(--text-secondary)',
              border: `1px solid ${project.status === 'Production' ? 'rgba(74,222,128,0.3)' : 'rgba(96,165,250,0.3)'}`,
              padding: '2px 7px', borderRadius: '3px',
            }}>
              {project.status.toUpperCase()}
            </span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>TYPE&nbsp;&nbsp;</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
              {project.category.toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'PURPOSE',
      num: '03',
      content: (
        <div style={{ padding: '22px 18px 16px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.22em', color: 'var(--text-muted)', marginBottom: '12px' }}>INTENTION</div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.75,
            color: 'var(--text-secondary)', fontStyle: 'italic', flex: 1,
          }}>
            &ldquo;{project.purpose}&rdquo;
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
              {project.category.toUpperCase()} PROJECT
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setCurrentPage(0);
  };

  const flipToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < 2) {
      setTurningPage(currentPage);
      setTimeout(() => setTurningPage(null), 600);
      setCurrentPage(p => p + 1);
    }
  };

  const flipToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 0) {
      setTurningPage(currentPage - 1);
      setTimeout(() => setTurningPage(null), 600);
      setCurrentPage(p => p - 1);
    }
  };

  // Page i is "flipped back" if i < currentPage
  const pageFlipped = (i: number) => i < currentPage;

  const pageStyle = (i: number): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '0 9px 9px 0',
    background: 'var(--surface)',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    transformOrigin: 'left center',
    // Each page transforms INDEPENDENTLY — flipped ones rotate back, others stay flat
    transform: pageFlipped(i) ? 'rotateY(-165deg)' : 'rotateY(0deg)',
    transition: 'transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1)',
    // Subtle page edge shadow
    boxShadow: pageFlipped(i) ? 'none' : '-3px 0 8px rgba(0,0,0,0.4)',
  });

  return (
    <div
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      style={{
        position: 'relative',
        width: '210px',
        height: '290px',
        flexShrink: 0,
        perspective: '1400px',
        cursor: 'default',
      }}
    >
      {/* Perspective shadow */}
      <div style={{
        position: 'absolute',
        bottom: '-14px',
        left: isOpen ? '0%' : '6%',
        right: isOpen ? '-18%' : '6%',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        filter: 'blur(14px)',
        transition: 'all 0.6s ease',
        pointerEvents: 'none',
      }} />

      {/* Book wrapper — slight ambient tilt */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: isOpen
          ? 'rotateX(4deg) rotateY(-6deg) scale(1.04)'
          : 'rotateX(6deg) rotateY(-18deg)',
        transition: 'transform 0.65s cubic-bezier(0.645, 0.045, 0.355, 1)',
      }}>

        {/* ── Spine ── */}
        <div style={{
          position: 'absolute',
          left: '-10px',
          top: 0,
          bottom: 0,
          width: '10px',
          background: `linear-gradient(to right, ${spineColor}, rgba(30,30,40,0.8))`,
          transformOrigin: 'right center',
          transform: 'rotateY(-90deg)',
          borderRadius: '2px 0 0 2px',
        }} />

        {/* ── Page 2: Purpose (innermost — rendered first/back) ── */}
        <div style={pageStyle(2)}>
          {PAGES[2].content}
          {/* Page number */}
          <div style={{ position: 'absolute', top: '12px', right: '14px', fontFamily: 'var(--font-ui)', fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>03</div>
        </div>

        {/* ── Page 1: Stack (middle) ── */}
        <div style={pageStyle(1)}>
          {PAGES[1].content}
          <div style={{ position: 'absolute', top: '12px', right: '14px', fontFamily: 'var(--font-ui)', fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>02</div>
        </div>

        {/* ── Page 0: Brief (frontmost inner page) ── */}
        <div style={pageStyle(0)}>
          {PAGES[0].content}
          <div style={{ position: 'absolute', top: '12px', right: '14px', fontFamily: 'var(--font-ui)', fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>01</div>
        </div>

        {/* ── Cover (front face, opens on hover) ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '0 10px 10px 0',
          background: `linear-gradient(145deg, ${c1} 0%, ${c2} 100%)`,
          border: '1px solid rgba(255,255,255,0.1)',
          transformOrigin: 'left center',
          transform: isOpen ? 'rotateY(-168deg)' : 'rotateY(0deg)',
          transition: 'transform 0.65s cubic-bezier(0.645, 0.045, 0.355, 1)',
          boxShadow: '6px 6px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          overflow: 'hidden',
        }}>
          {/* Subtle texture lines */}
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.015) 28px, rgba(255,255,255,0.015) 29px)', pointerEvents: 'none' }} />
          {/* Glow */}
          <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '7.5px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase' }}>
              {project.category}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(18px, 3vw, 26px)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.05,
              marginBottom: '20px',
              letterSpacing: '-0.01em',
            }}>
              {project.title}
            </div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {project.tech.slice(0, 2).map((t, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-ui)', fontSize: '7px', letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '2px 8px', borderRadius: '3px',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: '14px',
            fontFamily: 'var(--font-ui)', fontSize: '7px',
            letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)',
          }}>
            HOVER TO OPEN
          </div>
        </div>
      </div>

      {/* ── Page navigation (outside 3D context, always on top) ── */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          pointerEvents: 'auto',
          // Compensate for the book's 3D tilt so nav stays readable
        }}>
          <button
            onClick={flipToPrev}
            disabled={currentPage === 0}
            style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: currentPage === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${currentPage === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'}`,
              color: currentPage === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              cursor: currentPage === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontFamily: 'sans-serif',
            }}
          >
            ‹
          </button>

          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {PAGES.map((p, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (i > currentPage) {
                    for (let j = currentPage; j < i; j++) {
                      setTimeout(() => setCurrentPage(j + 1), (j - currentPage) * 120);
                    }
                  } else if (i < currentPage) {
                    setCurrentPage(i);
                  }
                }}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '6.5px',
                  letterSpacing: '0.1em',
                  color: i === currentPage ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderBottom: i === currentPage ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={flipToNext}
            disabled={currentPage === 2}
            style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: currentPage === 2 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${currentPage === 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'}`,
              color: currentPage === 2 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              cursor: currentPage === 2 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontFamily: 'sans-serif',
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { data } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.4;
  };

  return (
    <section
      id="projects"
      style={{ padding: 'var(--section-pad) 0', minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '0 clamp(24px, 8vw, 120px)', marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            03 — PROJECTS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1 }}>
          Things I&apos;ve Built
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '10px', letterSpacing: '0.02em' }}>
          Hover to open · Turn pages with ‹ › · Drag to scroll
        </p>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{
          display: 'flex',
          gap: '56px',
          padding: '30px clamp(24px, 8vw, 120px) 80px',
          overflowX: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          alignItems: 'center',
        }}
        className="no-scrollbar"
      >
        {data.projects.map((project, i) => (
          <div
            key={project.id}
            style={{
              opacity: 0,
              animation: `layerSlideIn 0.5s ease ${i * 0.1}s forwards`,
            }}
          >
            <BookCard project={project} colorIndex={i} />
          </div>
        ))}
      </div>

      {/* Scroll dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '8px' }}>
        {data.projects.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? '18px' : '5px',
              height: '3px',
              borderRadius: '2px',
              background: i === 0 ? 'rgba(255,255,255,0.5)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
