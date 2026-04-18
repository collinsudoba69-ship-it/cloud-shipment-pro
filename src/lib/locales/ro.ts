import type { TranslationSchema } from "./en";

const ro: TranslationSchema = {
  nav: { home: "Acasă", track: "Urmărire", services: "Servicii", contact: "Contact", dashboard: "Panou", account: "Cont", staffLogin: "Autentificare personal" },
  hero: {
    badge: "Platformă globală de logistică",
    title1: "Expediază oriunde.",
    title2: "Urmărește pretutindeni.",
    subtitle: "Vizibilitate în timp real pe aer, mare și uscat pentru companii care mișcă lumea.",
    placeholder: "Introdu numărul de urmărire (ex. CS-2025-04-AB12CD)",
    button: "Urmărește",
  },
  stats: { countries: "Țări deservite", shipments: "Expedieri urmărite", onTime: "Livrări la timp", support: "Suport live" },
  services: {
    heading: "Construit pentru logistica modernă",
    sub: "Patru linii de servicii, o platformă — concepută pentru viteză, scară și transparență.",
    air: "Transport aerian", airDesc: "Transport aerian rapid transfrontalier cu vizibilitate completă.",
    sea: "Transport maritim", seaDesc: "Transport containerizat fiabil pentru încărcături FCL și LCL.",
    express: "Livrare expres", expressDesc: "Livrare ușă la ușă în 1-3 zile.",
    warehousing: "Depozitare", warehousingDesc: "Depozitare și fulfilment sigure în peste 40 de hub-uri.",
  },
  trust: {
    insured: "Asigurat și sigur", insuredDesc: "Fiecare expediere acoperită de asigurare globală până la $100K.",
    network: "Rețea mondială", networkDesc: "Parteneriate directe cu transportatori în 120+ țări și teritorii.",
    realtime: "Urmărire în timp real", realtimeDesc: "Status live, actualizări ETA și dovadă de livrare la fiecare etapă.",
  },
  track: {
    title: "Urmărește expedierea ta", subtitle: "Introdu numărul de urmărire pentru a vedea statusul live.",
    placeholder: "CS-2025-04-XXXXXX", button: "Urmărește", looking: "Căutăm expedierea ta…",
    notFound: "Numărul de urmărire nu a fost găsit", notFoundDesc: "Nicio expediere găsită cu acel număr.",
    prompt: "Introdu un număr de urmărire mai sus pentru a începe.",
    trackingNo: "Urmărire #", progress: "Progres", from: "De la", to: "La", eta: "Livrare estimată",
    registered: "Înregistrat la", type: "Tip", express: "Expres", fragile: "Fragil",
    timeline: "Cronologia expedierii", noEvents: "Nicio etapă încă.", update: "Actualizare",
    images: "Imagini expediere / dovadă", tbc: "De confirmat", language: "Limbă", badge: "Urmărire Cloud Shipment",
  },
  status: { queued: "În așteptare", in_transit: "În tranzit", out_for_delivery: "În livrare", delivered: "Livrat" },
  footer: {
    tagline: "Logistică globală, transparentă. Urmărește fiecare colet de la origine până la ușă.",
    services: "Servicii", company: "Companie", contactUs: "Contactează-ne", support: "Asistență clienți",
    supportDesc: "Întrebări despre un colet? Trimite-ne un e-mail direct.", emailUs: "Asistență prin e-mail",
    legal: "Juridic", privacy: "Politica de confidențialitate", terms: "Termeni de utilizare",
    rights: "Toate drepturile rezervate.", trackShipment: "Urmărește expediere", staffPortal: "Portal personal",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Logistică globală rapidă și fiabilă",
    heroPlaceholder: "Introdu numărul de urmărire...", heroButton: "Urmărește acum",
    liveMap: "Hartă globală de tranzit în timp real", footerVersion: "Platformă logistică · v1.1",
  },
};

export default ro;
