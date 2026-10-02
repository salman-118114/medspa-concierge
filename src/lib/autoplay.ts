// Self-playing demo for screen-recording reels (?autoplay=1).
// The real AI answers; the visitor's side is scripted: typed at a human pace, chips and slots tapped.

export type AutoplayDriver = {
  setDraft: (text: string) => void;
  /** Sends the current draft and resolves when the reply has been rendered. */
  submit: () => Promise<void>;
  cancelled: () => boolean;
};

type Step = { kind: "tap"; chip: string[] } | { kind: "type"; text: string } | { kind: "slot"; fallback: string };

export const AUTOPLAY_SCRIPT: Step[] = [
  { kind: "tap", chip: ["Find my treatment", "Encontrar mi tratamiento"] },
  { kind: "type", text: "I want my lips a bit fuller but natural" },
  { kind: "type", text: "Does it hurt? And how long does swelling last?" },
  { kind: "slot", fallback: "Can I come Saturday?" },
  { kind: "type", text: "I'm Jessica, 305-555-0142" },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function waitFor<T>(find: () => T | null | undefined, timeout: number, d: AutoplayDriver): Promise<T | null> {
  const end = Date.now() + timeout;
  while (Date.now() < end && !d.cancelled()) {
    const v = find();
    if (v) return v;
    await sleep(120);
  }
  return null;
}

const isIdle = () => document.querySelector('[data-chat-panel][data-busy="false"]');

async function waitIdle(d: AutoplayDriver) {
  await sleep(200); // let the click/submit flip the panel to busy first
  await waitFor(isIdle, 30_000, d);
  await sleep(900); // let the reply finish typing before the "visitor" reacts
}

function findChip(labels: string[]): HTMLButtonElement | null {
  const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-chip]")];
  return chips.find((c) => labels.includes(c.textContent?.trim() ?? "")) ?? null;
}

async function typeHuman(text: string, d: AutoplayDriver) {
  for (let i = 1; i <= text.length; i++) {
    if (d.cancelled()) return;
    d.setDraft(text.slice(0, i));
    await sleep(45 + Math.random() * 45);
  }
  await sleep(450);
  if (!d.cancelled()) await d.submit();
}

/** Runs the script. Stops quietly if an expected chip is missing or the panel is closed. */
export async function runAutoplay(d: AutoplayDriver): Promise<void> {
  await sleep(1400);
  for (const step of AUTOPLAY_SCRIPT) {
    if (d.cancelled()) return;
    await waitFor(isIdle, 30_000, d);
    if (step.kind === "tap") {
      const chip = await waitFor(() => findChip(step.chip), 6000, d);
      if (!chip) return;
      await sleep(600);
      chip.click();
      await waitIdle(d);
    } else if (step.kind === "type") {
      await typeHuman(step.text, d);
      await waitIdle(d);
    } else {
      const pill = await waitFor(() => document.querySelector<HTMLButtonElement>("[data-slot-pill]:not(:disabled)"), 1500, d);
      if (pill) {
        await sleep(600);
        pill.click();
        await waitIdle(d);
      } else {
        await typeHuman(step.fallback, d);
        await waitIdle(d);
      }
    }
  }
}
