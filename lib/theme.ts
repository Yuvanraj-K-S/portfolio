// ─────────────────────────────────────────────
//  THEME TOKENS  —  change here, site updates everywhere
//  Supports: solid colors, CSS gradients, or "transparent"
// ─────────────────────────────────────────────

export const theme = {
  // ── Backgrounds ──────────────────────────────
  bg:          "#0A0A0A",          // page background
  surface:     "#111111",          // card / panel surfaces
  surfaceHigh: "#1A1A1A",          // elevated surface (hover states, modals)
  border:      "rgba(255,255,255,0.08)",

  // ── Text ─────────────────────────────────────
  textPrimary:   "#F0F0F0",        // headings
  textSecondary: "rgba(240,240,240,0.55)",  // body / muted
  textMuted:     "rgba(240,240,240,0.28)",  // timestamps, labels

  // ── Accent ───────────────────────────────────
  // To switch to a gradient: "linear-gradient(135deg, #7045AF, #E14594)"
  accent:        "#F0F0F0",        // primary accent (currently white)
  accentAlt:     "#666666",        // secondary accent

  // ── Hero Polygon ─────────────────────────────
  polygonColor: "#F0F0F0",         // breathing polygon stroke color

  // ── Hero WebGL grain ─────────────────────────
  grainOpacity:  "0.035",          // 0 = off, 0.05 = visible

  // ── Typography ───────────────────────────────
  fontDisplay: "'Honk', cursive",
  fontUI:      "'Monofett', monospace",
  fontBody:    "'DM Sans', sans-serif",

  // ── Motion ───────────────────────────────────
  ease:     "cubic-bezier(0.16, 1, 0.3, 1)",
  duration: "0.7s",

  // ── Spacing scale ────────────────────────────
  sectionPad: "clamp(80px, 12vw, 160px)",
};

// CSS custom properties generated from tokens
// injected into :root by globals.css @layer base
export const cssVars = `
  --bg:           ${theme.bg};
  --surface:      ${theme.surface};
  --surface-high: ${theme.surfaceHigh};
  --border:       ${theme.border};

  --text-primary:   ${theme.textPrimary};
  --text-secondary: ${theme.textSecondary};
  --text-muted:     ${theme.textMuted};

  --accent:     ${theme.accent};
  --accent-alt: ${theme.accentAlt};

  --polygon-color: ${theme.polygonColor};

  --grain-opacity: ${theme.grainOpacity};

  --font-display: ${theme.fontDisplay};
  --font-ui:      ${theme.fontUI};
  --font-body:    ${theme.fontBody};

  --ease:     ${theme.ease};
  --duration: ${theme.duration};

  --section-pad: ${theme.sectionPad};
`;
