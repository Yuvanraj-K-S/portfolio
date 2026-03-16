"use client";

import { useEffect, useRef, useState } from "react";

export default function Loader() {
  const [progress, setProgress]   = useState(0);
  const [done, setDone]           = useState(false);
  const [visible, setVisible]     = useState(true);
  const walkPhase                 = useRef(0);
  const rafRef                    = useRef<number>(0);
  const legLRef                   = useRef<SVGLineElement>(null);
  const legRRef                   = useRef<SVGLineElement>(null);
  const footLRef                  = useRef<SVGEllipseElement>(null);
  const footRRef                  = useRef<SVGEllipseElement>(null);
  const armLRef                   = useRef<SVGLineElement>(null);
  const armRRef                   = useRef<SVGLineElement>(null);

  const finish = () => {
    if (done) return;
    setDone(true);
    setProgress(100);
    setTimeout(() => setVisible(false), 700);
  };

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 4 + 1;
      });
    }, 80);

    // Min 1.5s
    const timeout = setTimeout(finish, 1500 + Math.random() * 800);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // Walker animation
  useEffect(() => {
    const animate = () => {
      if (done) return;
      walkPhase.current += 0.12;
      const sw = Math.sin(walkPhase.current);

      if (legLRef.current)  legLRef.current.setAttribute("x2",  String(26 + sw * 12));
      if (legRRef.current)  legRRef.current.setAttribute("x2",  String(54 - sw * 12));
      if (footLRef.current) footLRef.current.setAttribute("cx", String(23 + sw * 12));
      if (footRRef.current) footRRef.current.setAttribute("cx", String(57 - sw * 12));
      if (armLRef.current)  armLRef.current.setAttribute("x2",  String(14 - sw * 8));
      if (armRRef.current)  armRRef.current.setAttribute("x2",  String(66 + sw * 8));

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done]);

  // Skip on click or keydown
  useEffect(() => {
    const skip = () => finish();
    document.addEventListener("keydown", skip);
    document.addEventListener("click",   skip);
    return () => {
      document.removeEventListener("keydown", skip);
      document.removeEventListener("click",   skip);
    };
  }, [done]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9990,
        opacity: done ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Walker */}
      <div style={{ marginBottom: 32 }}>
        <svg
          viewBox="0 0 80 100"
          width={80}
          height={100}
          fill="none"
          style={{ animation: "bob 0.4s ease-in-out infinite alternate" }}
        >
          {/* Body */}
          <ellipse cx="40" cy="38" rx="16" ry="18" fill="#7045AF" />
          {/* Head */}
          <circle cx="40" cy="16" r="12" fill="#0AC4E0" />
          {/* Eyes */}
          <circle cx="36" cy="14" r="2.5" fill="#080810" />
          <circle cx="44" cy="14" r="2.5" fill="#080810" />
          {/* Glints */}
          <circle cx="37" cy="13" r="1" fill="#F6E7BC" />
          <circle cx="45" cy="13" r="1" fill="#F6E7BC" />
          {/* Mouth */}
          <path
            d="M35 20 Q40 24 45 20"
            stroke="#080810"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Arms */}
          <line ref={armLRef} x1="25" y1="38" x2="14" y2="52"
            stroke="#E14594" strokeWidth="4" strokeLinecap="round" />
          <line ref={armRRef} x1="55" y1="38" x2="66" y2="52"
            stroke="#E14594" strokeWidth="4" strokeLinecap="round" />
          {/* Legs */}
          <line ref={legLRef} x1="34" y1="56" x2="26" y2="76"
            stroke="#7045AF" strokeWidth="5" strokeLinecap="round" />
          <ellipse ref={footLRef} cx="23" cy="79" rx="8" ry="4" fill="#7045AF" />
          <line ref={legRRef} x1="46" y1="56" x2="54" y2="76"
            stroke="#7045AF" strokeWidth="5" strokeLinecap="round" />
          <ellipse ref={footRRef} cx="57" cy="79" rx="8" ry="4" fill="#7045AF" />
        </svg>

        {/* Ground shadow */}
        <div
          style={{
            width: 60,
            height: 8,
            margin: "4px auto 0",
            background:
              "radial-gradient(ellipse, rgba(112,69,175,0.4) 0%, transparent 70%)",
            animation: "bob 0.4s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 220,
          height: 2,
          background: "rgba(246,231,188,0.1)",
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(progress, 100)}%`,
            background: "var(--secondary)",
            borderRadius: 2,
            boxShadow: "0 0 6px var(--secondary)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Loading text */}
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          color: "var(--muted)",
          letterSpacing: "0.1em",
        }}
      >
        Loading...
      </p>

      {/* Skip hint */}
      <p
        style={{
          position: "absolute",
          bottom: 32,
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: "0.08em",
        }}
      >
        Press any key or click to skip
      </p>
    </div>
  );
}