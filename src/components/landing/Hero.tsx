"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "motion/react";
import { useChatControl, useSite } from "@/components/SiteProvider";

const HEADLINE = "Your most radiant self, by appointment.".split(" ");

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const MAX_PARALLAX = 12;

function Blob({ className, color, depth, drift, duration, mx, my }: { className: string; color: string; depth: number; drift: [number, number]; duration: number; mx: ReturnType<typeof useSpring>; my: ReturnType<typeof useSpring> }) {
  const x = useTransform(mx, (v) => v * MAX_PARALLAX * depth);
  const y = useTransform(my, (v) => v * MAX_PARALLAX * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        aria-hidden
        className={`h-full w-full rounded-full blur-2xl ${color}`}
        animate={{ x: [0, drift[0], 0], y: [0, drift[1], 0], scale: [1, 1.08, 1] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function Hero() {
  const { lang } = useSite();
  const { openChat } = useChatControl();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const es = lang === "es";

  return (
    <section ref={ref} id="top" onMouseMove={onMove} className="grain relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-16">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-gold-text">
            Medical aesthetics · Brickell, Miami
          </motion.p>
          <motion.h1 initial="hidden" animate="show" transition={{ staggerChildren: 0.11, delayChildren: 0.2 }} className="font-display text-[clamp(2.9rem,7vw,5.4rem)] font-medium leading-[0.98] tracking-tight">
            {HEADLINE.map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="mr-[0.26em] inline-block">
                {w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }} className="mt-6 max-w-md text-lg leading-relaxed text-espresso/75">
            Subtle, natural results from a medical team that listens. Ask Sofia anything, find your treatment, and request a free consultation in under a minute.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => openChat(es ? "Encontrar mi tratamiento" : "Find my treatment")} className="rounded-full bg-gold px-7 py-3.5 text-[15px] font-medium text-accent-ink shadow-[0_10px_24px_-10px_var(--gold)] transition-transform hover:scale-[1.03] active:scale-95">
              Find my treatment
            </button>
            <button type="button" onClick={() => openChat(es ? "Reservar una consulta" : "Book a consultation")} className="rounded-full border border-espresso/20 bg-white/60 px-7 py-3.5 text-[15px] font-medium backdrop-blur transition-transform hover:scale-[1.03] active:scale-95">
              Book a consultation
            </button>
          </motion.div>
        </div>

        <div aria-hidden className="relative mx-auto h-[340px] w-full max-w-[460px] md:h-[460px]">
          <Blob mx={mx} my={my} depth={1} drift={[18, -22]} duration={11} className="left-[6%] top-[4%] h-[62%] w-[62%]" color="bg-blush" />
          <Blob mx={mx} my={my} depth={0.7} drift={[-20, 16]} duration={13} className="right-[0%] top-[30%] h-[58%] w-[58%]" color="bg-gold/60" />
          <Blob mx={mx} my={my} depth={0.4} drift={[14, 20]} duration={15} className="bottom-[0%] left-[22%] h-[44%] w-[44%]" color="bg-[#f3d9cf]" />
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[0%] rounded-2xl border border-white/60 bg-white/55 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-md"
          >
            <p className="text-sm font-medium">
              <span className="text-gold-text">★</span> 4.9 · 1,200+ Miami clients
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
