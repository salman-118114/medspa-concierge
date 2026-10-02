"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { generateSlots } from "@/lib/slots";
import { t, type Lang } from "@/lib/i18n";

type Props = { ids: string[]; lang: Lang; onPick: (label: string) => void; disabled: boolean; delay: number };

export function SlotPicker({ ids, lang, onPick, disabled, delay }: Props) {
  const all = useMemo(() => generateSlots(new Date(), lang), [lang]);
  // Show only the slots the AI chose, when any valid ids were given; otherwise all of them.
  const slots = useMemo(() => {
    const chosen = all.filter((s) => ids.includes(s.id));
    return chosen.length ? chosen : all;
  }, [all, ids]);
  const days = useMemo(() => [...new Map(slots.map((s) => [s.day, s.dayLabel])).entries()], [slots]);

  const [day, setDay] = useState(days[0]?.[0] ?? 0);
  const [selected, setSelected] = useState<string | null>(null);
  const s = t(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay } }}
      className="card p-4"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gold-text">{s.pickTime}</p>
      <div role="tablist" className="no-scrollbar -mx-1 mb-3 flex gap-1 overflow-x-auto px-1">
        {days.map(([d, label]) => (
          <button
            key={d}
            role="tab"
            type="button"
            aria-selected={day === d}
            onClick={() => setDay(d)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
              day === d ? "bg-espresso text-cream" : "text-espresso/70 hover:bg-espresso/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="tabpanel">
        {slots
          .filter((x) => x.day === day)
          .map((slot) => {
            const on = selected === slot.id;
            return (
              <motion.button
                key={slot.id}
                type="button"
                data-slot-pill
                disabled={disabled}
                aria-pressed={on}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setSelected(slot.id);
                  onPick(slot.label);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-default ${
                  on ? "border-gold bg-gold text-accent-ink" : "border-[var(--hairline)] bg-white hover:border-gold disabled:opacity-60"
                }`}
              >
                {slot.time}
              </motion.button>
            );
          })}
      </div>
    </motion.div>
  );
}
