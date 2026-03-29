'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useData, ProjectData, ExperienceData, StatData } from '@/lib/context/DataContext';

const TABS = ['Hero', 'Bio & Stats', 'Projects', 'Experience', 'Skills', 'Contact'] as const;
type Tab = typeof TABS[number];

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.92)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(12px)',
};

const panelStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px',
  width: '90vw',
  maxWidth: '900px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
  animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--surface-high)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '9px',
  letterSpacing: '0.15em',
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: '6px',
};

function Field({ label, value, onChange, multiline = false, rows = 3 }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

function HeroTab() {
  const { data, updateHero } = useData();
  const h = data.hero;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <Field label="NAME" value={h.name} onChange={v => updateHero({ name: v })} />
        <Field label="ROLE" value={h.role} onChange={v => updateHero({ role: v })} />
      </div>
      <Field label="PUNCHLINE" value={h.punchline} onChange={v => updateHero({ punchline: v })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <Field label="EMAIL" value={h.email} onChange={v => updateHero({ email: v })} />
        <Field label="PHONE" value={h.phone} onChange={v => updateHero({ phone: v })} />
        <Field label="GITHUB URL" value={h.github} onChange={v => updateHero({ github: v })} />
        <Field label="LINKEDIN URL" value={h.linkedin} onChange={v => updateHero({ linkedin: v })} />
        <Field label="CODOLIO URL" value={h.codolio} onChange={v => updateHero({ codolio: v })} />
        <Field label="LOCATION" value={h.location} onChange={v => updateHero({ location: v })} />
      </div>
    </div>
  );
}

function BioStatsTab() {
  const { data, updateBio, updateStats } = useData();
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>BIO PARAGRAPHS</label>
        {data.bio.map((para, i) => (
          <div key={i} style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '12px', flexShrink: 0 }}>{i + 1}</span>
            <textarea
              value={para}
              onChange={e => {
                const updated = [...data.bio];
                updated[i] = e.target.value;
                updateBio(updated);
              }}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', flex: 1 }}
            />
            <button onClick={() => updateBio(data.bio.filter((_, j) => j !== i))}
              style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', padding: '8px', flexShrink: 0, marginTop: '4px', fontSize: '12px' }}>
              ✕
            </button>
          </div>
        ))}
        <button onClick={() => updateBio([...data.bio, ''])}
          style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', background: 'none', border: '1px dashed var(--border)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', marginTop: '4px' }}>
          + ADD PARAGRAPH
        </button>
      </div>

      <label style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>STATS</label>
      {data.stats.map((stat, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 2fr', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
          <input type="number" value={stat.value} onChange={e => {
            const s = [...data.stats];
            s[i] = { ...s[i], value: Number(e.target.value) };
            updateStats(s);
          }} style={{ ...inputStyle }} placeholder="Value" />
          <input type="text" value={stat.suffix} onChange={e => {
            const s = [...data.stats];
            s[i] = { ...s[i], suffix: e.target.value };
            updateStats(s);
          }} style={{ ...inputStyle }} placeholder="Suffix" />
          <input type="text" value={stat.label} onChange={e => {
            const s = [...data.stats];
            s[i] = { ...s[i], label: e.target.value };
            updateStats(s);
          }} style={{ ...inputStyle }} placeholder="Label" />
        </div>
      ))}
    </div>
  );
}

function ProjectsTab() {
  const { data, updateProjects } = useData();
  const [editing, setEditing] = useState<number | null>(null);

  const update = (i: number, field: keyof ProjectData, val: string | string[]) => {
    const updated = [...data.projects];
    updated[i] = { ...updated[i], [field]: val };
    updateProjects(updated);
  };

  return (
    <div>
      {data.projects.map((p, i) => (
        <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
          <div
            onClick={() => setEditing(editing === i ? null : i)}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: editing === i ? 'var(--surface-high)' : 'transparent' }}
          >
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-primary)' }}>{p.title}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', color: 'var(--text-muted)' }}>{editing === i ? '▲ COLLAPSE' : '▼ EXPAND'}</span>
          </div>
          {editing === i && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="TITLE" value={p.title} onChange={v => update(i, 'title', v)} />
                <Field label="STATUS" value={p.status} onChange={v => update(i, 'status', v)} />
                <Field label="CATEGORY" value={p.category} onChange={v => update(i, 'category', v)} />
                <Field label="GITHUB URL" value={p.github} onChange={v => update(i, 'github', v)} />
              </div>
              <Field label="DESCRIPTION" value={p.description} onChange={v => update(i, 'description', v)} multiline rows={3} />
              <Field label="PURPOSE / INTENTION" value={p.purpose} onChange={v => update(i, 'purpose', v)} multiline rows={3} />
              <div>
                <label style={labelStyle}>TECH STACK (comma-separated)</label>
                <input type="text" value={p.tech.join(', ')}
                  onChange={e => update(i, 'tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  style={inputStyle} />
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => updateProjects([...data.projects, { id: String(Date.now()), title: 'New Project', description: '', tech: [], purpose: '', github: '', live: '', status: 'Live', category: 'Full Stack' }])}
        style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', background: 'none', border: '1px dashed var(--border)', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', marginTop: '8px', width: '100%' }}>
        + ADD PROJECT
      </button>
    </div>
  );
}

function ExperienceTab() {
  const { data, updateExperience } = useData();
  const [editing, setEditing] = useState<number | null>(null);

  const update = (i: number, field: keyof ExperienceData, val: string | string[]) => {
    const updated = [...data.experience];
    updated[i] = { ...updated[i], [field]: val };
    updateExperience(updated);
  };

  return (
    <div>
      {data.experience.map((exp, i) => (
        <div key={exp.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
          <div onClick={() => setEditing(editing === i ? null : i)}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: editing === i ? 'var(--surface-high)' : 'transparent' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-primary)' }}>{exp.role} @ {exp.company}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', color: 'var(--text-muted)' }}>{editing === i ? '▲' : '▼'}</span>
          </div>
          {editing === i && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="ROLE" value={exp.role} onChange={v => update(i, 'role', v)} />
                <Field label="COMPANY" value={exp.company} onChange={v => update(i, 'company', v)} />
                <Field label="LOCATION" value={exp.location || ''} onChange={v => update(i, 'location', v)} />
                <Field label="DURATION" value={exp.duration} onChange={v => update(i, 'duration', v)} />
              </div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>BULLET POINTS</label>
              {exp.description.map((desc, j) => (
                <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <textarea value={desc} onChange={e => {
                    const updated = [...exp.description];
                    updated[j] = e.target.value;
                    update(i, 'description', updated);
                  }} rows={2} style={{ ...inputStyle, resize: 'vertical', flex: 1 }} />
                  <button onClick={() => update(i, 'description', exp.description.filter((_, k) => k !== j))}
                    style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', padding: '8px', flexShrink: 0, fontSize: '12px' }}>✕</button>
                </div>
              ))}
              <button onClick={() => update(i, 'description', [...exp.description, ''])}
                style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--text-muted)', background: 'none', border: '1px dashed var(--border)', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                + ADD BULLET
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsTab() {
  const { data, updateSkills } = useData();

  const updateCategory = (cat: string, val: string) => {
    updateSkills({ ...data.skills, [cat]: val.split(',').map(s => s.trim()).filter(Boolean) });
  };

  const renameCategory = (oldCat: string, newCat: string) => {
    const updated: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(data.skills)) {
      updated[k === oldCat ? newCat : k] = v;
    }
    updateSkills(updated);
  };

  const removeCategory = (cat: string) => {
    const updated = { ...data.skills };
    delete updated[cat];
    updateSkills(updated);
  };

  return (
    <div>
      {Object.entries(data.skills).map(([cat, skillList]) => (
        <div key={cat} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <input type="text" value={cat} onChange={e => renameCategory(cat, e.target.value)}
              style={{ ...inputStyle, width: '160px', fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.12em' }} />
            <button onClick={() => removeCategory(cat)}
              style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', padding: '6px 10px', fontSize: '12px' }}>✕</button>
          </div>
          <input type="text" value={skillList.join(', ')}
            onChange={e => updateCategory(cat, e.target.value)}
            style={{ ...inputStyle, fontFamily: 'var(--font-body)', fontSize: '12px' }}
            placeholder="Skill1, Skill2, Skill3..." />
        </div>
      ))}
      <button onClick={() => updateSkills({ ...data.skills, 'New Category': [] })}
        style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', background: 'none', border: '1px dashed var(--border)', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', marginTop: '8px' }}>
        + ADD CATEGORY
      </button>
    </div>
  );
}

function ContactTab() {
  const { data, updateContact } = useData();
  const c = data.contact;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
      <Field label="EMAIL" value={c.email || ''} onChange={v => updateContact({ email: v })} />
      <Field label="PHONE" value={c.phone || ''} onChange={v => updateContact({ phone: v })} />
      <Field label="GITHUB" value={c.github || ''} onChange={v => updateContact({ github: v })} />
      <Field label="LINKEDIN" value={c.linkedin || ''} onChange={v => updateContact({ linkedin: v })} />
      <Field label="CODOLIO" value={c.codolio || ''} onChange={v => updateContact({ codolio: v })} />
      <Field label="LOCATION" value={c.location || ''} onChange={v => updateContact({ location: v })} />
    </div>
  );
}

export default function AdminEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Hero');
  const { resetToDefault } = useData();
  const keysRef = useRef(new Set<string>());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key.toLowerCase());
    if (keysRef.current.has('control') && keysRef.current.has('shift') && keysRef.current.has('e')) {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (!isOpen) return null;

  const tabContent: Record<Tab, React.ReactNode> = {
    'Hero': <HeroTab />,
    'Bio & Stats': <BioStatsTab />,
    'Projects': <ProjectsTab />,
    'Experience': <ExperienceTab />,
    'Skills': <SkillsTab />,
    'Contact': <ContactTab />,
  };

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setIsOpen(false); }}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '4px' }}>ADMIN PANEL · CTRL+SHIFT+E</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}>Edit Portfolio</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { if (confirm('Reset all edits to default?')) resetToDefault(); }}
              style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em', color: '#ef4444', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer' }}
            >
              RESET
            </button>
            <button onClick={() => setIsOpen(false)}
              style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer' }}>
              CLOSE ESC
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', flexShrink: 0, overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--text-primary)' : 'transparent'}`,
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {tabContent[activeTab]}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            Changes auto-save to browser storage · Persists across sessions · Press Ctrl+Shift+E to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
