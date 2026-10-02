"use client";

import { useEffect, useState } from "react";
import { useChatControl, useSite } from "@/components/SiteProvider";

const LINKS = [
  ["Treatments", "#treatments"],
  ["Results", "#results"],
  ["Membership", "#membership"],
  ["Visit", "#visit"],
] as const;

export function Nav() {
  const { shortName, lang } = useSite();
  const { openChat } = useChatControl();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled ? "border-[var(--hairline)] bg-cream/70 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <a href="#top" className="font-display text-3xl italic leading-none tracking-tight">
          {shortName}
        </a>
        <ul className="hidden items-center gap-8 text-[15px] md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="text-espresso/80 transition-colors hover:text-espresso">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => openChat(lang === "es" ? "Reservar una consulta" : "Book a consultation")}
          className="rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-cream transition-transform hover:scale-[1.03] active:scale-95"
        >
          Book a consultation
        </button>
      </nav>
    </header>
  );
}
