"use client";

import { DataProvider } from '../lib/context/DataContext';
import SmoothScroll from '../components/ui/SmoothScroll';
import Cursor from '../components/ui/Cursor';
import Loader from '../components/ui/Loader';
import Nav from '../components/ui/Nav';
import SectionTransition from '../components/ui/SectionTransition';
import AdminEditor from '../components/ui/AdminEditor';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <DataProvider>
      <SmoothScroll>
        <Cursor />
        <Loader />
        <Nav />
        <AdminEditor />

        <main style={{ background: 'var(--bg)' }}>
          <Hero />

          <SectionTransition id="about">
            <About />
          </SectionTransition>

          <SectionTransition id="experience">
            <Experience />
          </SectionTransition>

          <SectionTransition id="projects">
            <Projects />
          </SectionTransition>

          <SectionTransition id="skills">
            <Skills />
          </SectionTransition>

          <SectionTransition id="contact">
            <Contact />
          </SectionTransition>
        </main>
      </SmoothScroll>
    </DataProvider>
  );
}
