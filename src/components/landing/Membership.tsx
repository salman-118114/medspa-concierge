"use client";

import { motion } from "motion/react";
import { BUSINESS } from "@/lib/spa";
import { useChatControl, useSite } from "@/components/SiteProvider";

export function Membership() {
  const { shortName, isDefaultBrand, lang } = useSite();
  const { openChat } = useChatControl();
  const name = isDefaultBrand ? BUSINESS.membership.name : `${shortName} Glow Club`;

  return (
    <section id="membership" className="px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto grid max-w-6xl items-center gap-8 rounded-[28px] bg-gradient-to-br from-blush to-[#f3d9cf] p-8 md:grid-cols-[1.4fr_1fr] md:p-14"
      >
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-espresso/70">Membership</p>
          <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">{name}</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-espresso/80">
            One HydraFacial every month and 10% off everything else. Glow, on a schedule.
          </p>
        </div>
        <div className="md:text-right">
          <p className="font-display text-6xl font-medium leading-none">
            $149<span className="text-2xl text-espresso/70">/mo</span>
          </p>
          <button
            type="button"
            onClick={() => openChat(lang === "es" ? "Cuéntame sobre el Glow Club" : "Tell me about the Glow Club")}
            className="shimmer mt-6 rounded-full bg-espresso px-7 py-3.5 text-[15px] font-medium text-cream transition-transform hover:scale-[1.03] active:scale-95"
          >
            Join the Glow Club
          </button>
        </div>
      </motion.div>
    </section>
  );
}
