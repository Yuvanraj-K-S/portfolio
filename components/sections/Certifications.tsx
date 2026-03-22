"use client";

import { certifications } from "@/lib/data";
import { useStaggerReveal } from "@/lib/useReveal";

export default function Certifications() {
  const sectionRef = useStaggerReveal(".cert-item", 0.1);

  return (
    <section
      id="certifications"
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
          05 — CERTIFICATIONS
        </span>
        <div className="rule" style={{ flex: 1, background: "var(--border)" }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1px",
        background: "var(--border)",
        border: "1px solid var(--border)",
      }}>
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="cert-item reveal"
            style={{
              background: "var(--bg)",
              padding: "clamp(24px, 3vw, 36px)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}
          >
            <div style={{
              fontFamily: "var(--font-ui)",
              fontSize: 9, letterSpacing: "0.18em",
              color: "var(--text-muted)",
              marginBottom: 12,
            }}>
              {cert.issuer.toUpperCase()} — {cert.year}
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.3vw, 15px)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "var(--text-secondary)",
            }}>
              {cert.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
