// Shared by server (system prompt) and UI (slot picker) so ids always match.
import { BUSINESS } from "./spa";

export type Slot = { id: string; day: number; dayLabel: string; time: string; label: string };

const WEEKDAY_TIMES = ["10:30 AM", "1:00 PM", "4:30 PM"];
// Saturday closes at 4pm, so its last slot is earlier than on weekdays.
const SATURDAY_TIMES = ["10:30 AM", "12:00 PM", "2:30 PM"];

function todayInMiami(now: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day"), 12));
}

/** Next 4 opening days (Sunday skipped), starting tomorrow, 3 slots each, ids slot-1..slot-12. */
export function generateSlots(now: Date = new Date(), lang: "en" | "es" = "en"): Slot[] {
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-US" : "en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" });
  const cursor = todayInMiami(now);
  const out: Slot[] = [];
  let day = 0;
  while (day < 4) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const dow = cursor.getUTCDay();
    if (dow === 0) continue;
    const dayLabel = fmt.format(cursor);
    (dow === 6 ? SATURDAY_TIMES : WEEKDAY_TIMES).forEach((time, i) => {
      out.push({ id: `slot-${day * 3 + i + 1}`, day, dayLabel, time, label: `${dayLabel} · ${time}` });
    });
    day++;
  }
  return out;
}
