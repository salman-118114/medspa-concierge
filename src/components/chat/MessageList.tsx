"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { t, type Lang } from "@/lib/i18n";
import { Bubble, typeDuration } from "./Bubble";
import { Chips } from "./Chips";
import { TypingDots } from "./TypingDots";
import { TreatmentCards } from "./TreatmentCards";
import { SlotPicker } from "./SlotPicker";
import { BookingSummary } from "./BookingSummary";
import { OfferCard } from "./OfferCard";
import type { ChatMsg } from "./types";

type Props = {
  messages: ChatMsg[];
  busy: boolean;
  lang: Lang;
  onSend: (text: string) => void;
  onTeam: () => void;
};

export function MessageList({ messages, busy, lang, onSend, onTeam }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const s = t(lang);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const toBottom = () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    toBottom();
    const id = window.setTimeout(toBottom, 450); // after cards finish animating in
    return () => window.clearTimeout(id);
  }, [messages.length, busy]);

  return (
    <div ref={scroller} role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
      {messages.map((m, i) => {
        const isLast = i === messages.length - 1;
        const live = !!m.live;
        const interactive = isLast && !busy;
        const r = m.reply;
        const cardDelay = live ? typeDuration(m.content.length) / 1000 : 0;
        const chips = r && isLast && !busy ? [...r.quick_replies, ...(r.handoff ? [s.talk] : [])] : [];

        return (
          <div key={m.id} className="space-y-3">
            <Bubble role={m.role} text={m.content} animate={live} />
            {r?.card_type === "treatments" && (
              <TreatmentCards ids={r.card_ids} lang={lang} delay={cardDelay} disabled={!interactive} onBook={(name) => onSend(s.bookMsg(name))} />
            )}
            {r?.card_type === "slots" && (
              <SlotPicker ids={r.card_ids} lang={lang} delay={cardDelay} disabled={!interactive} onPick={(label) => onSend(s.slotMsg(label))} />
            )}
            {r?.card_type === "booking_summary" && (
              <BookingSummary lead={r.lead} slotIds={r.card_ids} lang={lang} animate={live} delay={cardDelay} />
            )}
            {r?.card_type === "offer" && (
              <OfferCard lang={lang} delay={cardDelay} disabled={!interactive} onAccept={() => onSend(s.offerMsg)} />
            )}
            <AnimatePresence>
              {chips.length > 0 && (
                <Chips key={`chips-${m.id}`} chips={chips} delay={cardDelay + (r?.card_type !== "none" ? 0.3 : 0.1)} onPick={(c) => (c === s.talk ? onTeam() : onSend(c))} />
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <AnimatePresence>{busy && <TypingDots key="typing" label={lang === "es" ? "Sofia está escribiendo" : "Sofia is typing"} />}</AnimatePresence>
    </div>
  );
}
