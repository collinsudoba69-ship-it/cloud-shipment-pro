import type { TranslationSchema } from "./en";

const hu: TranslationSchema = {
  nav: { home: "Főoldal", track: "Követés", services: "Szolgáltatások", contact: "Kapcsolat", dashboard: "Irányítópult", account: "Fiók", staffLogin: "Munkatársi belépés" },
  hero: {
    badge: "Globális logisztikai platform",
    title1: "Küldjön bárhova.",
    title2: "Kövesse mindenhol.",
    subtitle: "Valós idejű láthatóság légi, tengeri és szárazföldi szállításnál.",
    placeholder: "Adja meg a követési számot (pl. CS-2025-04-AB12CD)",
    button: "Követés",
  },
  stats: { countries: "Kiszolgált országok", shipments: "Követett küldemények", onTime: "Időben szállítva", support: "Élő támogatás" },
  services: {
    heading: "Modern logisztikára tervezve",
    sub: "Négy szolgáltatási vonal, egy platform — sebességre, méretre és átláthatóságra tervezve.",
    air: "Légi szállítás", airDesc: "Gyors határokon átívelő légi áru, teljes láthatósággal.",
    sea: "Tengeri szállítás", seaDesc: "Megbízható konténeres szállítás FCL és LCL terheléshez.",
    express: "Expressz kézbesítés", expressDesc: "Időkritikus házhoz szállítás 1-3 nap alatt.",
    warehousing: "Raktározás", warehousingDesc: "Biztonságos tárolás 40+ központban világszerte.",
  },
  trust: {
    insured: "Biztosított és biztonságos", insuredDesc: "Minden küldemény globális biztosítással $100K-ig.",
    network: "Világméretű hálózat", networkDesc: "Közvetlen partnerségek 120+ országban.",
    realtime: "Valós idejű követés", realtimeDesc: "Élő státusz, ETA frissítések és kézbesítési igazolás.",
  },
  track: {
    title: "Kövesse küldeményét", subtitle: "Adja meg követési számát az élő státusz megtekintéséhez.",
    placeholder: "CS-2025-04-XXXXXX", button: "Követés", looking: "Küldemény keresése…",
    notFound: "Követési szám nem található", notFoundDesc: "Nem található küldemény ezzel a számmal.",
    prompt: "Adjon meg egy követési számot a kezdéshez.",
    trackingNo: "Követés #", progress: "Folyamat", from: "Honnan", to: "Hová", eta: "Becsült kézbesítés",
    registered: "Regisztrálva", type: "Típus", express: "Expressz", fragile: "Törékeny",
    timeline: "Küldemény idővonala", noEvents: "Még nincsenek események.", update: "Frissítés",
    images: "Küldemény / bizonyíték képek", tbc: "Megerősítendő", language: "Nyelv", badge: "Cloud Shipment követés",
  },
  status: { queued: "Várólistán", in_transit: "Úton", out_for_delivery: "Kézbesítés alatt", delivered: "Kézbesítve" },
  footer: {
    tagline: "Globális logisztika, átláthatóan. Kövesse minden csomagját az indulástól a kézbesítésig.",
    services: "Szolgáltatások", company: "Vállalat", contactUs: "Lépjen kapcsolatba", support: "Ügyfélszolgálat",
    supportDesc: "Kérdése van egy csomagról? Írjon nekünk közvetlenül.", emailUs: "E-mail támogatás",
    legal: "Jogi", privacy: "Adatvédelmi szabályzat", terms: "Felhasználási feltételek",
    rights: "Minden jog fenntartva.", trackShipment: "Küldemény követése", staffPortal: "Munkatársi portál",
    globalOffices: "Lépjen kapcsolatba globális irodáinkkal",
    usHqTitle: "Egyesült Államok központja (Vállalati)",
    usHubTitle: "USA logisztikai központ (Műveletek)",
    euUkTitle: "Európa és az Egyesült Királyság műveletek",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Gyors, megbízható, globális logisztika",
    heroPlaceholder: "Adja meg a követési számot...", heroButton: "Követés most",
    liveMap: "Globális élő tranzittérkép", footerVersion: "Logisztikai platform · v1.1",
  },
};

export default hu;
