import type { TranslationSchema } from "./en";

const cs: TranslationSchema = {
  nav: { home: "Domů", track: "Sledovat", services: "Služby", contact: "Kontakt", dashboard: "Panel", account: "Účet", staffLogin: "Přihlášení personálu" },
  hero: {
    badge: "Globální logistická platforma",
    title1: "Posílejte kamkoli.",
    title2: "Sledujte všude.",
    subtitle: "Viditelnost v reálném čase v letecké, námořní i pozemní dopravě.",
    placeholder: "Zadejte sledovací číslo (např. CS-2025-04-AB12CD)",
    button: "Sledovat",
  },
  stats: { countries: "Obsluhované země", shipments: "Sledované zásilky", onTime: "Včasné doručení", support: "Živá podpora" },
  services: {
    heading: "Vytvořeno pro moderní logistiku",
    sub: "Čtyři linie služeb, jedna platforma — navržená pro rychlost, škálu a transparentnost.",
    air: "Letecká přeprava", airDesc: "Rychlá přeshraniční letecká přeprava s plnou viditelností.",
    sea: "Námořní přeprava", seaDesc: "Spolehlivá kontejnerová přeprava FCL a LCL.",
    express: "Expresní doručení", expressDesc: "Doručení ode dveří ke dveřím za 1-3 dny.",
    warehousing: "Skladování", warehousingDesc: "Bezpečné skladování ve více než 40 hubech po celém světě.",
  },
  trust: {
    insured: "Pojištěno a zabezpečeno", insuredDesc: "Každá zásilka kryta globálním pojištěním až do $100K.",
    network: "Celosvětová síť", networkDesc: "Přímá partnerství s dopravci ve 120+ zemích.",
    realtime: "Sledování v reálném čase", realtimeDesc: "Živý stav, aktualizace ETA a potvrzení doručení.",
  },
  track: {
    title: "Sledujte svou zásilku", subtitle: "Zadejte sledovací číslo pro zobrazení živého stavu.",
    placeholder: "CS-2025-04-XXXXXX", button: "Sledovat", looking: "Hledáme vaši zásilku…",
    notFound: "Sledovací číslo nenalezeno", notFoundDesc: "Nebyla nalezena žádná zásilka s tímto číslem.",
    prompt: "Pro začátek zadejte sledovací číslo výše.",
    trackingNo: "Sledování #", progress: "Pokrok", from: "Z", to: "Do", eta: "Odhadované doručení",
    registered: "Registrováno", type: "Typ", express: "Expres", fragile: "Křehké",
    timeline: "Časová osa zásilky", noEvents: "Zatím žádné události.", update: "Aktualizace",
    images: "Obrázky zásilky / důkazu", tbc: "Bude potvrzeno", language: "Jazyk", badge: "Sledování Cloud Shipment",
  },
  status: { queued: "Ve frontě", in_transit: "V přepravě", out_for_delivery: "K doručení", delivered: "Doručeno" },
  footer: {
    tagline: "Globální logistika, transparentní. Sledujte každý balík od původu až ke dveřím.",
    services: "Služby", company: "Společnost", contactUs: "Kontaktujte nás", support: "Zákaznická podpora",
    supportDesc: "Otázky k balíku? Napište nám přímo.", emailUs: "E-mailová podpora",
    legal: "Právní", privacy: "Zásady ochrany soukromí", terms: "Podmínky služby",
    rights: "Všechna práva vyhrazena.", trackShipment: "Sledovat zásilku", staffPortal: "Portál personálu",
    globalOffices: "Kontaktujte naše globální kanceláře",
    usHqTitle: "Centrála v USA (Korporátní)",
    usHubTitle: "Logistické centrum v USA (Provoz)",
    euUkTitle: "Provoz Evropa a Velká Británie",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Rychlá, spolehlivá, globální logistika",
    heroPlaceholder: "Zadejte sledovací číslo...", heroButton: "Sledovat",
    liveMap: "Globální mapa tranzitu v reálném čase", footerVersion: "Logistická platforma · v1.1",
  },
};

export default cs;
