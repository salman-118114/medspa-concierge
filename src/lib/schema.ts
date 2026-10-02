import { z } from "zod";

export const CARD_TYPES = ["none", "treatments", "slots", "booking_summary", "offer"] as const;

export const LeadSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  interest: z.string(),
  preferred_slot: z.string(),
  complete: z.boolean(),
});

export const ReplySchema = z.object({
  reply: z.string().min(1),
  quick_replies: z.array(z.string()),
  card_type: z.enum(CARD_TYPES),
  card_ids: z.array(z.string()),
  lead: LeadSchema,
  handoff: z.boolean(),
  language: z.enum(["en", "es"]),
});

export type Reply = z.infer<typeof ReplySchema>;
export type Lead = z.infer<typeof LeadSchema>;

// Strict mode: every property required, every object closed. Keep in sync with ReplySchema.
export const REPLY_JSON_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    quick_replies: { type: "array", items: { type: "string" } },
    card_type: { type: "string", enum: [...CARD_TYPES] },
    card_ids: { type: "array", items: { type: "string" } },
    lead: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        interest: { type: "string" },
        preferred_slot: { type: "string" },
        complete: { type: "boolean" },
      },
      required: ["name", "phone", "email", "interest", "preferred_slot", "complete"],
      additionalProperties: false,
    },
    handoff: { type: "boolean" },
    language: { type: "string", enum: ["en", "es"] },
  },
  required: ["reply", "quick_replies", "card_type", "card_ids", "lead", "handoff", "language"],
  additionalProperties: false,
} as const;

export const EMPTY_LEAD: Lead = { name: "", phone: "", email: "", interest: "", preferred_slot: "", complete: false };

export const FALLBACK_REPLY: Reply = {
  reply: "So sorry, I had a little hiccup. Could you say that again?",
  quick_replies: ["See prices", "Book a consultation"],
  card_type: "none",
  card_ids: [],
  lead: EMPTY_LEAD,
  handoff: false,
  language: "en",
};

/** A plain-text reply in the same shape the widget already renders (used for 400/429). */
export function friendlyReply(reply: string, language: "en" | "es" = "en"): Reply {
  return { ...FALLBACK_REPLY, reply, quick_replies: [], language };
}
