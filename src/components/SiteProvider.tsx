"use client";

import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { SiteConfig } from "@/lib/brand";

type ChatCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Open the chat and send `text` as the visitor's first message. */
  openChat: (text?: string) => void;
  pending: { text: string; nonce: number } | null;
  clearPending: () => void;
};

const SiteCtx = createContext<SiteConfig | null>(null);
const ChatContext = createContext<ChatCtx | null>(null);

export function SiteProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  const [open, setOpen] = useState(config.open);
  const [pending, setPending] = useState<ChatCtx["pending"]>(null);

  const openChat = useCallback((text?: string) => {
    setOpen(true);
    if (text) setPending({ text, nonce: Date.now() });
  }, []);
  const clearPending = useCallback(() => setPending(null), []);
  const chat = useMemo(() => ({ open, setOpen, openChat, pending, clearPending }), [open, openChat, pending, clearPending]);

  const style = { "--gold": config.accent, "--accent-ink": config.accentInk } as CSSProperties;

  return (
    <SiteCtx.Provider value={config}>
      <ChatContext.Provider value={chat}>
        <MotionConfig reducedMotion="user">
          <div style={style}>{children}</div>
        </MotionConfig>
      </ChatContext.Provider>
    </SiteCtx.Provider>
  );
}

export function useSite(): SiteConfig {
  const v = useContext(SiteCtx);
  if (!v) throw new Error("useSite outside SiteProvider");
  return v;
}

export function useChatControl(): ChatCtx {
  const v = useContext(ChatContext);
  if (!v) throw new Error("useChatControl outside SiteProvider");
  return v;
}
