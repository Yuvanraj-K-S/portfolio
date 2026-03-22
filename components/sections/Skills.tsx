'use client';

import { useSkills } from '../../lib/hooks/useFirestore';
import { Skill } from '../../lib/types';

// Deterministic hash function for consistent rotations/offsets
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Derive deterministic values from category name
function deriveCategoryValues(category: string) {
  const hash = hashCode(category);
  const seed = hash % 1000;
  
  // Rotation between -12 and +12 degrees
  const rotation = (seed % 25) - 12;
  
  // X and Y offsets for organic placement
  const xOffset = (seed % 20) - 10; // -10 to +10
  const yOffset = (seed % 16) - 8;  // -8 to +8
  
  // Position percentages for corkboard layout
  const left = 2 + (seed % 64); // 2% to 65%
  const top = 2 + (seed % 54);  // 2% to 55%
  
  return { rotation, xOffset, yOffset, seed, left, top };
}

interface StickyNoteProps {
  category: string;
  skills: Skill[];
}

function StickyNote({ category, skills }: StickyNoteProps) {
  const { rotation, xOffset, yOffset, seed, left, top } = deriveCategoryValues(category);
  
  const noteStyle = {
    position: 'absolute' as const,
    width: '280px',
    minHeight: '200px',
    background: 'var(--surface-high)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '20px',
    left: `${left}%`,
    top: `${top}%`,
    transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
    transition: 'transform 0.3s var(--ease), box-shadow 0.3s var(--ease)',
    cursor: 'pointer'
  };

  const noteHoverStyle = {
    ...noteStyle,
    transform: `translate(${xOffset}px, ${yOffset - 8}px) rotate(0deg)`,
    boxShadow: '0 0 32px rgba(240,240,240,0.08)'
  };

  const pinStyle = {
    position: 'absolute' as const,
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '16px',
    height: '16px',
    background: 'var(--accent)',
    borderRadius: '50%',
    border: '2px solid var(--surface-high)',
    zIndex: 2
  };

  const pinWobbleKeyframes = `
    @keyframes pin-wobble-${seed} {
      0%, 100% { transform: translateX(-50%) rotate(0deg); }
      25% { transform: translateX(-50%) rotate(3deg); }
      50% { transform: translateX(-50%) rotate(-2deg); }
      75% { transform: translateX(-50%) rotate(1deg); }
    }
  `;

  const skillTagStyle = {
    display: 'inline-block',
    margin: '4px',
    padding: '6px 12px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-ui)',
    transition: 'all 0.2s var(--ease)'
  };

  const skillTagHoverStyle = {
    ...skillTagStyle,
    transform: 'scale(1.05)',
    borderColor: 'rgba(240,240,240,0.4)',
    animation: 'pulse 2s ease-in-out infinite'
  };

  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;

  return (
    <>
      <style>{pinWobbleKeyframes}{pulseKeyframes}</style>
      <div 
        style={noteStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `translate(${xOffset}px, ${yOffset - 8}px) rotate(0deg)`;
          e.currentTarget.style.boxShadow = '0 0 32px rgba(240,240,240,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Pin */}
        <div 
          style={{
            ...pinStyle,
            animation: `pin-wobble-${seed} 3s ease-in-out infinite`
          }}
        />

        {/* Category header */}
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {category}
        </h3>

        {/* Skills list */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          justifyContent: 'center'
        }}>
          {skills.map((skill) => (
            <span
              key={skill.id}
              style={skillTagStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = 'rgba(240,240,240,0.4)';
                e.currentTarget.style.animation = 'pulse 2s ease-in-out infinite';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.animation = 'none';
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Skills() {
  const { data: skills, loading, error } = useSkills();

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
        Loading skills...
      </div>
    );
  }

  if (error || !skills) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)'
      }}>
        No skills available.
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(skillsByCategory);

  return (
    <section style={{
      padding: 'var(--section-pad)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        color: 'var(--text-primary)',
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        Skills
      </h2>

      {/* Corkboard container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '800px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px'
      }}>
        {categories.map((category) => (
          <StickyNote
            key={category}
            category={category}
            skills={skillsByCategory[category]}
          />
        ))}
      </div>
    </section>
  );
}
