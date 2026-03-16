"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface RadialItem {
  id: number;
  icon: LucideIcon;
  label: string;
  href: string;
}

interface RadialNavProps {
  items: RadialItem[];
  defaultActiveId?: number;
}

export function RadialNav({ items, defaultActiveId }: RadialNavProps) {
  const [open, setOpen]     = useState(false);
  const [active, setActive] = useState(defaultActiveId ?? items[0]?.id);

  const handleClick = (item: RadialItem) => {
    setActive(item.id);
    setOpen(false);
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
  };

  // Spread items in a semicircle upward
  const total  = items.length;
  const spread = 160; // total arc degrees
  const start  = -90 - spread / 2;
  const radius = 90;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 200,
      }}
    >
      {/* Items */}
      <AnimatePresence>
        {open &&
          items.map((item, i) => {
            const angle = start + (spread / (total - 1)) * i;
            const rad   = (angle * Math.PI) / 180;
            const x     = Math.cos(rad) * radius;
            const y     = Math.sin(rad) * radius;
            const Icon  = item.icon;
            const isActive = active === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: 1, x, y, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.04 }}
                onClick={() => handleClick(item)}
                title={item.label}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: isActive
                    ? "linear-gradient(135deg, var(--primary), var(--cta))"
                    : "rgba(13,13,26,0.9)",
                  border: isActive
                    ? "none"
                    : "1px solid rgba(10,196,224,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  backdropFilter: "blur(12px)",
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "background 0.2s, border 0.2s",
                }}
              >
                <Icon
                  size={16}
                  color={isActive ? "#F6E7BC" : "var(--secondary)"}
                />
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 7,
                    color: isActive ? "#F6E7BC" : "var(--muted)",
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg, var(--primary), var(--cta))"
            : "rgba(13,13,26,0.9)",
          border: "1px solid rgba(10,196,224,0.3)",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Menu icon — 3 lines morphing to X */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <motion.line
              x1="3" y1="6" x2="17" y2="6"
              stroke="var(--body)" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y1: open ? 10 : 6, y2: open ? 10 : 6 }}
            />
            <motion.line
              x1="3" y1="10" x2="17" y2="10"
              stroke="var(--body)" strokeWidth="1.5" strokeLinecap="round"
              animate={{ opacity: open ? 0 : 1 }}
            />
            <motion.line
              x1="3" y1="14" x2="17" y2="14"
              stroke="var(--body)" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y1: open ? 10 : 14, y2: open ? 10 : 14 }}
            />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
}