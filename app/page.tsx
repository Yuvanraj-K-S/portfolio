"use client";

import SmoothScroll from '../components/ui/SmoothScroll';
import Cursor from '../components/ui/Cursor';
import Loader from '../components/ui/Loader';
import Nav from '../components/ui/Nav';
import SectionTransition from '../components/ui/SectionTransition';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <Loader />
      <Nav />
      
      <main style={{ background: 'var(--bg)' }}>
        {/* Hero - no SectionTransition wrapper */}
        <Hero />
        
        {/* About */}
        <SectionTransition id="about">
          <About />
        </SectionTransition>
        
        {/* Experience */}
        <SectionTransition id="experience">
          <Experience />
        </SectionTransition>
        
        {/* Projects */}
        <SectionTransition id="projects">
          <Projects />
        </SectionTransition>
        
        {/* Skills */}
        <SectionTransition id="skills">
          <Skills />
        </SectionTransition>
        
        {/* Contact */}
        <SectionTransition id="contact">
          <Contact />
        </SectionTransition>
      </main>
    </SmoothScroll>
  );
}
