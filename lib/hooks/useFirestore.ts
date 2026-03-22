import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  DocumentData,
  QuerySnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  HeroData, 
  Project, 
  Experience, 
  Skill, 
  Certification, 
  Achievement, 
  ContactInfo 
} from '../types';
import { 
  siteConfig, 
  projects, 
  experience, 
  skills, 
  certifications, 
  achievements 
} from '../data';

// ─────────────────────────────────────────────
//  GENERIC FIRESTORE HOOKS
//  Real-time data with fallback to static data
// ─────────────────────────────────────────────

interface FirestoreState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

function useCollection<T extends DocumentData>(
  collectionPath: string,
  fallbackData: T[],
  orderByField?: string
): FirestoreState<T[]> {
  const [state, setState] = useState<FirestoreState<T[]>>({
    data: null,
    loading: true,
    error: false
  });

  useEffect(() => {
    setState({ data: null, loading: true, error: false });

    const collectionRef = collection(db, collectionPath);
    const q = orderByField ? query(collectionRef, orderBy(orderByField)) : collectionRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];

        // If Firestore is empty, use fallback silently
        if (data.length === 0) {
          setState({ data: fallbackData, loading: false, error: false });
        } else {
          setState({ data, loading: false, error: false });
        }
      },
      (error) => {
        // On any Firestore error, use fallback silently
        console.warn('Firestore error, using fallback:', error);
        setState({ data: fallbackData, loading: false, error: false });
      }
    );

    return unsubscribe;
  }, [collectionPath, fallbackData, orderByField]);

  return state;
}

function useDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string,
  fallbackData: T
): FirestoreState<T> {
  const [state, setState] = useState<FirestoreState<T>>({
    data: null,
    loading: true,
    error: false
  });

  useEffect(() => {
    setState({ data: null, loading: true, error: false });

    const docRef = doc(db, collectionPath, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setState({ 
            data: { id: docSnapshot.id, ...docSnapshot.data() } as T, 
            loading: false, 
            error: false 
          });
        } else {
          // Document doesn't exist, use fallback
          setState({ data: fallbackData, loading: false, error: false });
        }
      },
      (error) => {
        // On any Firestore error, use fallback silently
        console.warn('Firestore error, using fallback:', error);
        setState({ data: fallbackData, loading: false, error: false });
      }
    );

    return unsubscribe;
  }, [collectionPath, docId, fallbackData]);

  return state;
}

// ─────────────────────────────────────────────
//  FALLBACK DATA TRANSFORMATIONS
//  Pre-transformed to match Firestore interfaces
// ─────────────────────────────────────────────

const HERO_FALLBACK: HeroData = {
  name: siteConfig.name,
  role: siteConfig.role,
  punchline: siteConfig.punchline,
  resumeUrl: siteConfig.resumeUrl,
  github: siteConfig.github,
  linkedin: siteConfig.linkedin,
  codolio: siteConfig.codolio,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location
};

const PROJECTS_FALLBACK: Project[] = projects.map(p => ({
  id: p.id,
  title: p.title,
  description: p.description,
  liveUrl: p.live || undefined,
  githubUrl: p.github || undefined,
  technologies: p.tech,
  featured: false,
  status: p.status.toLowerCase() as 'completed' | 'in-progress' | 'planned',
  order: parseInt(p.id)
}));

const EXPERIENCE_FALLBACK: Experience[] = experience.map(e => ({
  id: e.id,
  role: e.role,
  company: e.company,
  location: e.location,
  duration: e.duration,
  description: e.description,
  order: parseInt(e.id)
}));

const SKILLS_FALLBACK: Skill[] = Object.entries(skills).flatMap(([category, skillList], index) => 
  skillList.map((skill, skillIndex) => ({
    id: `${category}-${skillIndex}`,
    name: skill,
    category,
    order: index * 100 + skillIndex
  }))
);

const CERTIFICATIONS_FALLBACK: Certification[] = certifications.map(c => ({
  id: c.id,
  name: c.name,
  issuer: c.issuer,
  year: c.year,
  credentialUrl: undefined
}));

const ACHIEVEMENTS_FALLBACK: Achievement[] = achievements;

const CONTACT_FALLBACK: ContactInfo = {
  email: siteConfig.email,
  phone: siteConfig.phone,
  linkedin: siteConfig.linkedin,
  github: siteConfig.github,
  codolio: siteConfig.codolio,
  location: siteConfig.location
};

// ─────────────────────────────────────────────
//  SPECIFIC PORTFOLIO HOOKS
// ─────────────────────────────────────────────

export function useHeroData(): FirestoreState<HeroData> {
  return useDocument<HeroData>('hero', 'main', HERO_FALLBACK);
}

export function useProjects(): FirestoreState<Project[]> {
  return useCollection<Project>('projects', PROJECTS_FALLBACK, 'order');
}

export function useExperience(): FirestoreState<Experience[]> {
  return useCollection<Experience>('experience', EXPERIENCE_FALLBACK, 'order');
}

export function useSkills(): FirestoreState<Skill[]> {
  const [state, setState] = useState<FirestoreState<Skill[]>>({
    data: null,
    loading: true,
    error: false
  });

  useEffect(() => {
    setState({ data: null, loading: true, error: false });

    const collectionRef = collection(db, 'skills');
    const q = query(collectionRef, orderBy('order'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];

        if (data.length === 0) {
          setState({ data: SKILLS_FALLBACK, loading: false, error: false });
        } else {
          setState({ data, loading: false, error: false });
        }
      },
      (error) => {
        console.warn('Firestore error, using fallback:', error);
        setState({ data: SKILLS_FALLBACK, loading: false, error: false });
      }
    );

    return unsubscribe;
  }, []);

  return state;
}

export function useCertifications(): FirestoreState<Certification[]> {
  return useCollection<Certification>('certifications', CERTIFICATIONS_FALLBACK);
}

export function useAchievements(): FirestoreState<Achievement[]> {
  return useCollection<Achievement>('achievements', ACHIEVEMENTS_FALLBACK);
}

export function useContactInfo(): FirestoreState<ContactInfo> {
  return useDocument<ContactInfo>('contact', 'main', CONTACT_FALLBACK);
}
