'use client';

import { useState, useEffect, useRef } from 'react';
import { useExperience } from '../../lib/hooks/useFirestore';
import { Experience } from '../../lib/types';

interface ExperienceNodeProps {
  experience: Experience;
  index: number;
  totalNodes: number;
  isLeft: boolean;
  nodeY: number;
  isVisible: boolean;
  delay: number;
}

function ExperienceNode({ experience, index, totalNodes, isLeft, nodeY, isVisible, delay }: ExperienceNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const nodeStyle = {
    position: 'absolute' as const,
    left: isLeft ? '50%' : '50%',
    transform: isLeft ? 'translateX(-50%)' : 'translateX(-50%)',
    top: `${nodeY}px`,
    opacity: isVisible ? 1 : 0,
    transition: `opacity 0.5s ease ${delay}ms`,
    zIndex: 10
  };

  const circleStyle = {
    width: '16px',
    height: '16px',
    background: 'var(--surface-high)',
    border: '2px solid var(--border)',
    borderRadius: '50%',
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    zIndex: 2
  };

  const cardStyle = {
    position: 'absolute' as const,
    width: '320px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    ...(isLeft ? { right: '40px' } : { left: '40px' }),
    transition: 'all 0.3s var(--ease)',
    cursor: 'pointer'
  };

  const expandedCardStyle = {
    ...cardStyle,
    maxHeight: isExpanded ? '500px' : '72px',
    overflow: 'hidden'
  };

  return (
    <div style={nodeStyle}>
      {/* Timeline circle */}
      <div style={circleStyle} />
      
      {/* Experience card */}
      <div 
        style={expandedCardStyle}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          marginBottom: '4px',
          fontWeight: 'bold'
        }}>
          {experience.role}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: isExpanded ? '12px' : '0'
        }}>
          {experience.company} • {experience.duration}
        </div>
        
        {/* Expanded details */}
        {isExpanded && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--text-secondary)'
          }}>
            {experience.description.map((desc, idx) => (
              <div key={idx} style={{
                marginBottom: '8px',
                paddingLeft: '16px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute' as const,
                  left: '0',
                  color: 'var(--text-muted)'
                }}>
                  •
                </span>
                {desc}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Generate SVG path dynamically based on node count
function generateTimelinePath(nodeCount: number): string {
  if (nodeCount === 0) return '';
  
  const nodeSpacing = 120; // Consistent spacing between nodes
  const amplitude = 40; // Wave amplitude
  
  let path = `M 50 ${nodeSpacing}`; // Start at first node
  
  for (let i = 1; i <= nodeCount; i++) {
    const currentY = i * nodeSpacing;
    const prevY = (i - 1) * nodeSpacing;
    
    // Control points for cubic bezier
    const cx1 = 50 + (i % 2 === 0 ? amplitude : -amplitude);
    const cy1 = prevY + nodeSpacing * 0.3;
    const cx2 = 50 + (i % 2 === 0 ? -amplitude : amplitude);
    const cy2 = currentY - nodeSpacing * 0.3;
    
    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, 50 ${currentY}`;
  }
  
  return path;
}

export default function Experience() {
  const { data: experiences, loading, error } = useExperience();
  const [pathLength, setPathLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [experiences]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
        Loading experience...
      </div>
    );
  }

  if (error || !experiences) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)'
      }}>
        No experience data available.
      </div>
    );
  }

  const nodeCount = experiences.length;
  const nodeSpacing = 120; // Consistent spacing between nodes
  const totalHeight = (nodeCount + 1) * nodeSpacing; // Dynamic total height
  const timelinePath = generateTimelinePath(nodeCount);

  return (
    <section 
      ref={sectionRef}
      style={{
        padding: 'var(--section-pad)',
        minHeight: '100vh',
        position: 'relative',
        height: 'auto',
        paddingBottom: `${totalHeight + 100}px` // Extra padding for last node
      }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        color: 'var(--text-primary)',
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        Experience
      </h2>

      {/* SVG Timeline */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '0',
          transform: 'translateX(-50%)',
          width: '100px',
          height: `${totalHeight}px`,
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <path
          ref={pathRef}
          d={timelinePath}
          stroke="var(--border)"
          strokeWidth="2"
          fill="none"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isVisible ? 0 : pathLength,
            transition: 'stroke-dashoffset 2s ease-out'
          }}
        />
      </svg>

      {/* Experience Nodes */}
      {experiences.map((experience, index) => {
        const nodeY = (index + 1) * nodeSpacing;
        const isLeft = index % 2 === 0;
        const delay = (index / nodeCount) * 2000 + 200; // Proportional to path position
        
        return (
          <ExperienceNode
            key={experience.id}
            experience={experience}
            index={index}
            totalNodes={nodeCount}
            isLeft={isLeft}
            nodeY={nodeY}
            isVisible={isVisible}
            delay={delay}
          />
        );
      })}
    </section>
  );
}
