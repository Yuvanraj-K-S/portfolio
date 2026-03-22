"use client";

import { achievements } from "@/lib/data";
import { useStaggerReveal } from "@/lib/useReveal";

export default function Achievements() {
  const sectionRef = useStaggerReveal(".ach-item", 0.1);

  return (
    <section
      id="achievements"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "var(--section-pad) clamp(24px, 8vw, 120px)" }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 64,
      }}>
        <span style={{
          fontFamily: "var(--font-ui)", fontSize: 10,
          letterSpacing: "0.2em", color: "var(--text-muted)",
        }}>
          06 — ACHIEVEMENTS
        </span>
        <div className="rule" style={{ flex: 1, background: "var(--border)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {achievements.map((a, i) => (
          <div
            key={a.id}
            className="ach-item reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 80px",
              gap: "clamp(16px, 3vw, 40px)",
              alignItems: "center",
              padding: "clamp(20px, 3vw, 28px) 0",
              borderBottom: i < achievements.length - 1 ? "1px solid var(--border)" : "none",
              transition: "opacity 0.3s",
            }}
          >
            <span style={{
              fontFamily: "var(--font-ui)",
              fontSize: 10, letterSpacing: "0.12em",
              color: "var(--text-muted)",
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px, 1.6vw, 18px)",
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}>
                {a.title}
              </div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(12px, 1.2vw, 14px)",
                fontWeight: 300,
                lineHeight: 1.55,
                color: "var(--text-secondary)",
              }}>
                {a.description}
              </div>
            </div>

            <span style={{
              fontFamily: "var(--font-ui)",
              fontSize: 10, letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textAlign: "right",
            }}>
              {a.date}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
