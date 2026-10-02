"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { motion } from "motion/react";
import { t, type Lang } from "@/lib/i18n";

type Props = { value: string; onChange: (v: string) => void; onSubmit: () => void; busy: boolean; lang: Lang };

export function Composer({ value, onChange, onSubmit, busy, lang }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const s = t(lang);

  // Return focus to the input after each reply on desktop (not on touch, to keep the keyboard closed).
  useEffect(() => {
    if (!busy && window.matchMedia("(min-width: 640px)").matches) ref.current?.focus({ preventScroll: true });
  }, [busy]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit();
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-[var(--hairline)] bg-white/70 px-3 py-3">
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={busy}
        maxLength={600}
        placeholder={s.placeholder}
        aria-label={s.placeholder}
        autoComplete="off"
        className="min-w-0 flex-1 rounded-full border border-[var(--hairline)] bg-cream px-4 py-2.5 text-[15px] focus-visible:!outline-none placeholder:text-espresso/55 focus:border-espresso disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={busy || !value.trim()}
        aria-label={s.send}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-accent-ink transition-opacity disabled:opacity-50"
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: busy ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </motion.svg>
      </button>
    </form>
  );
}
