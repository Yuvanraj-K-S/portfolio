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
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Cursor />
      <Nav />
      <Loader />

      <section id="hero"><Hero /></section>
      <Marquee />
      <section id="about"><About /></section>
      <Marquee />
      <section id="projects"><Projects /></section>
      <Marquee />
      <section id="skills"><Skills /></section>
      <Marquee />
      <section id="experience"><Experience /></section>
      <Marquee />
      <section id="certifications"><Certifications /></section>
      <Marquee />
      <section id="achievements"><Achievements /></section>
      <Marquee />
      <section id="contact"><Contact /></section>
    </main>
  );
}