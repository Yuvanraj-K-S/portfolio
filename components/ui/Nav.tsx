'use client';

import { useState, useEffect } from 'react';
import { useHeroData } from '../../lib/hooks/useFirestore';

interface NavItem {
  label: string;
  href: string;
}

export default function Nav() {
  const { data: heroData } = useHeroData();
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);

      // Track active section based on scroll position
      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(href);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s var(--ease)',
    background: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    borderBottom: isScrolled ? '1px solid var(--border)' : 'none'
  };

  const nameStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '500'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  };

  const linkStyle = (isActive: boolean) => ({
    fontFamily: 'var(--font-ui)',
    fontSize: '13px',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s var(--ease)',
    position: 'relative' as const
  });

  const activeIndicatorStyle = {
    position: 'absolute' as const,
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: 'var(--text-primary)',
    transition: 'all 0.3s var(--ease)'
  };

  return (
    <nav style={navStyle}>
      {/* Name */}
      <div style={nameStyle}>
        {heroData?.name || 'Portfolio'}
      </div>

      {/* Navigation Links */}
      <div style={navLinksStyle}>
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <div key={item.href}>
              <div
                style={linkStyle(isActive)}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
                {isActive && <div style={activeIndicatorStyle} />}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
