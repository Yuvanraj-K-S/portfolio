"use client";

import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/ui/Nav";
import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Cursor />
      <Nav />
      <Loader />

      <section id="hero"><Hero /></section>
      
      <section id="about"><About /></section>
      
      <section id="projects"><Projects /></section>
      
      <section id="skills"><Skills /></section>
      
      <section id="experience"><Experience /></section>
      
      <section id="certifications"><Certifications /></section>
      
      <section id="achievements"><Achievements /></section>
      
      <section id="contact"><Contact /></section>
    </main>
  );
}