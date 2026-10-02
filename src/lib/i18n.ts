export type Lang = "en" | "es";

const STRINGS = {
  en: {
    online: "Online · replies instantly",
    placeholder: "Type your message…",
    send: "Send message",
    close: "Close chat",
    talk: "Talk to the team",
    menu: "Chat menu",
    startOver: "Start over",
    poweredBy: "AI concierge by SpartaLabs",
    from: "From",
    downtime: "Downtime",
    bookThis: "Book this",
    askSofia: "Ask Sofia",
    pickTime: "Pick a time",
    requested: "Requested · we'll confirm by text",
    receipt: "Appointment request",
    name: "Name",
    phone: "Mobile",
    treatment: "Treatment",
    when: "When",
    consultation: "Free consultation",
    offerTitle: "$50 off your first visit",
    offerBody: "New clients only. Let us text it to you.",
    offerCta: "Text me the offer",
    callWhatsapp: "Reach our team",
    call: "Call",
    whatsapp: "WhatsApp",
    team: "Talk to the team",
    sheetBody: "Our front desk is happy to help.",
    teamMsg: "Talk to the team",
    bookMsg: (n: string) => `I'd like to book ${n}`,
    slotMsg: (l: string) => `I'll take ${l}`,
    offerMsg: "Yes, text me the offer",
    askMsg: (n: string) => `Tell me about ${n}`,
    langLabel: "Language",
    free: "Free",
  },
  es: {
    online: "En línea · responde al instante",
    placeholder: "Escribe tu mensaje…",
    send: "Enviar mensaje",
    close: "Cerrar chat",
    talk: "Hablar con el equipo",
    menu: "Menú del chat",
    startOver: "Empezar de nuevo",
    poweredBy: "Concierge de IA por SpartaLabs",
    from: "Desde",
    downtime: "Recuperación",
    bookThis: "Reservar",
    askSofia: "Pregúntale a Sofia",
    pickTime: "Elige un horario",
    requested: "Solicitada · confirmamos por texto",
    receipt: "Solicitud de cita",
    name: "Nombre",
    phone: "Móvil",
    treatment: "Tratamiento",
    when: "Cuándo",
    consultation: "Consulta gratis",
    offerTitle: "$50 de descuento en tu primera visita",
    offerBody: "Solo clientas nuevas. Te lo enviamos por texto.",
    offerCta: "Envíame la oferta",
    callWhatsapp: "Contacta a nuestro equipo",
    call: "Llamar",
    whatsapp: "WhatsApp",
    team: "Hablar con el equipo",
    sheetBody: "Nuestra recepción te atenderá con gusto.",
    teamMsg: "Hablar con el equipo",
    bookMsg: (n: string) => `Quiero reservar ${n}`,
    slotMsg: (l: string) => `Tomo ${l}`,
    offerMsg: "Sí, envíame la oferta",
    askMsg: (n: string) => `Cuéntame sobre ${n}`,
    langLabel: "Idioma",
    free: "Gratis",
  },
} as const;

export function t(lang: Lang) {
  return STRINGS[lang];
}

export function welcome(lang: Lang, brand?: string): { text: string; chips: string[] } {
  const from = brand ? (lang === "es" ? ` de ${brand}` : ` from ${brand}`) : "";
  return lang === "es"
    ? {
        text: `Hola, soy Sofia${from} ✨ Puedo ayudarte a encontrar el tratamiento ideal, ver precios o reservar una consulta gratis. ¿Qué te trae por aquí hoy?`,
        chips: ["Encontrar mi tratamiento", "Ver precios", "Reservar una consulta", "Oferta para nuevas clientas"],
      }
    : {
        text: `Hi, I'm Sofia${from} ✨ I can help you find the right treatment, check prices, or book a free consultation. What brings you in today?`,
        chips: ["Find my treatment", "See prices", "Book a consultation", "New client offer"],
      };
}
