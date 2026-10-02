"use client";

import { useEffect, useState, type Ref } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = { visible: boolean; onOpen: () => void; onIntent: () => void; ref?: Ref<HTMLButtonElement> };

export function Launcher({ visible, onOpen, onIntent, ref }: Props) {
  const [bubble, setBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setBubble(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  // Once the chat has been opened the speech bubble never comes back.
  if (!visible && !dismissed) setDismissed(true);
  const showBubble = bubble && !dismissed && visible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="launcher"
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <AnimatePresence>
            {showBubble && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformOrigin: "bottom right" }}
                className="card relative max-w-[220px] px-4 py-2.5 text-sm"
              >
                Hi! Looking for a treatment? ✨
                <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className="absolute -left-2 -top-2 grid h-5 w-5 place-items-center rounded-full border border-[var(--hairline)] bg-white text-[10px] leading-none text-espresso/70">
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            ref={ref}
            type="button"
            aria-label="Open chat with Sofia"
            onClick={onOpen}
            onMouseEnter={onIntent}
            onFocus={onIntent}
            onTouchStart={onIntent}
            className="breathe font-display relative grid h-16 w-16 place-items-center rounded-full bg-gold text-3xl font-semibold text-accent-ink shadow-[0_10px_30px_-8px_rgba(43,33,28,0.45)] transition-transform hover:scale-105 active:scale-95"
          >
            S
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
