import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { MouseEvent } from "react";

export function SpotlightBackground({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.06),
    transparent 80%
  )`;

  return (
    <div
      className="group relative w-full overflow-hidden bg-zinc-950"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: background,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
