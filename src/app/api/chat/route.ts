import Groq from "groq-sdk";
import { after } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/prompt";
import { sanitizeBrand } from "@/lib/brand";
import { rateLimit } from "@/lib/rate-limit";
import { FALLBACK_REPLY, REPLY_JSON_SCHEMA, ReplySchema, friendlyReply, type Reply } from "@/lib/schema";
import { findTreatment } from "@/lib/spa";
import { generateSlots } from "@/lib/slots";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 600;
const GROQ_TIMEOUT_MS = 15_000;
const WEBHOOK_TIMEOUT_MS = 5_000;

const BodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
  lang: z.enum(["en", "es"]).optional(),
  brand: z.string().optional(),
  conversationId: z.string().max(64).optional(),
});

// Conversations whose lead was already sent (per server instance).
const sentLeads = new Set<string>();

const json = (body: Reply, status = 200) => Response.json(body, { status });

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

async function sendLead(payload: unknown) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[lead-webhook] failed:", err instanceof Error ? err.message : err);
  }
}

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req))) {
    return json(friendlyReply("You're chatting very fast! Give me a few minutes and I'll be right here."), 429);
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return json(friendlyReply("Hmm, I couldn't read that message. Could you try again?"), 400);
  }

  const lang = body.lang ?? "en";
  const messages = body.messages.slice(-MAX_MESSAGES).map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (messages.some((m) => m.role === "user" && m.content.length > MAX_USER_CHARS)) {
    return json(
      friendlyReply(
        lang === "es"
          ? "¡Qué mensaje tan largo! ¿Puedes resumirlo en unas pocas líneas?"
          : "That's a lot to take in! Could you shorten it to a few lines?",
        lang,
      ),
      400,
    );
  }
  if (messages[messages.length - 1].role !== "user") {
    return json(friendlyReply("Hmm, I couldn't read that message. Could you try again?"), 400);
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("[chat] GROQ_API_KEY is not set");
    return json(FALLBACK_REPLY);
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const systemPrompt = buildSystemPrompt({ brand: sanitizeBrand(body.brand), lang });
    const completion = await groq.chat.completions.create(
      {
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        response_format: {
          type: "json_schema",
          json_schema: { name: "concierge_reply", strict: true, schema: REPLY_JSON_SCHEMA },
        },
        reasoning_effort: "low",
        include_reasoning: false,
        max_completion_tokens: 1024,
      },
      { timeout: GROQ_TIMEOUT_MS, maxRetries: 0 },
    );
    const parsed = ReplySchema.parse(JSON.parse(completion.choices[0]?.message?.content ?? ""));

    const slotIds = new Set(generateSlots().map((s) => s.id));
    const reply: Reply = {
      ...parsed,
      quick_replies: parsed.quick_replies.slice(0, 4),
      card_ids: parsed.card_ids.filter((id) => (parsed.card_type === "treatments" ? !!findTreatment(id) : slotIds.has(id))),
    };
    reply.lead.complete = !!(reply.lead.name.trim() && reply.lead.phone.trim() && reply.lead.interest.trim());

    const convoId = body.conversationId;
    if (reply.lead.complete && convoId && !sentLeads.has(convoId)) {
      sentLeads.add(convoId);
      const transcript = [...messages, { role: "assistant", content: reply.reply }];
      const payload = { bot: "medspa-concierge", lead: reply.lead, transcript, createdAt: new Date().toISOString() };
      after(() => sendLead(payload));
    }

    return json(reply);
  } catch (err) {
    console.error("[chat] error:", err instanceof Error ? err.message : err);
    return json(FALLBACK_REPLY);
  }
}
