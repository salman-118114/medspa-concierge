"use client";

import { motion } from "motion/react";

const STEPS = [
  { n: "1", title: "Ask anything", body: "Prices, downtime, what to expect. Sofia answers instantly, day or night, in English or Spanish." },
  { n: "2", title: "Get matched", body: "Two or three quick questions and Sofia suggests the treatments that fit your goals." },
  { n: "3", title: "Book in seconds", body: "Pick a time that suits you. Our team confirms your request by text." },
];

export function HowItWorks() {
  return (
    <section className="bg-white/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold-text">How Sofia helps</p>
          <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">Your concierge, always on.</h2>
        </div>
        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* connecting line: horizontal on desktop, vertical on mobile */}
          <motion.div aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.4, ease: "easeInOut" }} className="absolute left-[8%] right-[8%] top-6 hidden h-px origin-left bg-gold md:block" />
          <motion.div aria-hidden initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.4, ease: "easeInOut" }} className="absolute bottom-6 left-6 top-6 w-px origin-top bg-gold md:hidden" />
          {STEPS.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.25, duration: 0.7 }} className="relative flex gap-5 md:block">
              <div className="font-display relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold bg-cream text-2xl">{s.n}</div>
              <div>
                <h3 className="font-display text-2xl font-medium md:mt-6">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-espresso/70">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
