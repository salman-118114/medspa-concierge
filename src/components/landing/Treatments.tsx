"use client";

import { motion, type Variants } from "motion/react";
import { TREATMENTS, priceLabel } from "@/lib/spa";
import { useChatControl, useSite } from "@/components/SiteProvider";
import { t } from "@/lib/i18n";

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Treatments() {
  const { lang } = useSite();
  const { openChat } = useChatControl();

  return (
    <section id="treatments" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="mb-12 max-w-xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold-text">Treatments</p>
        <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">Considered care, beautifully simple.</h2>
      </div>
      <motion.div variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TREATMENTS.map((tr) => (
          <motion.article key={tr.id} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card group flex flex-col p-6 hover:shadow-[var(--shadow-lift)]">
            <h3 className="font-display text-2xl font-medium leading-tight">{tr.name}</h3>
            <motion.span
              aria-hidden
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, delay: 0.3 } } }}
              className="mt-3 block h-px w-12 origin-left bg-gold"
            />
            <p className="mt-4 text-sm leading-relaxed text-espresso/70">{tr.goodFor}</p>
            <p className="mt-auto pt-6 text-sm font-medium text-gold-text">{priceLabel(tr, "en")}</p>
            <p className="mt-1 text-xs text-espresso/60">
              {tr.session} · {tr.downtime === "None" ? "no downtime" : tr.downtime.toLowerCase()}
            </p>
            <button
              type="button"
              onClick={() => openChat(t(lang).askMsg(lang === "es" ? tr.es.name : tr.name))}
              className="mt-4 self-start text-sm font-medium underline decoration-gold decoration-1 underline-offset-4 transition-all hover:decoration-2"
            >
              {t(lang).askSofia} →
            </button>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
