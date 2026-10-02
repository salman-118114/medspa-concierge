import type { Reply } from "@/lib/schema";

export type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Structured data for assistant messages (chips, cards, lead...). */
  reply?: Reply;
  /** True only for messages that just arrived, so they animate; never persisted. */
  live?: boolean;
};
