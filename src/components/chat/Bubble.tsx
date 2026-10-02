"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Typewriter duration: scales with length but never exceeds 1.2s. */
export const typeDuration = (len: number) => Math.min(1200, Math.max(250, len * 22));

export function Bubble({ role, text, animate }: { role: "user" | "assistant"; text: string; animate: boolean }) {
  const reduce = useReducedMotion();
  const typewriter = role === "assistant" && animate && !reduce;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!typewriter) return;
    const duration = typeDuration(text.length);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setShown(Math.ceil(p * text.length));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [typewriter, text]);

  const visible = typewriter ? text.slice(0, shown) : text;
  const isUser = role === "user";

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 8, filter: "blur(4px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-[18px] rounded-br-md bg-espresso text-cream"
            : "rounded-[18px] rounded-bl-md border border-[var(--hairline)] bg-white text-espresso shadow-[0_1px_2px_rgba(43,33,28,0.04)]"
        }`}
      >
        <span aria-hidden={typewriter || undefined}>{visible}</span>
        {typewriter && <span className="sr-only">{text}</span>}
      </div>
    </motion.div>
  );
}
