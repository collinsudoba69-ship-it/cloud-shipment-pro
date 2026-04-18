import type { TranslationSchema } from "./en";

const tr: TranslationSchema = {
  nav: { home: "Ana Sayfa", track: "Takip", services: "Hizmetler", contact: "İletişim", dashboard: "Panel", account: "Hesap", staffLogin: "Personel Girişi" },
  hero: {
    badge: "Küresel lojistik platformu",
    title1: "Her yere gönderin.",
    title2: "Her yerden takip edin.",
    subtitle: "Hava, deniz ve karada gerçek zamanlı görünürlük.",
    placeholder: "Takip numarası girin (ör. CS-2025-04-AB12CD)",
    button: "Takip Et",
  },
  stats: { countries: "Hizmet verilen ülkeler", shipments: "Takip edilen gönderiler", onTime: "Zamanında teslimat", support: "Canlı destek" },
  services: {
    heading: "Modern lojistik için tasarlandı",
    sub: "Dört hizmet hattı, tek platform — hız, ölçek ve şeffaflık için tasarlandı.",
    air: "Hava Kargo", airDesc: "Tam görünürlüklü hızlı sınır ötesi hava kargo.",
    sea: "Deniz Kargo", seaDesc: "FCL ve LCL yükler için güvenilir konteyner taşımacılığı.",
    express: "Ekspres Teslimat", expressDesc: "1-3 günde kapıdan kapıya teslimat.",
    warehousing: "Depolama", warehousingDesc: "Dünya çapında 40+ merkezde güvenli depolama.",
  },
  trust: {
    insured: "Sigortalı ve güvenli", insuredDesc: "Her gönderi $100K'ya kadar küresel kargo sigortası ile kapsanır.",
    network: "Dünya çapında ağ", networkDesc: "120+ ülkede taşıyıcılarla doğrudan ortaklıklar.",
    realtime: "Gerçek zamanlı takip", realtimeDesc: "Canlı durum, ETA güncellemeleri ve teslim kanıtı.",
  },
  track: {
    title: "Gönderinizi takip edin", subtitle: "Canlı durumu görmek için takip numaranızı girin.",
    placeholder: "CS-2025-04-XXXXXX", button: "Takip Et", looking: "Gönderiniz aranıyor…",
    notFound: "Takip numarası bulunamadı", notFoundDesc: "Bu takip numarasıyla gönderi bulunamadı.",
    prompt: "Başlamak için yukarıya bir takip numarası girin.",
    trackingNo: "Takip #", progress: "İlerleme", from: "Nereden", to: "Nereye", eta: "Tahmini teslimat",
    registered: "Kayıt tarihi", type: "Tür", express: "Ekspres", fragile: "Kırılgan",
    timeline: "Gönderi zaman çizelgesi", noEvents: "Henüz etkinlik yok.", update: "Güncelleme",
    images: "Gönderi / kanıt görselleri", tbc: "Onaylanacak", language: "Dil", badge: "Cloud Shipment Takip",
  },
  status: { queued: "Sırada", in_transit: "Taşınıyor", out_for_delivery: "Dağıtımda", delivered: "Teslim edildi" },
  footer: {
    tagline: "Küresel lojistik, şeffaf hale getirildi. Her paketi kaynaktan kapıya kadar takip edin.",
    services: "Hizmetler", company: "Şirket", contactUs: "Bize ulaşın", support: "Müşteri desteği",
    supportDesc: "Bir paket hakkında sorularınız mı var? Doğrudan e-posta gönderin.", emailUs: "E-posta desteği",
    legal: "Yasal", privacy: "Gizlilik Politikası", terms: "Hizmet Şartları",
    rights: "Tüm hakları saklıdır.", trackShipment: "Gönderi Takip", staffPortal: "Personel Portalı",
    globalOffices: "Küresel ofislerimizle iletişime geçin",
    usHqTitle: "Amerika Birleşik Devletleri Genel Merkezi (Kurumsal)",
    usHubTitle: "ABD Lojistik Merkezi (Operasyonlar)",
    euUkTitle: "Avrupa ve Birleşik Krallık Operasyonları",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "Hızlı, güvenilir, küresel lojistik",
    heroPlaceholder: "Takip numarası girin...", heroButton: "Şimdi takip et",
    liveMap: "Küresel canlı transit haritası", footerVersion: "Lojistik platformu · v1.1",
  },
};

export default tr;
