"use client";

import { DataProvider } from '../lib/context/DataContext';
import SmoothScroll from '../components/ui/SmoothScroll';
import Cursor from '../components/ui/Cursor';
import Loader from '../components/ui/Loader';
import Nav from '../components/ui/Nav';
import SectionTransition from '../components/ui/SectionTransition';
import ScrollProgress from '../components/ui/ScrollProgress';
import Footer from '../components/ui/Footer';
import AdminEditor from '../components/ui/AdminEditor';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';

function SectionDivider() {
  return (
    <div style={{
      margin: '0 clamp(24px, 8vw, 120px)',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)',
    }} />
  );
}

export default function Home() {
  return (
    <DataProvider>
      <SmoothScroll>
        <Cursor />
        <Loader />
        <Nav />
        <ScrollProgress />
        <AdminEditor />

        <main style={{ background: 'var(--bg)' }}>
          <section id="hero" style={{ margin: 0, padding: 0 }}>
            <Hero />
          </section>

          <SectionDivider />

          <SectionTransition id="about">
            <About />
          </SectionTransition>

          <SectionDivider />

          <SectionTransition id="experience">
            <Experience />
          </SectionTransition>

          <SectionDivider />

          <SectionTransition id="projects">
            <Projects />
          </SectionTransition>

          <SectionDivider />

          <SectionTransition id="skills">
            <Skills />
          </SectionTransition>

          <SectionDivider />

          <SectionTransition id="contact">
            <Contact />
          </SectionTransition>
        </main>

        <Footer />
      </SmoothScroll>
    </DataProvider>
  );
}
