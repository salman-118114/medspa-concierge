import { DEFAULT_BRAND, DEFAULT_SHORT_NAME } from "./spa";

export const DEFAULT_ACCENT = "#B08D57";
const ESPRESSO = "#2B211C";
const CREAM = "#FBF7F2";

/** Letters, numbers, spaces and & ' . - only; max 40 chars. */
export function sanitizeBrand(v: unknown): string {
  if (typeof v !== "string") return DEFAULT_BRAND;
  const clean = v.replace(/[^\p{L}\p{N} &'.-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 40).trim();
  return clean || DEFAULT_BRAND;
}

/** Valid 3- or 6-digit hex (with or without #) -> "#rrggbb", otherwise the default accent. */
export function sanitizeColor(v: unknown): string {
  if (typeof v !== "string") return DEFAULT_ACCENT;
  const m = v.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(m)) return `#${m.toLowerCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(m)) return `#${m.split("").map((c) => c + c).join("").toLowerCase()}`;
  return DEFAULT_ACCENT;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable text colour for content placed on the accent colour (WCAG contrast). */
export function inkFor(hex: string): string {
  const l = luminance(hex);
  const onEspresso = (l + 0.05) / (luminance(ESPRESSO) + 0.05);
  const onCream = (luminance(CREAM) + 0.05) / (l + 0.05);
  return onEspresso >= onCream ? ESPRESSO : CREAM;
}

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export type SiteConfig = {
  brand: string;
  shortName: string;
  isDefaultBrand: boolean;
  accent: string;
  accentInk: string;
  lang: "en" | "es";
  open: boolean;
  autoplay: boolean;
};

export function parseParams(sp: SP): SiteConfig {
  const brand = sanitizeBrand(first(sp.brand));
  const accent = sanitizeColor(first(sp.color));
  const isDefaultBrand = brand === DEFAULT_BRAND;
  return {
    brand,
    shortName: isDefaultBrand ? DEFAULT_SHORT_NAME : brand,
    isDefaultBrand,
    accent,
    accentInk: inkFor(accent),
    lang: first(sp.lang) === "es" ? "es" : "en",
    open: first(sp.open) === "1" || first(sp.autoplay) === "1",
    autoplay: first(sp.autoplay) === "1",
  };
}
