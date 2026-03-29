# Portfolio – Next.js App (Yuvanraj K S)

## Overview
A personal portfolio site built with Next.js 16, React 19, Framer Motion, GSAP, and Tailwind CSS v4.
Full Stack + ML Engineer portfolio with advanced animations and a secret admin panel.

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Animation**: Framer Motion + GSAP + pure CSS keyframes
- **Smooth scroll**: Lenis
- **Email**: EmailJS (@emailjs/browser)
- **Data**: React Context + localStorage persistence (DataContext)
- **Backend/data**: Firebase (legacy hooks, still active as fallback)

## Key Features
1. **Meteor shower hero** — 35 CSS-animated meteors behind the hero section
2. **Flicker name animation** — character-by-character neon flicker on hero name
3. **Jello punchline** — elastic spring entrance on each character of the tagline
4. **3D Book project cards** — CSS 3D transforms, cover opens on hover, 3 flippable pages (Brief / Stack / Intention)
5. **Horizontal layer scroller** — drag-to-scroll project carousel with animated entrance
6. **GSAP-style section blur** — Framer Motion scroll-linked blur + y offset on each section
7. **Curved SVG road experience** — winding road with animated path draw + alternating side cards
8. **Color-coded skills grid** — categories with colored pill tags and hover effects
9. **Hover-reveal contact grid** — 6-icon grid that expands on hover showing contact details; email opens a form modal
10. **Admin panel (Ctrl+Shift+E)** — full tabbed editor for every section, auto-saved to localStorage

## Data Flow
- `lib/context/DataContext.tsx` — single source of truth for all portfolio data
  - Initialized from `lib/data.ts` (static)
  - Checks `localStorage` on mount for saved overrides
  - Admin panel writes to context + localStorage
  - All sections use `useData()` hook

## Project Structure
```
app/               Next.js App Router
  page.tsx         Wraps everything in DataProvider + AdminEditor
  globals.css      All CSS animations (meteor-fall, flickerIn, jelloEntrance, layerSlideIn, modalIn, etc.)
components/
  sections/        Hero, About, Experience, Projects, Skills, Contact
  ui/              Nav, Cursor, Loader, SmoothScroll, SectionTransition, AdminEditor
lib/
  context/         DataContext.tsx
  data.ts          Static portfolio content (source of truth)
  hooks/           useFirestore.ts (legacy Firebase hooks, still used as fallback)
  types.ts         TypeScript interfaces
registry/
  magicui/         meteors.tsx (shooting star animation component)
```

## Running the App
```
npm run dev       # Dev server on port 5000 (bound to 0.0.0.0)
npm run build     # Production build
```

## Environment Variables Needed
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- Firebase env vars (optional — hooks have static fallback)

## Admin Panel
Press **Ctrl+Shift+E** anywhere on the page to open the admin editor.
Changes auto-save to localStorage and persist across sessions.
The RESET button restores all content to the defaults in `lib/data.ts`.
