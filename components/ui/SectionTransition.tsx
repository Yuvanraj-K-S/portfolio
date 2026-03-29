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
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0.3]
  );

  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [14, 0, 0, 10]
  );

  const yValue = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [40, 0, 0, -20]
  );

  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <motion.div
      ref={containerRef}
      id={id}
      style={{
        willChange: 'transform, opacity, filter',
        opacity,
        filter,
        y: yValue,
      }}
    >
      {children}
    </motion.div>
  );
}
