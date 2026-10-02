"use client";

import { motion } from "motion/react";
import { t, type Lang } from "@/lib/i18n";

type Props = { lang: Lang; onAccept: () => void; disabled: boolean; delay: number };

export function OfferCard({ lang, onAccept, disabled, delay }: Props) {
  const s = t(lang);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay } }}
      className="shine rounded-[20px] border border-[var(--hairline)] bg-gradient-to-br from-blush/70 to-[#f7e6df] p-5 shadow-[var(--shadow-soft)]"
    >
      <p className="font-display text-2xl font-medium leading-tight">{s.offerTitle}</p>
      <p className="mt-1 text-sm text-espresso/75">{s.offerBody}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={onAccept}
        className="mt-3 rounded-full bg-espresso px-4 py-2 text-sm font-medium text-cream transition-transform active:scale-95 disabled:opacity-50"
      >
        {s.offerCta}
      </button>
    </motion.div>
  );
}
