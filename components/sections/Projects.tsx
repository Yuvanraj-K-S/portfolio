'use client';

import { useState, useRef } from 'react';
import { useData, ProjectData } from '@/lib/context/DataContext';

const PAGE_COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(255,255,255,0.06)',
  'rgba(255,255,255,0.035)',
];

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #162032 100%)',
  'linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)',
  'linear-gradient(135deg, #1e1e2e 0%, #0f3460 100%)',
];

interface BookCardProps {
  project: ProjectData;
  colorIndex: number;
}

function BookCard({ project, colorIndex }: BookCardProps) {
  const [activePage, setActivePage] = useState<null | number>(null);
  const [flippedPages, setFlippedPages] = useState<boolean[]>([false, false]);
  const bookRef = useRef<HTMLDivElement>(null);

  const gradient = COVER_GRADIENTS[colorIndex % COVER_GRADIENTS.length];

  const pages = [
    {
      label: 'Brief',
      content: (
        <div style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            BRIEF
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.1 }}>
            {project.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {project.description}
          </p>
          {(project.github || project.live) && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
                  GITHUB ↗
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
                  LIVE ↗
                </a>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'Stack',
      content: (
        <div style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            TECH STACK
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.tech.map((tech, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>STATUS</span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em',
              color: project.status === 'Production' ? '#4ade80' : project.status === 'Live' ? '#60a5fa' : 'var(--text-secondary)',
              border: `1px solid ${project.status === 'Production' ? '#4ade8066' : project.status === 'Live' ? '#60a5fa66' : 'var(--border)'}`,
              padding: '2px 8px', borderRadius: '4px',
            }}>
              {project.status.toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Purpose',
      content: (
        <div style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            INTENTION
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{project.purpose}"
          </p>
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
              {project.category.toUpperCase()} PROJECT
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handlePageFlip = (pageIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePage === null) {
      setActivePage(pageIdx);
    } else if (activePage === pageIdx) {
      setActivePage(null);
    } else {
      setActivePage(pageIdx);
    }
  };

  return (
    <>
      <div
        ref={bookRef}
        className="book-card"
        style={{
          position: 'relative',
          width: '200px',
          height: '280px',
          perspective: '800px',
          flexShrink: 0,
        }}
      >
        <div
          className="book-inner"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Book body (back pages stacked) */}
          {[2, 1].map(offset => (
            <div
              key={offset}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px',
                background: PAGE_COLORS[offset],
                border: '1px solid rgba(255,255,255,0.07)',
                transform: `translateX(${offset * 2}px) translateY(${offset * 2}px)`,
                zIndex: offset,
              }}
            />
          ))}

          {/* Cover */}
          <div
            className="book-cover"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '10px',
              background: gradient,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '2px 4px 20px rgba(0,0,0,0.6)',
              zIndex: 10,
              transformOrigin: 'left center',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              cursor: 'pointer',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px',
              }}>
                {project.category.toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}>
                {project.title}
              </div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {project.tech.slice(0, 2).map((t, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '8px',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '3px 8px',
                    borderRadius: '3px',
                  }}>{t}</span>
                ))}
              </div>
              <div style={{
                marginTop: '24px',
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.25)',
              }}>
                HOVER TO OPEN
              </div>
            </div>
          </div>

          {/* Pages (revealed when cover opens) */}
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              onClick={(e) => handlePageFlip(pageIdx, e)}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px',
                background: activePage === pageIdx ? 'var(--surface-high)' : 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: activePage === pageIdx ? '4px 8px 30px rgba(0,0,0,0.5)' : '2px 4px 12px rgba(0,0,0,0.3)',
                zIndex: 3 + pageIdx,
                transformOrigin: 'left center',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                transform: activePage !== null && activePage >= pageIdx
                  ? `rotateY(-160deg) translateZ(${pageIdx * 4}px)`
                  : `translateZ(${pageIdx * 1}px)`,
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {/* Page tab label */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                zIndex: 1,
              }}>
                {String(pageIdx + 1).padStart(2, '0')}
              </div>
              {/* Expand hint on hover */}
              <div
                className="page-content"
                style={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  overflow: 'auto',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {page.content}
              </div>
              {/* Page edge line */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: '10%',
                bottom: '10%',
                width: '3px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
              }} />
            </div>
          ))}
        </div>

        {/* Page navigator dots */}
        {activePage !== null && (
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            zIndex: 20,
          }}>
            {pages.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i === activePage ? null : i)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: activePage === i ? 'var(--text-primary)' : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.2s',
                }}
              />
            ))}
            <button
              onClick={() => setActivePage(null)}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(255,100,100,0.5)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '4px',
              }}
              title="Close"
            />
          </div>
        )}
      </div>
    </>
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
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section
      id="projects"
      style={{ padding: 'var(--section-pad) 0', minHeight: '100vh', overflow: 'hidden' }}
    >
      <div style={{ padding: '0 clamp(24px, 8vw, 120px)', marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            03 — PROJECTS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', lineHeight: 1 }}>
          Things I&apos;ve Built
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
          Hover cards to open · Click pages to flip · Drag to scroll
        </p>
      </div>

      {/* Scrollable layer container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'flex',
          gap: '48px',
          padding: '40px clamp(24px, 8vw, 120px) 80px',
          overflowX: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          alignItems: 'flex-start',
        }}
        className="no-scrollbar"
      >
        {data.projects.map((project, i) => (
          <div
            key={project.id}
            style={{
              opacity: 0,
              animation: `layerSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards`,
            }}
          >
            <BookCard project={project} colorIndex={i} />
          </div>
        ))}
      </div>

      {/* Background scroll indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '16px' }}>
        {data.projects.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? '20px' : '6px',
              height: '3px',
              borderRadius: '2px',
              background: i === 0 ? 'var(--text-primary)' : 'var(--border)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}
