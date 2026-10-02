"use client";

import { BUSINESS } from "@/lib/spa";
import { useSite } from "@/components/SiteProvider";

export function Footer() {
  const { shortName, brand } = useSite();
  return (
    <footer className="border-t border-[var(--hairline)] px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-3xl italic">{shortName}</p>
          <p className="mt-1 text-sm text-espresso/65">
            {BUSINESS.address} · {BUSINESS.phone}
          </p>
        </div>
        <div className="text-sm text-espresso/65 md:text-right">
          <p>© {new Date().getFullYear()} {brand}. Fictional business created for demonstration.</p>
          <p className="mt-1">
            AI concierge by{" "}
            <a href="https://spartalabs.in" target="_blank" rel="noreferrer" className="font-medium text-espresso underline decoration-gold underline-offset-4">
              SpartaLabs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
