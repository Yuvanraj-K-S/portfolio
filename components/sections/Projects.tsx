    'use client';

    import { useState } from 'react';
    import { useProjects } from '../../lib/hooks/useFirestore';
    import { Project } from '../../lib/types';

    interface BookCardProps {
      project: Project;
    }

    function BookCard({ project }: BookCardProps) {
      const [isExpanded, setIsExpanded] = useState(false);
      const [currentPage, setCurrentPage] = useState(0);

      const totalPages = 3;
      const pageTitles = ['Description', 'Technologies', 'Purpose'];

      const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        }
      };

      const handlePrevPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      };

      const handleClose = () => {
        setIsExpanded(false);
        setCurrentPage(0);
      };

      const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      };

      const bookStyle = {
        perspective: '600px',
        transformOrigin: 'center'
      };

      const coverStyle = {
        transformOrigin: '0',
        transition: 'all 0.5s var(--ease)',
        transform: isExpanded ? 'rotateY(-180deg)' : 'rotateY(0deg)'
      };

      const pageStyle = (pageIndex: number) => ({
        position: 'absolute' as const,
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden' as const,
        transform: `rotateY(${pageIndex * 180}deg)`,
        transition: 'transform 0.6s var(--ease)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center'
      });

      const pagesContainerStyle = {
        position: 'relative' as const,
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d' as const,
        transform: `rotateY(${-currentPage * 180}deg)`,
        transition: 'transform 0.6s var(--ease)'
      };

      const cardStyle = {
        width: '200px',
        height: '280px',
        position: 'relative' as const,
        transformStyle: 'preserve-3d' as const,
        cursor: 'pointer',
        margin: '16px'
      };

      const expandedCardStyle = {
        width: '40vw',
        height: '60vh',
        maxWidth: '600px',
        maxHeight: '500px',
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        margin: '0'
      };

      const backdropStyle = {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };

      const coverContent = (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'var(--surface-high)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backfaceVisibility: 'hidden' as const,
          transform: 'rotateY(0deg)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {project.title}
          </h3>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            {project.status}
          </div>
        </div>
      );

      const pageContent = [
        // Page 1: Description
        <div key="description">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            {project.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'var(--text-secondary)'
          }}>
            {project.description}
          </p>
        </div>,

        // Page 2: Technologies
        <div key="technologies">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Technologies
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {project.technologies.map((tech, index) => (
              <span key={index} style={{
                background: 'var(--surface-high)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '4px 12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>,

        // Page 3: Purpose
        <div key="purpose">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Purpose
          </h2>
          {/* TODO: replace with project.purpose once added to Firestore */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'var(--text-secondary)'
          }}>
            Built with {project.technologies.join(', ')} to explore {project.title.toLowerCase()}.
          </p>
        </div>
      ];

      const bookCard = (
        <div style={isExpanded ? expandedCardStyle : cardStyle}>
          <div style={bookStyle}>
            {/* Cover */}
            <div style={coverStyle}>
              {coverContent}
            </div>

            {/* Pages Container */}
            <div style={pagesContainerStyle}>
              {pageContent.map((content, pageIndex) => (
                <div key={pageIndex} style={pageStyle(pageIndex)}>
                  {content}
                </div>
              ))}
            </div>

            {/* Navigation buttons (only visible when expanded) */}
            {isExpanded && (
              <>
                {/* Previous button */}
                {currentPage > 0 && (
                  <button
                    onClick={handlePrevPage}
                    style={{
                      position: 'absolute',
                      left: '-40px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'var(--surface-high)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '16px'
                    }}
                  >
                    ←
                  </button>
                )}

                {/* Next button */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextPage}
                    style={{
                      position: 'absolute',
                      right: '-40px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'var(--surface-high)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '16px'
                    }}
                  >
                    →
                  </button>
                )}

                {/* Close button */}
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '0',
                    background: 'var(--surface-high)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>

                {/* Page indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px'
                }}>
                  {pageTitles[currentPage]} ({currentPage + 1}/{totalPages})
                </div>
              </>
            )}
          </div>
        </div>
      );

      if (isExpanded) {
        return (
          <div style={backdropStyle} onClick={handleBackdropClick}>
            {bookCard}
          </div>
        );
      }

      return (
        <div onClick={() => setIsExpanded(true)}>
          {bookCard}
        </div>
      );
    }

    export default function Projects() {
      const { data: projects, loading, error } = useProjects();

      if (loading) {
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)'
          }}>
            Loading projects...
          </div>
        );
      }

      if (error || !projects) {
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)'
          }}>
            No projects available.
          </div>
        );
      }

      return (
        <section style={{
          padding: 'var(--section-pad)',
          minHeight: '100vh'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            color: 'var(--text-primary)',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            Projects
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            justifyContent: 'center',
            gap: '16px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {projects.map((project) => (
              <BookCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      );
    }
