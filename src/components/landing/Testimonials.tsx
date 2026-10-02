"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const QUOTES = [
  { text: "Natural, soft and exactly what I asked for. Camila made me feel completely at ease from the first minute.", who: "Valentina R.", what: "Lip filler" },
  { text: "I booked at midnight through the chat and woke up to a text from the team. Effortless, and the HydraFacial was heaven.", who: "Jessica M.", what: "HydraFacial" },
  { text: "Dr. Ruiz listens. My skin has never looked better, and nobody can tell what I had done. They just say I look rested.", who: "Daniela P.", what: "Microneedling" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5000);
    return () => window.clearInterval(id);
  }, [paused, i]);

  return (
    <section id="results" className="mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
      <p className="mb-8 text-xs font-medium uppercase tracking-[0.28em] text-gold-text">Results</p>
      <div className="grid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        {QUOTES.map((q, idx) => (
          <motion.figure
            key={q.who}
            aria-hidden={idx !== i}
            initial={{ opacity: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 8 }}
            animate={{ opacity: idx === i ? 1 : 0, y: idx === i ? 0 : 8 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ gridArea: "1 / 1", pointerEvents: idx === i ? "auto" : "none" }}
          >
            <blockquote className="font-display text-3xl font-medium italic leading-snug md:text-[2.6rem]">“{q.text}”</blockquote>
            <figcaption className="mt-6 text-sm text-espresso/70">
              <span className="font-medium text-espresso">{q.who}</span> · {q.what}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <div className="mt-10 flex justify-center gap-2" role="group" aria-label="Choose testimonial">
        {QUOTES.map((q, idx) => (
          <button key={q.who} type="button" aria-label={`Show testimonial ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)} className="grid h-6 w-6 place-items-center">
            <span className={`block h-2 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : "w-2 bg-espresso/25"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
