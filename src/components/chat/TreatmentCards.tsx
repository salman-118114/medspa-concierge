"use client";

import { motion } from "motion/react";
import { findTreatment, priceLabel, type Treatment } from "@/lib/spa";
import { t, type Lang } from "@/lib/i18n";

type Props = { ids: string[]; lang: Lang; onBook: (name: string) => void; disabled: boolean; delay: number };

export function TreatmentCards({ ids, lang, onBook, disabled, delay }: Props) {
  // Unknown ids are dropped silently: the UI never shows anything the AI invented.
  const items = ids.map(findTreatment).filter((x): x is Treatment => !!x);
  if (!items.length) return null;
  const s = t(lang);

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 no-scrollbar snap-x snap-mandatory" tabIndex={0} aria-label="Treatments">
      <div className="flex gap-3">
        {items.map((tr, i) => {
          const name = lang === "es" ? tr.es.name : tr.name;
          return (
            <motion.article
              key={tr.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { delay: delay + i * 0.1 } }}
              className="card w-[220px] shrink-0 snap-start p-4"
            >
              <h3 className="font-display text-xl font-medium leading-tight">{name}</h3>
              <p className="mt-2 text-sm font-medium text-gold-text">{priceLabel(tr, lang)}</p>
              <p className="mt-1 text-xs text-espresso/70">
                {s.downtime}: {lang === "es" ? tr.es.downtime : tr.downtime}
              </p>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onBook(name)}
                className="mt-3 w-full rounded-full bg-gold px-4 py-2 text-sm font-medium text-accent-ink transition-transform active:scale-95 disabled:opacity-50"
              >
                {s.bookThis}
              </button>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
