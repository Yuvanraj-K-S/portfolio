"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/context/DataContext";
import { useReveal, useStaggerReveal } from "@/lib/useReveal";

function useCountUp(target: number, duration = 1800, active = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);

  return value;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1600, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="stagger-item reveal" style={{ textAlign: "left" }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(40px, 6vw, 72px)",
        fontVariationSettings: "'MORF' 15, 'SHLN' 50",
        color: "var(--text-primary)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: "var(--font-ui)",
        fontSize: 10,
        letterSpacing: "0.16em",
        color: "var(--text-muted)",
        marginTop: 8,
      }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

export default function About() {
  const { data } = useData();
  const sectionRef = useReveal(0.1) as React.RefObject<HTMLElement>;
  const statsRef   = useStaggerReveal(".stagger-item", 0.2) as React.RefObject<HTMLElement>;

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="reveal"
      style={{ padding: "var(--section-pad) clamp(24px, 8vw, 120px)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-muted)" }}>
          01 — ABOUT
        </span>
        <div className="rule" style={{ flex: 1, background: "var(--border)" }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px, 8vw, 120px)",
        alignItems: "start",
      }}>
        {/* Left — bio */}
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 60px)",
            fontVariationSettings: "'MORF' 15, 'SHLN' 50",
            color: "var(--text-primary)",
            lineHeight: 1.05,
            marginBottom: 32,
          }}>
            Building things<br />that work.
          </h2>

          {data.bio.map((p, i) => (
            <p key={i} style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 1.4vw, 16px)",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "var(--text-secondary)",
              marginBottom: i < data.bio.length - 1 ? 20 : 0,
            }}>
              {p}
            </p>
          ))}

          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "GitHub",   href: data.hero.github },
              { label: "LinkedIn", href: data.hero.linkedin },
              { label: "Codolio", href: data.hero.codolio },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 10, letterSpacing: "0.16em",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 2,
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {link.label.toUpperCase()} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Right — stats */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 4vw, 56px)",
          }}
        >
          {data.stats.map((s) => (
            <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}

          <div style={{ gridColumn: "1 / -1", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 10,
              letterSpacing: "0.14em", color: "var(--text-muted)",
            }}>
              {data.hero.location.toUpperCase()} — AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
