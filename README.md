# Lumière Aesthetics: AI concierge demo (SpartaLabs)

Demo med-spa site with "Sofia", a Groq-powered concierge. Next.js (App Router), TypeScript strict, Tailwind, Motion.

## Run
```bash
npm install
cp .env.example .env.local   # then set GROQ_API_KEY
npm run dev
```
Env vars: `GROQ_API_KEY` (required), `GROQ_MODEL` (default `openai/gpt-oss-120b`), `LEAD_WEBHOOK_URL` (optional; receives `{ bot, lead, transcript, createdAt }` once per conversation when the lead is complete).
Without a key the chat returns the friendly fallback reply. Deploy on Vercel and add the same env vars.

## Sales-demo URL parameters
`?brand=Glow%20Studio` · `?color=0f766e` · `?lang=es` · `?open=1` · `?autoplay=1` (self-playing script in `src/lib/autoplay.ts`, real AI answers).

## Where things live
- `src/lib/spa.ts`: business facts + catalogue (the only place prices exist). `prompt.ts` builds the system prompt from it.
- `src/lib/slots.ts`: slot generator shared by the server prompt and the UI.
- `src/lib/schema.ts`: strict JSON schema + zod schema (keep in sync).
- `src/app/api/chat/route.ts`: Groq call (structured outputs, no streaming/tools), zod validation, fallback, rate limit, lead webhook.
- Cards in the chat render only from catalogue/slot ids; unknown ids are dropped.

## Notes
- Rate limiting and the "lead already sent" set are in-memory, so they are per serverless instance.
- Bookings are always "requested"; the team confirms by text.
