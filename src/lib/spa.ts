// Single source of truth: business facts + treatment catalogue.

export const DEFAULT_BRAND = "Lumière Aesthetics";
export const DEFAULT_SHORT_NAME = "Lumière";

export const BUSINESS = {
  city: "Miami, FL (Brickell)",
  address: "1100 Brickell Ave, Miami, FL 33131",
  timeZone: "America/New_York",
  phone: "(305) 555-0100",
  phoneHref: "+13055550100",
  hours: [
    { days: "Mon–Fri", daysEs: "Lun–Vie", time: "9am – 7pm", timeEs: "9am – 7pm" },
    { days: "Sat", daysEs: "Sáb", time: "10am – 4pm", timeEs: "10am – 4pm" },
    { days: "Sun", daysEs: "Dom", time: "Closed", timeEs: "Cerrado" },
  ],
  team: [
    { name: "Dr. Elena Ruiz", role: "medical director" },
    { name: "Camila", role: "nurse injector" },
    { name: "Isabella", role: "lead aesthetician" },
  ],
  offer: "$50 off the first treatment",
  membership: {
    name: "Lumière Glow Club",
    price: "$149/mo",
    perks: "one HydraFacial a month and 10% off everything else",
  },
  parking: "Valet parking is available in the building.",
} as const;

export type Treatment = {
  id: string;
  name: string;
  from: string;
  session: string;
  downtime: string;
  lasts: string;
  goodFor: string;
  es: { name: string; downtime: string; goodFor: string };
};

export const TREATMENTS: Treatment[] = [
  { id: "botox", name: "Botox / anti-wrinkle", from: "$12 per unit (most areas 20–40 units)", session: "20 min", downtime: "None", lasts: "3–4 months", goodFor: "Forehead lines, frown lines, crow's feet", es: { name: "Botox / antiarrugas", downtime: "Ninguno", goodFor: "Líneas de la frente, entrecejo, patas de gallo" } },
  { id: "lip-filler", name: "Lip filler", from: "$650 per syringe", session: "45 min", downtime: "1–3 days of swelling", lasts: "6–12 months", goodFor: "Volume, shape, symmetry", es: { name: "Relleno de labios", downtime: "1–3 días de hinchazón", goodFor: "Volumen, forma, simetría" } },
  { id: "cheek-filler", name: "Cheek and jaw filler", from: "$750 per syringe", session: "45 min", downtime: "1–2 days", lasts: "12–18 months", goodFor: "Contour, lift", es: { name: "Relleno de pómulos y mandíbula", downtime: "1–2 días", goodFor: "Contorno, efecto lifting" } },
  { id: "hydrafacial", name: "HydraFacial", from: "$199", session: "45 min", downtime: "None", lasts: "4 weeks of glow", goodFor: "Dull skin, congestion, event prep", es: { name: "HydraFacial", downtime: "Ninguno", goodFor: "Piel opaca, congestión, antes de un evento" } },
  { id: "laser-hair", name: "Laser hair removal", from: "$150 per session (packages of 6)", session: "15–60 min", downtime: "None", lasts: "Long-term reduction", goodFor: "Unwanted hair", es: { name: "Depilación láser", downtime: "Ninguno", goodFor: "Vello no deseado" } },
  { id: "chemical-peel", name: "Chemical peel", from: "$175", session: "30 min", downtime: "3–5 days of peeling", lasts: "1–2 months", goodFor: "Pigmentation, texture", es: { name: "Peeling químico", downtime: "3–5 días de descamación", goodFor: "Pigmentación, textura" } },
  { id: "microneedling", name: "Microneedling with PRP", from: "$300", session: "60 min", downtime: "1–2 days of redness", lasts: "Builds over 3 sessions", goodFor: "Acne scars, pores, fine lines", es: { name: "Microneedling con PRP", downtime: "1–2 días de enrojecimiento", goodFor: "Cicatrices de acné, poros, líneas finas" } },
  { id: "skin-consult", name: "Skin consultation", from: "Free (20 min)", session: "20 min", downtime: "None", lasts: "n/a", goodFor: "Not sure what you need", es: { name: "Consulta de piel", downtime: "Ninguno", goodFor: "No sabes qué necesitas" } },
];

export function findTreatment(id: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.id === id);
}

/** Price text always uses "from" wording. */
export function priceLabel(t: Treatment, lang: "en" | "es"): string {
  if (t.from.startsWith("Free")) return lang === "es" ? "Gratis (20 min)" : t.from;
  if (lang === "en") return `From ${t.from}`;
  const es = t.from
    .replace("per syringe", "por jeringa")
    .replace("per unit", "por unidad")
    .replace("most areas", "la mayoría de zonas")
    .replace("per session", "por sesión")
    .replace("packages of", "paquetes de");
  return `Desde ${es}`;
}
