"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FALLBACK_REPLY, ReplySchema, type Reply } from "@/lib/schema";
import { BUSINESS } from "@/lib/spa";
import { t, welcome, type Lang } from "@/lib/i18n";
import { runAutoplay } from "@/lib/autoplay";
import { useChatControl, useSite } from "@/components/SiteProvider";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import type { ChatMsg } from "./types";

const STORAGE_KEY = "medspa-concierge:v1";
const MIN_REPLY_DELAY = 600;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia("(max-width: 639px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useIsMobile = () =>
  useSyncExternalStore(subscribeMobile, () => window.matchMedia("(max-width: 639px)").matches, () => false);

function welcomeMsg(lang: Lang, brand?: string, live = true): ChatMsg {
  const w = welcome(lang, brand);
  return { id: "welcome", role: "assistant", content: w.text, live, reply: { ...FALLBACK_REPLY, reply: w.text, quick_replies: w.chips, language: lang } };
}

type Saved = { messages: ChatMsg[]; convoId: string; lang: Lang };

function loadSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return Array.isArray(s.messages) && s.messages.length ? s : null;
  } catch {
    return null;
  }
}

async function fetchReply(messages: ChatMsg[], lang: Lang, brand: string, conversationId: string): Promise<Reply> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        lang,
        brand,
        conversationId,
      }),
    });
    const parsed = ReplySchema.safeParse(await res.json());
    return parsed.success ? parsed.data : FALLBACK_REPLY;
  } catch {
    return FALLBACK_REPLY;
  }
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const site = useSite();
  const { pending, clearPending } = useChatControl();
  const brandForWelcome = site.isDefaultBrand ? undefined : site.brand;

  const [saved] = useState(loadSaved);
  const [lang, setLang] = useState<Lang>(saved?.lang ?? site.lang);
  const [messages, setMessages] = useState<ChatMsg[]>(() => saved?.messages.map((m) => ({ ...m, live: false })) ?? [welcomeMsg(saved?.lang ?? site.lang, brandForWelcome)]);
  const [convoId, setConvoId] = useState(() => saved?.convoId ?? uid());
  const [busy, setBusy] = useState(false);
  const [draft, setDraftState] = useState("");
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState(false);

  const isMobile = useIsMobile();
  const s = t(lang);
  const rootRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const busyRef = useRef(false);
  const draftRef = useRef("");
  const langRef = useRef(lang);
  const convoRef = useRef(convoId);
  useEffect(() => {
    messagesRef.current = messages;
    langRef.current = lang;
    convoRef.current = convoId;
  });

  // Mirror the conversation to sessionStorage so a refresh keeps the chat.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.map((m) => ({ ...m, live: false })), convoId, lang }));
    } catch {}
  }, [messages, convoId, lang]);

  const setDraft = useCallback((v: string) => {
    draftRef.current = v;
    setDraftState(v);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 600);
      if (!text || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setDraft("");
      const userMsg: ChatMsg = { id: uid(), role: "user", content: text };
      const history = [...messagesRef.current.map((m) => ({ ...m, live: false })), userMsg];
      messagesRef.current = history;
      setMessages(history);
      const [reply] = await Promise.all([fetchReply(history, langRef.current, site.brand, convoRef.current), sleep(MIN_REPLY_DELAY)]);
      const botMsg: ChatMsg = { id: uid(), role: "assistant", content: reply.reply, reply, live: true };
      messagesRef.current = [...history, botMsg];
      setMessages(messagesRef.current);
      setLang(reply.language);
      busyRef.current = false;
      setBusy(false);
    },
    [setDraft, site.brand],
  );

  // First message from a landing-page button ("Find my treatment", "Ask Sofia"...).
  useEffect(() => {
    if (open && pending) {
      const text = pending.text;
      clearPending();
      void send(text);
    }
  }, [open, pending, clearPending, send]);

  // Self-playing demo (?autoplay=1).
  const autoplayStarted = useRef(false);
  useEffect(() => {
    if (!open || !site.autoplay || autoplayStarted.current) return;
    autoplayStarted.current = true;
    void runAutoplay({
      setDraft,
      submit: () => send(draftRef.current),
      cancelled: () => !rootRef.current,
    });
  }, [open, site.autoplay, setDraft, send]);

  const changeLang = (next: Lang) => {
    setLang(next);
    const only = messagesRef.current;
    if (only.length === 1 && only[0].id === "welcome") setMessages([welcomeMsg(next, brandForWelcome)]);
  };

  const startOver = () => {
    setMenu(false);
    setSheet(false);
    busyRef.current = false;
    setBusy(false);
    setDraft("");
    setConvoId(uid());
    setMessages([welcomeMsg(lang, brandForWelcome)]);
  };

  // Esc closes; focus trap on mobile (full-screen sheet).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (sheet) setSheet(false);
        else if (menu) setMenu(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, sheet, menu, onClose]);

  useEffect(() => {
    if (open && isMobile) rootRef.current?.focus();
  }, [open, isMobile]);

  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isMobile || e.key !== "Tab" || !rootRef.current) return;
    const nodes = rootRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const variants = useMemo(
    () =>
      isMobile
        ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
        : { initial: { opacity: 0, scale: 0.4 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.6 } },
    [isMobile],
  );

  const iconBtn = "grid h-8 w-8 place-items-center rounded-full text-espresso/70 transition-colors hover:bg-espresso/5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="panel"
          ref={rootRef}
          tabIndex={-1}
          role="dialog"
          aria-label={`Sofia, ${site.brand} concierge`}
          aria-modal={isMobile || undefined}
          data-chat-panel
          data-busy={busy ? "true" : "false"}
          onKeyDown={trapFocus}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          style={{ transformOrigin: "bottom right" }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-cream outline-none sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(660px,calc(100dvh-3rem))] sm:w-[400px] sm:rounded-[28px] sm:border sm:border-[var(--hairline)] sm:shadow-[var(--shadow-lift)]"
        >
          {/* Header */}
          <header className="flex items-center gap-2.5 border-b border-[var(--hairline)] bg-white/80 px-4 py-3 backdrop-blur">
            <div className="relative shrink-0">
              <div className="font-display grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush to-[#f4ddd3] text-xl font-semibold">S</div>
              <span className="online-dot absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22a05a]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium leading-tight">Sofia</p>
              <p className="truncate text-[11px] text-espresso/65">{s.online}</p>
            </div>
            <div role="group" aria-label={s.langLabel} className="flex shrink-0 rounded-full border border-[var(--hairline)] p-0.5 text-[11px] font-medium">
              {(["en", "es"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => changeLang(l)}
                  className={`rounded-full px-2 py-1 transition-colors ${lang === l ? "bg-espresso text-cream" : "text-espresso/70"}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button type="button" aria-label={s.talk} title={s.talk} onClick={() => setSheet(true)} className={iconBtn}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
            </button>
            <div className="relative">
              <button type="button" aria-label={s.menu} aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((v) => !v)} className={iconBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="absolute right-0 top-10 z-10 w-40 rounded-2xl border border-[var(--hairline)] bg-white p-1 shadow-[var(--shadow-soft)]"
                  >
                    <button role="menuitem" type="button" onClick={startOver} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-espresso/5">
                      {s.startOver}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button type="button" aria-label={s.close} onClick={onClose} className={iconBtn}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <MessageList messages={messages} busy={busy} lang={lang} onSend={(x) => void send(x)} onTeam={() => setSheet(true)} />

          <Composer value={draft} onChange={setDraft} onSubmit={() => void send(draftRef.current)} busy={busy} lang={lang} />
          <p className="bg-white/70 pb-2.5 text-center text-[11px] tracking-wide text-espresso/60">{s.poweredBy}</p>

          {/* Mock "Talk to the team" sheet */}
          <AnimatePresence>
            {sheet && (
              <motion.div className="absolute inset-0 z-20 flex items-end bg-espresso/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)}>
                <motion.div
                  role="dialog"
                  aria-label={s.callWhatsapp}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full rounded-t-[28px] bg-cream p-6 pb-8"
                >
                  <p className="font-display text-2xl font-medium">{s.callWhatsapp}</p>
                  <p className="mt-1 text-sm text-espresso/70">{s.sheetBody}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <a href={`tel:${BUSINESS.phoneHref}`} className="rounded-full bg-espresso px-4 py-3 text-center text-sm font-medium text-cream">{s.call}</a>
                    <a href={`https://wa.me/${BUSINESS.phoneHref.replace("+", "")}`} target="_blank" rel="noreferrer" className="rounded-full bg-gold px-4 py-3 text-center text-sm font-medium text-accent-ink">{s.whatsapp}</a>
                  </div>
                  <button type="button" onClick={() => setSheet(false)} className="mt-3 w-full rounded-full py-2 text-sm text-espresso/70">{s.close}</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
