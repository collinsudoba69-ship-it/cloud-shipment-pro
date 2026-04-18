import type { TranslationSchema } from "./en";

const hi: TranslationSchema = {
  nav: { home: "होम", track: "ट्रैक", services: "सेवाएं", contact: "संपर्क", dashboard: "डैशबोर्ड", account: "खाता", staffLogin: "स्टाफ लॉगिन" },
  hero: {
    badge: "वैश्विक लॉजिस्टिक्स प्लेटफॉर्म",
    title1: "कहीं भी भेजें।",
    title2: "हर जगह ट्रैक करें।",
    subtitle: "हवाई, समुद्री और जमीनी परिवहन में रीयल-टाइम दृश्यता।",
    placeholder: "ट्रैकिंग नंबर दर्ज करें (जैसे CS-2025-04-AB12CD)",
    button: "ट्रैक करें",
  },
  stats: { countries: "सेवित देश", shipments: "ट्रैक की गई शिपमेंट", onTime: "समय पर डिलीवरी", support: "लाइव सहायता" },
  services: {
    heading: "आधुनिक लॉजिस्टिक्स के लिए बनाया गया",
    sub: "चार सेवा लाइनें, एक प्लेटफॉर्म — गति, पैमाने और पारदर्शिता के लिए डिज़ाइन किया गया।",
    air: "एयर फ्रेट", airDesc: "पूर्ण दृश्यता के साथ तेज़ सीमा-पार एयर कार्गो।",
    sea: "सी फ्रेट", seaDesc: "FCL और LCL लोड के लिए विश्वसनीय कंटेनर शिपिंग।",
    express: "एक्सप्रेस डिलीवरी", expressDesc: "1-3 दिनों में डोर-टू-डोर डिलीवरी।",
    warehousing: "वेयरहाउसिंग", warehousingDesc: "दुनिया भर में 40+ हब में सुरक्षित भंडारण।",
  },
  trust: {
    insured: "बीमाकृत और सुरक्षित", insuredDesc: "$100K तक के वैश्विक कार्गो बीमा द्वारा कवर हर शिपमेंट।",
    network: "विश्वव्यापी नेटवर्क", networkDesc: "120+ देशों में वाहकों के साथ प्रत्यक्ष साझेदारी।",
    realtime: "रीयल-टाइम ट्रैकिंग", realtimeDesc: "लाइव स्थिति, ETA अपडेट और डिलीवरी का प्रमाण।",
  },
  track: {
    title: "अपनी शिपमेंट ट्रैक करें", subtitle: "लाइव स्थिति देखने के लिए अपना ट्रैकिंग नंबर दर्ज करें।",
    placeholder: "CS-2025-04-XXXXXX", button: "ट्रैक करें", looking: "आपकी शिपमेंट खोजी जा रही है…",
    notFound: "ट्रैकिंग नंबर नहीं मिला", notFoundDesc: "उस ट्रैकिंग नंबर से कोई शिपमेंट नहीं मिली।",
    prompt: "शुरू करने के लिए ऊपर ट्रैकिंग नंबर दर्ज करें।",
    trackingNo: "ट्रैकिंग #", progress: "प्रगति", from: "से", to: "तक", eta: "अनुमानित डिलीवरी",
    registered: "पंजीकृत", type: "प्रकार", express: "एक्सप्रेस", fragile: "नाज़ुक",
    timeline: "शिपमेंट टाइमलाइन", noEvents: "अभी तक कोई घटना नहीं।", update: "अपडेट",
    images: "शिपमेंट / प्रमाण छवियां", tbc: "पुष्टि की जानी है", language: "भाषा", badge: "Cloud Shipment ट्रैकिंग",
  },
  status: { queued: "कतार में", in_transit: "पारगमन में", out_for_delivery: "डिलीवरी के लिए निकला", delivered: "वितरित" },
  footer: {
    tagline: "वैश्विक लॉजिस्टिक्स, पारदर्शी बनाया गया। हर पैकेज को मूल से दरवाजे तक ट्रैक करें।",
    services: "सेवाएं", company: "कंपनी", contactUs: "हमसे संपर्क करें", support: "ग्राहक सहायता",
    supportDesc: "किसी पैकेज के बारे में प्रश्न? सीधे ईमेल करें।", emailUs: "ईमेल सहायता",
    legal: "कानूनी", privacy: "गोपनीयता नीति", terms: "सेवा की शर्तें",
    rights: "सर्वाधिकार सुरक्षित।", trackShipment: "शिपमेंट ट्रैक करें", staffPortal: "स्टाफ पोर्टल",
    globalOffices: "हमारे वैश्विक कार्यालयों से संपर्क करें",
    usHqTitle: "संयुक्त राज्य मुख्यालय (कॉर्पोरेट)",
    usHubTitle: "संयुक्त राज्य लॉजिस्टिक्स हब (परिचालन)",
    euUkTitle: "यूरोप और यूके परिचालन",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "तेज़, विश्वसनीय, वैश्विक लॉजिस्टिक्स",
    heroPlaceholder: "ट्रैकिंग नंबर दर्ज करें...", heroButton: "अभी ट्रैक करें",
    liveMap: "वैश्विक लाइव ट्रांज़िट मानचित्र", footerVersion: "लॉजिस्टिक्स प्लेटफॉर्म · v1.1",
  },
};

export default hi;
