'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

interface NavItem {
  label: string;
  href: string;
}

export default function Nav() {
  const { data } = useData();
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = [
    { label: 'About',      href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects',   href: '#projects' },
    { label: 'Skills',     href: '#skills' },
    { label: 'Contact',    href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const id = href.slice(1);
    const element = document.getElementById(id);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(element || href);
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s var(--ease)',
      background: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
    }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-primary)' }}>
        {data.hero.name || 'Portfolio'}
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <div
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.2s var(--ease)',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {item.label}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px', left: 0, right: 0,
                  height: '2px',
                  background: 'var(--text-primary)',
                  transition: 'all 0.3s var(--ease)',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
