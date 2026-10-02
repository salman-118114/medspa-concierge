"use client";

import { motion } from "motion/react";
import { BUSINESS } from "@/lib/spa";
import { useSite } from "@/components/SiteProvider";

export function Visit() {
  const { shortName } = useSite();
  return (
    <section id="visit" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold-text">Visit</p>
          <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">Find us in Brickell.</h2>
          <address className="mt-6 text-lg not-italic leading-relaxed text-espresso/80">
            {shortName}
            <br />
            {BUSINESS.address}
            <br />
            <span className="text-base text-espresso/65">{BUSINESS.parking}</span>
          </address>
          <dl className="mt-8 max-w-xs space-y-2.5 text-[15px]">
            {BUSINESS.hours.map((h) => (
              <div key={h.days} className="flex justify-between border-b border-[var(--hairline)] pb-2.5">
                <dt className="text-espresso/70">{h.days}</dt>
                <dd className="font-medium">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="map-bg relative min-h-[320px] overflow-hidden rounded-[20px] border border-[var(--hairline)] shadow-[var(--shadow-soft)]"
          role="img"
          aria-label={`Map placeholder showing ${BUSINESS.address}`}
        >
          <div className="absolute left-[56%] top-[44%] -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-gold/40" />
            <span className="relative block h-5 w-5 rounded-full border-4 border-white bg-gold shadow-md" />
          </div>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium backdrop-blur">Brickell Ave</span>
        </motion.div>
      </div>
    </section>
  );
}
