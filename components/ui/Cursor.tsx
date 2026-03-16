"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    };
    document.addEventListener("mousemove", onMove);

    // Lerp ring
    let raf: number;
    const lerpRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      raf = requestAnimationFrame(lerpRing);
    };
    lerpRing();

    // Hover effect
    const addHover = () => ring.classList.add("cursor-hover");
    const remHover = () => ring.classList.remove("cursor-hover");

    const interactives = document.querySelectorAll(
      "a, button, [data-cursor]"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", remHover);
    });

    // Sparks
    const palette = ["#7045AF", "#0AC4E0", "#E14594", "#F6E7BC"];
    let sparks: {
      x: number; y: number;
      vx: number; vy: number;
      life: number; color: string;
    }[] = [];

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 / 10) * i + (Math.random() - 0.5) * 0.4;
        const speed = 2 + Math.random() * 4;
        sparks.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };
    document.addEventListener("click", onClick);

    const drawSparks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks = sparks.filter((s) => s.life > 0);
      sparks.forEach((s) => {
        s.x  += s.vx;
        s.y  += s.vy;
        s.vy += 0.15;
        s.life -= 0.04;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3 * s.life, 0, Math.PI * 2);
        const alpha = Math.floor(s.life * 255).toString(16).padStart(2, "0");
        ctx.fillStyle = s.color + alpha;
        ctx.fill();
      });
      requestAnimationFrame(drawSparks);
    };
    drawSparks();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", remHover);
      });
    };
  }, []);

  return (
    <>
      {/* Spark canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9997,
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 10, height: 10,
          borderRadius: "50%",
          background: "var(--secondary)",
          boxShadow: "0 0 8px var(--secondary)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "background 0.2s",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 28, height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(10,196,224,0.5)",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "width 0.25s, height 0.25s, border-color 0.25s",
        }}
      />

      <style>{`
        .cursor-ring.cursor-hover {
          width: 48px !important;
          height: 48px !important;
          border-color: var(--cta) !important;
        }
      `}</style>
    </>
  );
}