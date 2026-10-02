"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useChatControl } from "@/components/SiteProvider";
import { Launcher } from "./Launcher";

// The panel code is only fetched once the launcher is hovered/focused/opened.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

export function ChatRoot() {
  const { open, setOpen } = useChatControl();
  const [wanted, setWanted] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const intent = useCallback(() => setWanted(true), []);
  const close = useCallback(() => setOpen(false), [setOpen]);

  // Hover/focus/open all load the panel; this effect covers `open` set from anywhere.
  const mount = wanted || open;

  useEffect(() => {
    if (wasOpen.current && !open) launcher.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <Launcher ref={launcher} visible={!open} onOpen={() => setOpen(true)} onIntent={intent} />
      {mount && <ChatPanel open={open} onClose={close} />}
    </>
  );
}
