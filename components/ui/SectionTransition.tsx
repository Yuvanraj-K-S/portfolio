'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  id?: string;
}

export default function SectionTransition({ children, id }: SectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Entry phase: 0 to 0.15 (bottom entering viewport)
  // Middle: 0.15 to 0.85 (fully visible)
  // Exit phase: 0.85 to 1 (top leaving viewport)
  
  // Flat interpolations - no nested useTransform calls
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [
      // Start: fully clipped at bottom
      "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      // End of entry: fully visible
      "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      // Middle: fully visible
      "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      // Exit: fully visible
      "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
    ]
  );

  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [8, 0, 0, 8]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [1, 1, 1, 0.4]
  );

  // Use useMotionTemplate for filter string
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <motion.div
      ref={containerRef}
      id={id}
      style={{
        willChange: 'transform',
        clipPath,
        filter,
        opacity
      }}
    >
      {children}
    </motion.div>
  );
}
