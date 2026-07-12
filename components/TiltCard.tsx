"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MouseEvent, ReactNode } from "react";

export default function TiltCard({
  children,
  className,
  style,
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const glowBackground = useTransform([glowX, glowY], (latest) => {
    const [gx, gy] = latest as number[];
    return `radial-gradient(circle at ${gx}% ${gy}%, rgba(217,164,65,0.14), transparent 60%)`;
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 900, ...style }}
      className={className}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d", position: "relative" }}>
        {children}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: glowBackground,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
