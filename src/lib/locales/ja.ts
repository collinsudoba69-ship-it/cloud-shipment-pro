import type { TranslationSchema } from "./en";

const ja: TranslationSchema = {
  nav: { home: "ホーム", track: "追跡", services: "サービス", contact: "お問い合わせ", dashboard: "ダッシュボード", account: "アカウント", staffLogin: "スタッフログイン" },
  hero: {
    badge: "グローバル物流プラットフォーム",
    title1: "どこへでも発送。",
    title2: "どこでも追跡。",
    subtitle: "航空・海上・陸上のリアルタイム可視化を提供。",
    placeholder: "追跡番号を入力 (例: CS-2025-04-AB12CD)",
    button: "追跡",
  },
  stats: { countries: "対応国", shipments: "追跡済み貨物", onTime: "定時配送", support: "ライブサポート" },
  services: {
    heading: "現代の物流のために構築",
    sub: "4つのサービスライン、1つのプラットフォーム — スピード、規模、透明性のために設計。",
    air: "航空貨物", airDesc: "完全な可視化を備えた高速国際航空貨物。",
    sea: "海上貨物", seaDesc: "FCLおよびLCL貨物向けの信頼性の高いコンテナ輸送。",
    express: "速達配送", expressDesc: "1〜3日のドアツードア配送。",
    warehousing: "倉庫保管", warehousingDesc: "世界40以上の拠点で安全な保管。",
  },
  trust: {
    insured: "保険付きで安全", insuredDesc: "各貨物は最大$100Kの世界的な貨物保険でカバーされます。",
    network: "世界中のネットワーク", networkDesc: "120以上の国の運送業者との直接提携。",
    realtime: "リアルタイム追跡", realtimeDesc: "ライブステータス、ETA更新、配達証明。",
  },
  track: {
    title: "貨物を追跡", subtitle: "ライブステータスを表示するには追跡番号を入力してください。",
    placeholder: "CS-2025-04-XXXXXX", button: "追跡", looking: "貨物を検索中…",
    notFound: "追跡番号が見つかりません", notFoundDesc: "その追跡番号の貨物が見つかりませんでした。",
    prompt: "開始するには上の追跡番号を入力してください。",
    trackingNo: "追跡 #", progress: "進捗", from: "発送元", to: "宛先", eta: "予定配達",
    registered: "登録日", type: "タイプ", express: "速達", fragile: "壊れ物",
    timeline: "貨物タイムライン", noEvents: "まだイベントはありません。", update: "更新",
    images: "貨物 / 証明画像", tbc: "確認待ち", language: "言語", badge: "Cloud Shipment 追跡",
  },
  status: { queued: "待機中", in_transit: "輸送中", out_for_delivery: "配達中", delivered: "配達済み" },
  footer: {
    tagline: "グローバル物流を透明に。すべての荷物を発送元から玄関まで追跡。",
    services: "サービス", company: "会社", contactUs: "お問い合わせ", support: "カスタマーサポート",
    supportDesc: "荷物について質問は？直接メールでお問い合わせください。", emailUs: "メールサポート",
    legal: "法的", privacy: "プライバシーポリシー", terms: "利用規約",
    rights: "All rights reserved.", trackShipment: "貨物を追跡", staffPortal: "スタッフポータル",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "高速で信頼性の高いグローバル物流",
    heroPlaceholder: "追跡番号を入力...", heroButton: "今すぐ追跡",
    liveMap: "グローバル ライブ トランジット マップ", footerVersion: "物流プラットフォーム · v1.1",
  },
};

export default ja;
