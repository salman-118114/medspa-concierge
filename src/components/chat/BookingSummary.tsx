"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { generateSlots } from "@/lib/slots";
import { t, type Lang } from "@/lib/i18n";
import type { Lead } from "@/lib/schema";
import { useSite } from "@/components/SiteProvider";

type Props = { lead: Lead; slotIds: string[]; lang: Lang; animate: boolean; delay: number };

const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const r = 70 + (i % 3) * 18;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, size: 5 + (i % 3) * 2 };
});

export function BookingSummary({ lead, slotIds, lang, animate, delay }: Props) {
  const reduce = useReducedMotion();
  const { brand } = useSite();
  const s = t(lang);
  const slot = useMemo(() => generateSlots(new Date(), lang).find((x) => slotIds.includes(x.id)), [lang, slotIds]);
  const when = slot?.label || lead.preferred_slot || "—";

  const rows: [string, string][] = [
    [s.name, lead.name || "—"],
    [s.phone, lead.phone || "—"],
    [s.treatment, lead.interest || s.consultation],
    [s.when, when],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay, type: "spring", stiffness: 260, damping: 24 } }}
      className="card relative p-5"
    >
      {animate && !reduce && (
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-6 h-0 w-0">
          {SPARKS.map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, scale: [0, 1.2, 0], opacity: [1, 1, 0], rotate: 90 }}
              transition={{ delay: delay + 0.1, duration: 0.6, ease: "easeOut" }}
              className="absolute block bg-gold"
              style={{ width: p.size, height: p.size, clipPath: "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)" }}
            />
          ))}
        </div>
      )}
      <p className="font-display text-center text-2xl italic">{brand}</p>
      <p className="mt-0.5 text-center text-xs uppercase tracking-[0.18em] text-gold-text">{s.receipt}</p>
      <div className="my-4 border-t border-dashed border-espresso/20" />
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-espresso/60">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="my-4 border-t border-dashed border-espresso/20" />
      <p className="text-center text-xs font-medium text-gold-text">{s.requested}</p>
    </motion.div>
  );
}
