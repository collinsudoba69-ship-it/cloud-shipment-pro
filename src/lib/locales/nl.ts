import type { TranslationSchema } from "./en";

const nl: TranslationSchema = {
  nav: { home: "Home", track: "Volgen", services: "Diensten", contact: "Contact", dashboard: "Dashboard", account: "Account", staffLogin: "Personeel login" },
  hero: {
    badge: "Wereldwijd logistiek platform",
    title1: "Verzend overal heen.",
    title2: "Volg overal.",
    subtitle: "Realtime zicht op lucht, zee en land voor bedrijven die de wereld verplaatsen.",
    placeholder: "Voer trackingnummer in (bijv. CS-2025-04-AB12CD)",
    button: "Volgen",
  },
  stats: { countries: "Landen bediend", shipments: "Gevolgde zendingen", onTime: "Op tijd geleverd", support: "Live ondersteuning" },
  services: {
    heading: "Gebouwd voor moderne logistiek",
    sub: "Vier dienstlijnen, één platform — ontworpen voor snelheid, schaal en transparantie.",
    air: "Luchtvracht", airDesc: "Snelle grensoverschrijdende luchtvracht met volledige zichtbaarheid.",
    sea: "Zeevracht", seaDesc: "Betrouwbaar containervervoer voor FCL- en LCL-ladingen.",
    express: "Expreslevering", expressDesc: "Tijdkritische deur-tot-deur levering in 1-3 dagen.",
    warehousing: "Opslag", warehousingDesc: "Veilige opslag en fulfilment in 40+ hubs wereldwijd.",
  },
  trust: {
    insured: "Verzekerd en veilig", insuredDesc: "Elke zending gedekt door wereldwijde vrachtverzekering tot $100K.",
    network: "Wereldwijd netwerk", networkDesc: "Directe partnerschappen met vervoerders in 120+ landen.",
    realtime: "Realtime volgen", realtimeDesc: "Live status, ETA-updates en leveringsbewijs bij elke mijlpaal.",
  },
  track: {
    title: "Volg je zending", subtitle: "Voer je trackingnummer in om de livestatus te zien.",
    placeholder: "CS-2025-04-XXXXXX", button: "Volgen", looking: "We zoeken je zending…",
    notFound: "Trackingnummer niet gevonden", notFoundDesc: "Geen zending gevonden met dat nummer.",
    prompt: "Voer hierboven een trackingnummer in om te beginnen.",
    trackingNo: "Tracking #", progress: "Voortgang", from: "Van", to: "Naar", eta: "Geschatte levering",
    registered: "Geregistreerd op", type: "Type", express: "Expres", fragile: "Breekbaar",
    timeline: "Tijdlijn zending", noEvents: "Nog geen tijdlijngebeurtenissen.", update: "Update",
    images: "Zending- / bewijsafbeeldingen", tbc: "Te bevestigen", language: "Taal", badge: "Cloud Shipment volgen",
  },
  status: { queued: "In wachtrij", in_transit: "Onderweg", out_for_delivery: "Onderweg voor levering", delivered: "Geleverd" },
  footer: {
    tagline: "Wereldwijde logistiek, transparant gemaakt. Volg elk pakket van oorsprong tot voordeur.",
    services: "Diensten", company: "Bedrijf", contactUs: "Neem contact op", support: "Klantenservice",
    supportDesc: "Vragen over een pakket? Mail ons direct.", emailUs: "E-mail ondersteuning",
    legal: "Juridisch", privacy: "Privacybeleid", terms: "Gebruiksvoorwaarden",
    rights: "Alle rechten voorbehouden.", trackShipment: "Zending volgen", staffPortal: "Personeelsportaal",
    globalOffices: "Neem contact op met onze wereldwijde kantoren",
    usHqTitle: "Hoofdkantoor Verenigde Staten (Bedrijf)",
    usHubTitle: "Logistiek centrum VS (Operations)",
    euUkTitle: "Europa & VK-operaties",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Snelle, betrouwbare, wereldwijde logistiek",
    heroPlaceholder: "Voer trackingnummer in...", heroButton: "Nu volgen",
    liveMap: "Wereldwijde live transitkaart", footerVersion: "Logistiek platform · v1.1",
  },
};

export default nl;
