// ─────────────────────────────────────────────
//  FIRESTORE DATA TYPES
//  TypeScript interfaces for all portfolio collections
// ─────────────────────────────────────────────

export interface HeroData {
  name: string;
  role: string;
  punchline: string;
  resumeUrl?: string;
  github?: string;
  linkedin?: string;
  codolio?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  duration: string; // e.g., "2022 - Present", "2021 - 2022"
  description: string[]; // array of bullet points
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g., "Frontend", "Backend", "Tools"
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string; // e.g., "2023", "Q4 2023"
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // e.g., "2023", "December 2023"
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  codolio?: string;
  location?: string;
}

// Collection type helpers
export type ProjectsCollection = Record<string, Project>;
export type ExperienceCollection = Record<string, Experience>;
export type SkillsCollection = Record<string, Skill>;
export type CertificationsCollection = Record<string, Certification>;
export type AchievementsCollection = Record<string, Achievement>;
