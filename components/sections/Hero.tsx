"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { siteConfig } from "@/lib/data";

/* ─────────────────────────────────────────────
   Dino 3D billboard
   Uses THREE.TextureLoader directly — avoids
   useTexture/drei issues with Turbopack
───────────────────────────────────────────── */
function Dino3D() {
  const meshRef   = useRef<THREE.Mesh>(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const [hovered, setHovered]   = useState(false);
  const [texture,  setTexture]  = useState<THREE.Texture | null>(null);

  // Load texture manually — no useTexture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "../../public/dino.png",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.error("Dino texture failed:", err)
    );
  }, []);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  e.clientX / window.innerWidth  - 0.5;
      mouse.current.y =  e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;

    // Smooth cursor tilt
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y,  mouse.current.x * 0.45, 0.05);
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -mouse.current.y * 0.28, 0.05);

    // Idle float
    m.position.y = Math.sin(Date.now() * 0.0018) * 0.12;

    // Hover wave
    if (hovered) {
      m.rotation.z = Math.sin(Date.now() * 0.009) * 0.12;
    } else {
      m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, 0, 0.08);
    }
  });

  // Don't render mesh until texture is ready
  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={()  => setHovered(false)}
    >
      <planeGeometry args={[3.2, 3.2]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function DinoCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 5]} intensity={0.8} />
      <Suspense fallback={null}>
        <Dino3D />
      </Suspense>
    </Canvas>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Name parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!nameRef.current) return;
      const dx = (e.clientX / window.innerWidth  - 0.5) * 14;
      const dy = (e.clientY / window.innerHeight - 0.5) *  7;
      nameRef.current.style.transform =
        `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(176,42,58,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── LAYOUT: text left, dino right ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 1200,
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 32,
      }}>

        {/* LEFT: text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}
        >
          {/* Role — DM Sans */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--secondary)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>
            {siteConfig.role}
          </p>

          {/* Name — Honk */}
          <h1
            ref={nameRef}
            className="holo-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 9vw, 120px)",
              lineHeight: 0.92,
              color: "var(--body)",
              userSelect: "none",
              transition: "transform 0.1s ease",
              fontVariationSettings: "'MORF' 15, 'SHLN' 50",
            }}
          >
            {siteConfig.name.split(" ")[0].toUpperCase()}
          </h1>

          {/* Punchline — Monofett */}
          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: "clamp(11px, 1.4vw, 15px)",
            color: "var(--muted)",
            letterSpacing: "0.05em",
            marginTop: 8,
            maxWidth: 420,
            lineHeight: 1.6,
          }}>
            {siteConfig.punchline}
          </p>

          {/* CTAs — Monofett */}
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo("#projects")}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                letterSpacing: "0.1em",
                padding: "13px 34px",
                borderRadius: 100,
                border: "none",
                background: "linear-gradient(135deg, var(--primary), var(--cta))",
                color: "#F5EFFF",
                cursor: "none",
              }}
            >
              VIEW WORK
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo("#contact")}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                letterSpacing: "0.1em",
                padding: "13px 34px",
                borderRadius: 100,
                background: "transparent",
                border: "1.5px solid rgba(59,42,94,0.35)",
                color: "var(--secondary)",
                cursor: "none",
              }}
            >
              CONTACT ME
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT: Dino canvas */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            width: "min(420px, 42vw)",
            height: "min(420px, 42vw)",
            flexShrink: 0,
          }}
        >
          <DinoCanvas />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        zIndex: 2,
      }}>
        <div style={{
          width: 22,
          height: 34,
          border: "1.5px solid rgba(26,26,46,0.2)",
          borderRadius: 12,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            width: 3,
            height: 6,
            background: "var(--primary)",
            borderRadius: 2,
            position: "absolute",
            top: 6,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "scroll-down 2s ease infinite",
          }} />
        </div>
        <span style={{
          fontFamily: "var(--font-ui)",
          fontSize: 10,
          color: "var(--muted)",
          letterSpacing: "0.12em",
        }}>
          SCROLL
        </span>
      </div>
    </section>
  );
}