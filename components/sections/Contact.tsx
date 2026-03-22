'use client';

import { useState, useEffect, useRef } from 'react';
import { useContactInfo } from '../../lib/hooks/useFirestore';
import { ContactInfo } from '../../lib/types';

interface ContactCardProps {
  icon: JSX.Element;
  label: string;
  color: string;
  onClick?: () => void;
  delay: number;
  isExpanded: boolean;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform: string;
  };
}

function ContactCard({ icon, label, color, onClick, delay, isExpanded, position }: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
      if (label.includes('Phone')) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  const cardStyle = {
    position: 'absolute' as const,
    width: '100px',
    height: '60px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.4s ease-in-out',
    opacity: isExpanded ? 1 : 0,
    transitionDelay: `${delay}ms`,
    ...position
  };

  const cardStyleWithTransform = {
    ...cardStyle,
    transform: isExpanded ? 'scale(1)' : 'scale(0.8)'
  };

  const cardHoverStyle = {
    ...cardStyle,
    background: color,
    borderColor: color
  };

  return (
    <div
      style={cardStyleWithTransform}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      onClick={handleClick}
    >
      <div style={{ marginBottom: '4px' }}>
        {icon}
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        color: isExpanded ? 'white' : 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        {copied ? 'COPIED!' : label}
      </div>
    </div>
  );
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

function EmailModal({ isOpen, onClose, email }: EmailModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: email
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''
      );
      
      setStatus('sent');
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
      },2000);
    } catch (error) {
      setStatus('error');
    }
  };

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease'
  };

  const modalContentStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '32px',
    width: '400px',
    maxWidth: '90vw',
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    transition: 'transform 0.3s ease'
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <div 
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--text-primary)'
          }}>
            Send Message
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              suppressHydrationWarning
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-high)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              suppressHydrationWarning
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-high)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              suppressHydrationWarning
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-high)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              rows={4}
              suppressHydrationWarning
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-high)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '14px',
              background: status === 'sent' ? '#0AC4E0' : 'var(--surface-high)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: status === 'sent' ? 'white' : 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              opacity: status === 'sending' ? 0.6 : 1
            }}
          >
            {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Contact() {
  const { data: contactInfo, loading, error } = useContactInfo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowEmailModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
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
        Loading contact info...
      </div>
    );
  }

  if (error || !contactInfo) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)'
      }}>
        No contact information available.
      </div>
    );
  }

  // Pulse animation keyframes
  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(240, 240, 240, 0.1); }
      50% { box-shadow: 0 0 0 8px rgba(240, 240, 240, 0.05); }
    }
  `;

  const widgetStyle = {
    position: 'relative' as const,
    width: '120px',
    height: '120px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s ease-in-out',
    margin: '0 auto'
  };

  const expandedWidgetStyle = {
    ...widgetStyle,
    width: '300px',
    height: '300px'
  };

  const crossLineStyle = {
    position: 'absolute' as const,
    background: 'var(--text-primary)',
    transition: 'all 0.4s ease-in-out'
  };

  const horizontalLineStyle = {
    ...crossLineStyle,
    width: isExpanded ? '100px' : '40px',
    height: '2px',
    transform: 'rotate(0deg)'
  };

  const verticalLineStyle = {
    ...crossLineStyle,
    width: '2px',
    height: isExpanded ? '100px' : '40px',
    transform: 'rotate(0deg)'
  };

  const handleEmailClick = () => setShowEmailModal(true);
  const handleGithubClick = () => window.open(contactInfo.github, '_blank');
  const handleLinkedInClick = () => window.open(contactInfo.linkedin, '_blank');
  const handleCodolioClick = () => window.open(contactInfo.codolio, '_blank');
  const handlePhoneClick = () => {
    navigator.clipboard.writeText(contactInfo.phone);
  };

  return (
    <section style={{
      padding: 'var(--section-pad)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center'
    }}>
      <style>{pulseKeyframes}</style>
      
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        color: 'var(--text-primary)',
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        Contact
      </h2>

      {/* Contact Widget */}
      <div
        style={isExpanded ? expandedWidgetStyle : widgetStyle}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={(e) => {
          if (!isExpanded) {
            setIsExpanded(true);
          }
        }}
      >
        {/* Cross/Plus shape */}
        <div style={horizontalLineStyle} />
        <div style={verticalLineStyle} />

        {/* Contact text when collapsed */}
        {!isExpanded && (
          <div style={{
            position: 'absolute' as const,
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            CONTACT
          </div>
        )}

        {/* Expanded cards */}
        {isExpanded && (
          <>
            {/* Center: Email */}
            <ContactCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              }
              label="Email"
              color="#E14594"
              onClick={handleEmailClick}
              delay={100}
              isExpanded={isExpanded}
              position={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* Top: GitHub */}
            <ContactCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12z"/>
                </svg>
              }
              label="GitHub"
              color="#333333"
              onClick={handleGithubClick}
              delay={200}
              isExpanded={isExpanded}
              position={{
                top: '-80px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />

            {/* Bottom: LinkedIn */}
            <ContactCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-1.846 1.422-2.015 2.819-2.015v-2.159c1.926.418 3.255 1.862 3.255 1.862 1.422 0 2.543-.9 2.543-2.015v-2.159c1.397 0 2.819.169 2.819 2.015 0 1.825-1.709 1.825-3.037v-5.569h3.554c.319 0 .576-.257.576-.576v-3.192c0-.319-.257-.576-.576-.576z"/>
                  <path d="M3.997 20.452c-.319 0-.576-.257-.576-.576v-3.192c0-.319.257-.576.576-.576h3.554v-5.569c0-4.874 3.626-8.727 8.199-8.727 4.573 0 8.199 3.853 8.199 8.727v5.569h3.554c.319 0 .576.257.576.576v3.192c0 .319-.257.576-.576.576z"/>
                </svg>
              }
              label="LinkedIn"
              color="#0077B5"
              onClick={handleLinkedInClick}
              delay={300}
              isExpanded={isExpanded}
              position={{
                bottom: '-80px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />

            {/* Left: Codolio */}
            <ContactCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              }
              label="Codolio"
              color="#7045AF"
              onClick={handleCodolioClick}
              delay={400}
              isExpanded={isExpanded}
              position={{
                left: '-80px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />

            {/* Right: Phone */}
            <ContactCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.46.45l2.27 2.27c.39.39 1.02.39 1.41 0l2.27-2.27c.63-.63.18-1.73-.45-2.12l-2.2-2.2c-.12-.12-.26-.2-.41-.24-.01 0-.02 0-.03 0zm3.85 1.85c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77z"/>
                </svg>
              }
              label="Phone"
              color="#0AC4E0"
              onClick={handlePhoneClick}
              delay={500}
              isExpanded={isExpanded}
              position={{
                right: '-80px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          </>
        )}
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={contactInfo.email}
      />
    </section>
  );
}
