"use client";

import { motion } from "motion/react";

export function TypingDots({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-label={label}
      className="flex w-fit items-center gap-1.5 rounded-[18px] rounded-bl-md border border-[var(--hairline)] bg-white px-4 py-3.5"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot-wave block h-2 w-2 rounded-full bg-gold" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </motion.div>
  );
}
