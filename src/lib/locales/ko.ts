import type { TranslationSchema } from "./en";

const ko: TranslationSchema = {
  nav: { home: "홈", track: "추적", services: "서비스", contact: "문의", dashboard: "대시보드", account: "계정", staffLogin: "직원 로그인" },
  hero: {
    badge: "글로벌 물류 플랫폼",
    title1: "어디로든 배송.",
    title2: "어디서든 추적.",
    subtitle: "항공, 해상, 육상 실시간 가시성을 제공합니다.",
    placeholder: "추적 번호 입력 (예: CS-2025-04-AB12CD)",
    button: "추적",
  },
  stats: { countries: "서비스 국가", shipments: "추적된 배송", onTime: "정시 배송", support: "실시간 지원" },
  services: {
    heading: "현대 물류를 위해 설계",
    sub: "4개의 서비스 라인, 하나의 플랫폼 — 속도, 규모, 투명성을 위해 설계되었습니다.",
    air: "항공 화물", airDesc: "완전한 가시성을 갖춘 빠른 국경 간 항공 화물.",
    sea: "해상 화물", seaDesc: "FCL 및 LCL 화물을 위한 신뢰할 수 있는 컨테이너 운송.",
    express: "특급 배송", expressDesc: "1-3일 내 도어 투 도어 배송.",
    warehousing: "창고", warehousingDesc: "전 세계 40개 이상 허브에서 안전한 보관.",
  },
  trust: {
    insured: "보험 가입 및 안전", insuredDesc: "모든 배송은 최대 $100K의 글로벌 화물 보험으로 보장됩니다.",
    network: "전 세계 네트워크", networkDesc: "120개 이상 국가의 운송업체와 직접 파트너십.",
    realtime: "실시간 추적", realtimeDesc: "실시간 상태, ETA 업데이트 및 배송 증명.",
  },
  track: {
    title: "배송 추적", subtitle: "실시간 상태를 보려면 추적 번호를 입력하세요.",
    placeholder: "CS-2025-04-XXXXXX", button: "추적", looking: "배송 조회 중…",
    notFound: "추적 번호를 찾을 수 없습니다", notFoundDesc: "해당 추적 번호로 배송을 찾을 수 없습니다.",
    prompt: "시작하려면 위에 추적 번호를 입력하세요.",
    trackingNo: "추적 #", progress: "진행", from: "출발지", to: "도착지", eta: "예상 배송",
    registered: "등록일", type: "유형", express: "특급", fragile: "취급주의",
    timeline: "배송 타임라인", noEvents: "아직 이벤트가 없습니다.", update: "업데이트",
    images: "배송 / 증명 이미지", tbc: "확인 예정", language: "언어", badge: "Cloud Shipment 추적",
  },
  status: { queued: "대기 중", in_transit: "운송 중", out_for_delivery: "배송 중", delivered: "배송 완료" },
  footer: {
    tagline: "투명한 글로벌 물류. 모든 패키지를 출발지에서 문 앞까지 추적하세요.",
    services: "서비스", company: "회사", contactUs: "문의하기", support: "고객 지원",
    supportDesc: "패키지에 대한 질문이 있으신가요? 직접 이메일을 보내주세요.", emailUs: "이메일 지원",
    legal: "법적", privacy: "개인정보 처리방침", terms: "서비스 약관",
    rights: "모든 권리 보유.", trackShipment: "배송 추적", staffPortal: "직원 포털",
    globalOffices: "글로벌 사무소에 문의하기",
    usHqTitle: "미국 본사 (법인)",
    usHubTitle: "미국 물류 허브 (운영)",
    euUkTitle: "유럽 및 영국 운영",
  },
  home: {
    heroTitle: "Cloud Shipment", heroSubtitle: "빠르고 안정적인 글로벌 물류",
    heroPlaceholder: "추적 번호 입력...", heroButton: "지금 추적",
    liveMap: "글로벌 실시간 운송 지도", footerVersion: "물류 플랫폼 · v1.1",
  },
};

export default ko;
