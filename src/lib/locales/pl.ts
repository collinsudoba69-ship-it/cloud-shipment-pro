import type { TranslationSchema } from "./en";

const pl: TranslationSchema = {
  nav: { home: "Strona główna", track: "Śledź", services: "Usługi", contact: "Kontakt", dashboard: "Panel", account: "Konto", staffLogin: "Logowanie personelu" },
  hero: {
    badge: "Globalna platforma logistyczna",
    title1: "Wyślij wszędzie.",
    title2: "Śledź wszędzie.",
    subtitle: "Widoczność w czasie rzeczywistym w transporcie lotniczym, morskim i lądowym.",
    placeholder: "Wpisz numer śledzenia (np. CS-2025-04-AB12CD)",
    button: "Śledź",
  },
  stats: { countries: "Obsługiwane kraje", shipments: "Śledzone przesyłki", onTime: "Dostawy na czas", support: "Wsparcie na żywo" },
  services: {
    heading: "Stworzone dla nowoczesnej logistyki",
    sub: "Cztery linie usług, jedna platforma — zaprojektowana dla szybkości, skali i przejrzystości.",
    air: "Fracht lotniczy", airDesc: "Szybki transgraniczny fracht lotniczy z pełną widocznością.",
    sea: "Fracht morski", seaDesc: "Niezawodny transport kontenerowy FCL i LCL.",
    express: "Dostawa ekspresowa", expressDesc: "Dostawa drzwi w drzwi w 1-3 dni.",
    warehousing: "Magazynowanie", warehousingDesc: "Bezpieczne przechowywanie w ponad 40 hubach na świecie.",
  },
  trust: {
    insured: "Ubezpieczone i bezpieczne", insuredDesc: "Każda przesyłka objęta globalnym ubezpieczeniem do $100K.",
    network: "Globalna sieć", networkDesc: "Bezpośrednie partnerstwa z przewoźnikami w ponad 120 krajach.",
    realtime: "Śledzenie w czasie rzeczywistym", realtimeDesc: "Status na żywo, aktualizacje ETA i potwierdzenie dostawy.",
  },
  track: {
    title: "Śledź swoją przesyłkę", subtitle: "Wpisz numer śledzenia, aby zobaczyć status na żywo.",
    placeholder: "CS-2025-04-XXXXXX", button: "Śledź", looking: "Szukamy Twojej przesyłki…",
    notFound: "Numer śledzenia nie znaleziony", notFoundDesc: "Nie znaleziono przesyłki o tym numerze.",
    prompt: "Wpisz numer śledzenia powyżej, aby rozpocząć.",
    trackingNo: "Śledzenie #", progress: "Postęp", from: "Z", to: "Do", eta: "Szacowana dostawa",
    registered: "Zarejestrowano", type: "Typ", express: "Ekspres", fragile: "Delikatne",
    timeline: "Oś czasu przesyłki", noEvents: "Brak wydarzeń.", update: "Aktualizacja",
    images: "Zdjęcia przesyłki / dowodu", tbc: "Do potwierdzenia", language: "Język", badge: "Śledzenie Cloud Shipment",
  },
  status: { queued: "W kolejce", in_transit: "W tranzycie", out_for_delivery: "W doręczeniu", delivered: "Dostarczone" },
  footer: {
    tagline: "Globalna logistyka, uczyniona przejrzystą. Śledź każdą paczkę od źródła do drzwi.",
    services: "Usługi", company: "Firma", contactUs: "Skontaktuj się", support: "Obsługa klienta",
    supportDesc: "Pytania o paczkę? Napisz do nas bezpośrednio.", emailUs: "Wsparcie e-mail",
    legal: "Prawne", privacy: "Polityka prywatności", terms: "Warunki usługi",
    rights: "Wszelkie prawa zastrzeżone.", trackShipment: "Śledź przesyłkę", staffPortal: "Portal personelu",
    globalOffices: "Skontaktuj się z naszymi globalnymi biurami",
    usHqTitle: "Siedziba główna w USA (Korporacyjna)",
    usHubTitle: "Centrum logistyczne w USA (Operacje)",
    euUkTitle: "Operacje Europa i Wielka Brytania",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Szybka, niezawodna, globalna logistyka",
    heroPlaceholder: "Wpisz numer śledzenia...", heroButton: "Śledź teraz",
    liveMap: "Globalna mapa tranzytu na żywo", footerVersion: "Platforma logistyczna · v1.1",
  },
};

export default pl;
