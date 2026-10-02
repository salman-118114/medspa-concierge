"use client";

import { motion } from "motion/react";

type Props = { chips: string[]; onPick: (chip: string) => void; delay: number };

export function Chips({ chips, onPick, delay }: Props) {
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="flex flex-wrap justify-end gap-2 pt-1"
      role="group"
      aria-label="Quick replies"
    >
      {chips.map((chip, i) => (
        <motion.button
          key={chip}
          type="button"
          data-chip
          onClick={() => onPick(chip)}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0, transition: { delay: delay + i * 0.08, type: "spring", stiffness: 300, damping: 24 } }}
          whileTap={{ scaleX: 0.94, scaleY: 0.9 }}
          className="rounded-full border border-gold bg-white px-3.5 py-1.5 text-sm text-espresso transition-colors hover:bg-gold hover:text-accent-ink"
        >
          {chip}
        </motion.button>
      ))}
    </motion.div>
  );
}
