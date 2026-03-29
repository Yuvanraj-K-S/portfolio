'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

function EmailModal({ isOpen, onClose, email }: EmailModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
        { from_name: formData.name, from_email: formData.email, subject: formData.subject, message: formData.message, to_email: email },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''
      );
      setStatus('sent');
      setTimeout(() => { onClose(); setFormData({ name: '', email: '', subject: '', message: '' }); setStatus('idle'); }, 2200);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--surface-high)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px', width: '460px', maxWidth: '90vw', position: 'relative', animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '4px' }}>GET IN TOUCH</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>Send a Message</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px 12px', fontSize: '14px', transition: 'all 0.2s' }}>
            ESC
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <input type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required suppressHydrationWarning style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            <input type="email" placeholder="Your email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required suppressHydrationWarning style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          </div>
          <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} required suppressHydrationWarning style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          <textarea placeholder="Your message..." value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} required rows={5} suppressHydrationWarning style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '14px',
              background: status === 'sent' ? '#4ade8033' : status === 'error' ? '#ef444433' : 'var(--surface-high)',
              border: `1px solid ${status === 'sent' ? '#4ade80' : status === 'error' ? '#ef4444' : 'var(--border)'}`,
              borderRadius: '8px',
              color: status === 'sent' ? '#4ade80' : status === 'error' ? '#ef4444' : 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {status === 'sending' ? 'SENDING...' : status === 'sent' ? '✓ SENT!' : status === 'error' ? 'ERROR — TRY AGAIN' : 'SEND MESSAGE →'}
          </button>
        </form>
      </div>
    </div>
  );
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  detail: string;
  color: string;
  action: () => void;
}

export default function Contact() {
  const { data } = useData();
  const [hovering, setHovering] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(''), 1800);
    });
  };

  const contacts: ContactItem[] = [
    {
      label: 'Email',
      detail: data.contact.email || '',
      color: '#E14594',
      action: () => setShowEmailModal(true),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
    },
    {
      label: 'GitHub',
      detail: 'Yuvanraj-K-S',
      color: '#f0f0f0',
      action: () => window.open(data.contact.github, '_blank'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      detail: 'Yuvanraj-K-S',
      color: '#0077B5',
      action: () => window.open(data.contact.linkedin, '_blank'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      label: 'Codolio',
      detail: 'yuvanraj',
      color: '#7045AF',
      action: () => window.open(data.contact.codolio, '_blank'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      ),
    },
    {
      label: 'Phone',
      detail: data.contact.phone || '',
      color: '#0AC4E0',
      action: () => copyToClipboard(data.contact.phone || '', 'Phone'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      ),
    },
    {
      label: 'Location',
      detail: data.contact.location || '',
      color: '#888888',
      action: () => {},
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <section
      id="contact"
      style={{ padding: 'var(--section-pad) clamp(24px, 8vw, 120px)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          05 — CONTACT
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1 }}>
        Let&apos;s Talk
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '64px', maxWidth: '500px', lineHeight: 1.7 }}>
        Open to full-time roles, freelance projects, and interesting collaborations.
      </p>

      {/* Contact Grid */}
      <div
        className="contact-main"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: '3px',
          width: '210px',
          padding: '3px',
          background: hovering ? 'transparent' : 'var(--surface)',
          border: `1px solid ${hovering ? 'transparent' : 'var(--border)'}`,
          borderRadius: '12px',
          transition: 'all 0.4s var(--ease)',
          cursor: 'pointer',
        }}
      >
        {/* Collapsed label */}
        {!hovering && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            transition: 'opacity 0.3s ease',
            zIndex: 5,
          }}>
            HOVER FOR CONTACTS
          </div>
        )}

        {contacts.map((contact, i) => (
          <div
            key={contact.label}
            onClick={hovering ? contact.action : undefined}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '9px',
              background: hovering ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: `1px solid ${hovering ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: hovering ? 'pointer' : 'default',
              transition: 'all 0.4s var(--ease)',
              transitionDelay: `${hovering ? i * 0.04 : 0}s`,
              opacity: hovering ? 1 : 0,
              transform: hovering ? 'scale(1)' : 'scale(0.7)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (!hovering) return;
              e.currentTarget.style.background = contact.color + '22';
              e.currentTarget.style.borderColor = contact.color + '66';
              e.currentTarget.style.transform = 'scale(1.08)';
              const icon = e.currentTarget.querySelector('.contact-icon') as HTMLElement;
              if (icon) icon.style.color = contact.color;
              const detail = e.currentTarget.querySelector('.contact-detail') as HTMLElement;
              if (detail) detail.style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              const icon = e.currentTarget.querySelector('.contact-icon') as HTMLElement;
              if (icon) icon.style.color = 'var(--text-secondary)';
              const detail = e.currentTarget.querySelector('.contact-detail') as HTMLElement;
              if (detail) detail.style.opacity = '0';
            }}
          >
            {/* Hover detail tooltip */}
            <div
              className="contact-detail"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                background: 'var(--surface-high)',
                border: `1px solid ${contact.color}44`,
                borderRadius: '6px',
                padding: '6px 10px',
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.1em',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                zIndex: 100,
                pointerEvents: 'none',
              }}
            >
              {copiedLabel === contact.label ? '✓ COPIED!' : contact.detail}
            </div>

            <div
              className="contact-icon"
              style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease',
                display: 'flex',
              }}
            >
              {contact.icon}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '7px',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
            }}>
              {contact.label === 'Phone' && copiedLabel === 'Phone' ? 'COPIED!' : contact.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Direct email CTA */}
      <div style={{ marginTop: '48px' }}>
        <button
          onClick={() => setShowEmailModal(true)}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--text-secondary)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 28px',
            cursor: 'pointer',
            transition: 'all 0.3s var(--ease)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          OR SEND A DIRECT MESSAGE →
        </button>
      </div>

      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} email={data.contact.email || ''} />
    </section>
  );
}
