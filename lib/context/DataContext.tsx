'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  siteConfig,
  stats as defaultStats,
  bio as defaultBio,
  projects as defaultProjects,
  experience as defaultExperience,
  skills as defaultSkills,
} from '@/lib/data';

const STORAGE_KEY = 'portfolio_data_override';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tech: string[];
  purpose: string;
  github: string;
  live: string;
  status: string;
  category: string;
}

export interface ExperienceData {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
}

export interface StatData {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteData {
  hero: {
    name: string;
    role: string;
    punchline: string;
    email: string;
    github: string;
    linkedin: string;
    codolio: string;
    phone: string;
    location: string;
    resumeUrl: string;
  };
  bio: string[];
  stats: StatData[];
  projects: ProjectData[];
  experience: ExperienceData[];
  skills: Record<string, string[]>;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    codolio: string;
    phone: string;
    location: string;
  };
}

const defaultData: SiteData = {
  hero: {
    name: siteConfig.name,
    role: siteConfig.role,
    punchline: siteConfig.punchline,
    email: siteConfig.email,
    github: siteConfig.github,
    linkedin: siteConfig.linkedin,
    codolio: siteConfig.codolio,
    phone: siteConfig.phone,
    location: siteConfig.location,
    resumeUrl: siteConfig.resumeUrl,
  },
  bio: defaultBio,
  stats: defaultStats,
  projects: defaultProjects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tech: p.tech,
    purpose: (p as any).purpose || `Built with ${p.tech.slice(0, 2).join(' and ')}.`,
    github: p.github || '',
    live: p.live || '',
    status: p.status,
    category: p.category,
  })),
  experience: defaultExperience.map(e => ({
    id: e.id,
    role: e.role,
    company: e.company,
    location: e.location,
    duration: e.duration,
    description: e.description,
  })),
  skills: defaultSkills,
  contact: {
    email: siteConfig.email,
    github: siteConfig.github,
    linkedin: siteConfig.linkedin,
    codolio: siteConfig.codolio,
    phone: siteConfig.phone,
    location: siteConfig.location,
  },
};

function save(data: SiteData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

interface DataContextType {
  data: SiteData;
  updateHero: (hero: Partial<SiteData['hero']>) => void;
  updateBio: (bio: string[]) => void;
  updateStats: (stats: StatData[]) => void;
  updateProjects: (projects: ProjectData[]) => void;
  updateExperience: (experience: ExperienceData[]) => void;
  updateSkills: (skills: Record<string, string[]>) => void;
  updateContact: (contact: Partial<SiteData['contact']>) => void;
  resetToDefault: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SiteData>;
        setData(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const updateHero = useCallback((hero: Partial<SiteData['hero']>) => {
    setData(prev => {
      const next = { ...prev, hero: { ...prev.hero, ...hero } };
      save(next);
      return next;
    });
  }, []);

  const updateBio = useCallback((bio: string[]) => {
    setData(prev => {
      const next = { ...prev, bio };
      save(next);
      return next;
    });
  }, []);

  const updateStats = useCallback((stats: StatData[]) => {
    setData(prev => {
      const next = { ...prev, stats };
      save(next);
      return next;
    });
  }, []);

  const updateProjects = useCallback((projects: ProjectData[]) => {
    setData(prev => {
      const next = { ...prev, projects };
      save(next);
      return next;
    });
  }, []);

  const updateExperience = useCallback((experience: ExperienceData[]) => {
    setData(prev => {
      const next = { ...prev, experience };
      save(next);
      return next;
    });
  }, []);

  const updateSkills = useCallback((skills: Record<string, string[]>) => {
    setData(prev => {
      const next = { ...prev, skills };
      save(next);
      return next;
    });
  }, []);

  const updateContact = useCallback((contact: Partial<SiteData['contact']>) => {
    setData(prev => {
      const next = { ...prev, contact: { ...prev.contact, ...contact } };
      save(next);
      return next;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setData(defaultData);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      updateHero,
      updateBio,
      updateStats,
      updateProjects,
      updateExperience,
      updateSkills,
      updateContact,
      resetToDefault,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
