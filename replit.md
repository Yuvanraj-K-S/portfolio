# Portfolio – Next.js App

## Overview
A personal portfolio site built with Next.js 16, React 19, Three.js, Framer Motion, GSAP, and Tailwind CSS v4. Migrated from Vercel to Replit.

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 via PostCSS
- **3D**: Three.js via @react-three/fiber and @react-three/drei
- **Animation**: Framer Motion + GSAP
- **Smooth scroll**: Lenis
- **Email**: EmailJS
- **Backend/data**: Firebase
- **Icons**: Lucide React

## Project Structure
- `app/` – Next.js App Router pages and layouts
- `components/` – Reusable React components
- `lib/` – Utility functions
- `public/` – Static assets

## Running the App
The dev server runs on port 5000 bound to 0.0.0.0 (required for Replit):
```
npm run dev
```

## Scripts
- `npm run dev` – Start dev server on port 5000
- `npm run build` – Build for production
- `npm run start` – Start production server on port 5000
- `npm run lint` – Run ESLint

## Replit Configuration
- Workflow: "Start application" → `npm run dev`
- Port: 5000 (webview)
- Package manager: npm
