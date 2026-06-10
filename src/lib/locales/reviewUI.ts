// Localized labels for the "Write a review" dialog, form fields, and the
// "See more reviews" toggle. Falls back to English when a language is missing.

export interface ReviewUIStrings {
  writeReview: string;
  shareTitle: string;
  shareDesc: string;
  firstNamePh: string;
  lastInitialPh: string;
  occupationPh: string;
  locationPh: string;
  yourRating: string;
  experiencePh: string;
  postReview: string;
  posting: string;
  deleteMyReview: string;
  confirmDelete: string;
  seeMore: (n: number) => string;
  showLess: string;
}

const en: ReviewUIStrings = {
  writeReview: "Write a review",
  shareTitle: "Share your experience",
  shareDesc: "Your review appears live below and is refreshed the next day.",
  firstNamePh: "First name (e.g. David)",
  lastInitialPh: "W",
  occupationPh: "Occupation (e.g. Retired)",
  locationPh: "City, Country (e.g. Chicago, United States)",
  yourRating: "Your rating:",
  experiencePh: "Tell us about your experience…",
  postReview: "Post review",
  posting: "Posting…",
  deleteMyReview: "Delete my review",
  confirmDelete: "Delete your review?",
  seeMore: (n) => `See more reviews (${n})`,
  showLess: "Show less",
};

const de: ReviewUIStrings = {
  writeReview: "Bewertung schreiben",
  shareTitle: "Teile deine Erfahrung",
  shareDesc: "Deine Bewertung erscheint sofort unten und wird täglich aktualisiert.",
  firstNamePh: "Vorname (z. B. David)",
  lastInitialPh: "W",
  occupationPh: "Beruf (z. B. Rentner)",
  locationPh: "Stadt, Land (z. B. Hamburg, Deutschland)",
  yourRating: "Deine Bewertung:",
  experiencePh: "Erzähle uns von deiner Erfahrung…",
  postReview: "Bewertung senden",
  posting: "Wird gesendet…",
  deleteMyReview: "Meine Bewertung löschen",
  confirmDelete: "Deine Bewertung löschen?",
  seeMore: (n) => `Weitere Bewertungen anzeigen (${n})`,
  showLess: "Weniger anzeigen",
};

const nl: ReviewUIStrings = {
  writeReview: "Schrijf een review",
  shareTitle: "Deel je ervaring",
  shareDesc: "Je review verschijnt meteen hieronder en wordt dagelijks vernieuwd.",
  firstNamePh: "Voornaam (bijv. David)",
  lastInitialPh: "W",
  occupationPh: "Beroep (bijv. Gepensioneerd)",
  locationPh: "Stad, Land (bijv. Amsterdam, Nederland)",
  yourRating: "Jouw beoordeling:",
  experiencePh: "Vertel ons over je ervaring…",
  postReview: "Review plaatsen",
  posting: "Bezig met plaatsen…",
  deleteMyReview: "Mijn review verwijderen",
  confirmDelete: "Je review verwijderen?",
  seeMore: (n) => `Meer reviews bekijken (${n})`,
  showLess: "Minder tonen",
};

const fr: ReviewUIStrings = {
  writeReview: "Laisser un avis",
  shareTitle: "Partagez votre expérience",
  shareDesc: "Votre avis apparaît immédiatement ci-dessous et est actualisé chaque jour.",
  firstNamePh: "Prénom (ex. David)",
  lastInitialPh: "W",
  occupationPh: "Profession (ex. Retraité)",
  locationPh: "Ville, Pays (ex. Paris, France)",
  yourRating: "Votre note :",
  experiencePh: "Parlez-nous de votre expérience…",
  postReview: "Publier l'avis",
  posting: "Publication…",
  deleteMyReview: "Supprimer mon avis",
  confirmDelete: "Supprimer votre avis ?",
  seeMore: (n) => `Voir plus d'avis (${n})`,
  showLess: "Réduire",
};

const es: ReviewUIStrings = {
  writeReview: "Escribir una reseña",
  shareTitle: "Comparte tu experiencia",
  shareDesc: "Tu reseña aparece al instante debajo y se actualiza a diario.",
  firstNamePh: "Nombre (p. ej. David)",
  lastInitialPh: "W",
  occupationPh: "Ocupación (p. ej. Jubilado)",
  locationPh: "Ciudad, País (p. ej. Madrid, España)",
  yourRating: "Tu valoración:",
  experiencePh: "Cuéntanos tu experiencia…",
  postReview: "Publicar reseña",
  posting: "Publicando…",
  deleteMyReview: "Eliminar mi reseña",
  confirmDelete: "¿Eliminar tu reseña?",
  seeMore: (n) => `Ver más reseñas (${n})`,
  showLess: "Mostrar menos",
};

const pt: ReviewUIStrings = {
  writeReview: "Escrever uma avaliação",
  shareTitle: "Partilha a tua experiência",
  shareDesc: "A tua avaliação aparece de imediato abaixo e é atualizada diariamente.",
  firstNamePh: "Nome (ex. David)",
  lastInitialPh: "W",
  occupationPh: "Profissão (ex. Reformado)",
  locationPh: "Cidade, País (ex. Lisboa, Portugal)",
  yourRating: "A tua avaliação:",
  experiencePh: "Conta-nos a tua experiência…",
  postReview: "Publicar avaliação",
  posting: "A publicar…",
  deleteMyReview: "Eliminar a minha avaliação",
  confirmDelete: "Eliminar a tua avaliação?",
  seeMore: (n) => `Ver mais avaliações (${n})`,
  showLess: "Mostrar menos",
};

const ptBR: ReviewUIStrings = {
  ...pt,
  writeReview: "Escrever uma avaliação",
  shareTitle: "Compartilhe sua experiência",
  shareDesc: "Sua avaliação aparece logo abaixo e é atualizada diariamente.",
  firstNamePh: "Nome (ex. David)",
  occupationPh: "Profissão (ex. Aposentado)",
  locationPh: "Cidade, País (ex. São Paulo, Brasil)",
  yourRating: "Sua avaliação:",
  experiencePh: "Conte-nos sobre sua experiência…",
  postReview: "Publicar avaliação",
  posting: "Publicando…",
  deleteMyReview: "Excluir minha avaliação",
  confirmDelete: "Excluir sua avaliação?",
  seeMore: (n) => `Ver mais avaliações (${n})`,
};

const ar: ReviewUIStrings = {
  writeReview: "اكتب مراجعة",
  shareTitle: "شارك تجربتك",
  shareDesc: "تظهر مراجعتك مباشرة أدناه ويتم تحديثها يوميًا.",
  firstNamePh: "الاسم الأول (مثال: داود)",
  lastInitialPh: "W",
  occupationPh: "المهنة (مثال: متقاعد)",
  locationPh: "المدينة، الدولة (مثال: دبي، الإمارات)",
  yourRating: "تقييمك:",
  experiencePh: "أخبرنا عن تجربتك…",
  postReview: "نشر المراجعة",
  posting: "جارٍ النشر…",
  deleteMyReview: "حذف مراجعتي",
  confirmDelete: "حذف مراجعتك؟",
  seeMore: (n) => `عرض المزيد من المراجعات (${n})`,
  showLess: "عرض أقل",
};

const zh: ReviewUIStrings = {
  writeReview: "写评价",
  shareTitle: "分享您的体验",
  shareDesc: "您的评价将立即显示在下方，并每天更新。",
  firstNamePh: "名字（如 David）",
  lastInitialPh: "W",
  occupationPh: "职业（如 退休）",
  locationPh: "城市，国家（如 上海，中国）",
  yourRating: "您的评分：",
  experiencePh: "告诉我们您的体验……",
  postReview: "发布评价",
  posting: "发布中……",
  deleteMyReview: "删除我的评价",
  confirmDelete: "删除您的评价？",
  seeMore: (n) => `查看更多评价（${n}）`,
  showLess: "收起",
};

const ja: ReviewUIStrings = {
  writeReview: "レビューを書く",
  shareTitle: "ご感想をお聞かせください",
  shareDesc: "ご投稿は下にすぐ表示され、毎日更新されます。",
  firstNamePh: "名前（例: David）",
  lastInitialPh: "W",
  occupationPh: "職業（例: 退職）",
  locationPh: "都市、国（例: 東京、日本）",
  yourRating: "評価：",
  experiencePh: "ご体験についてお聞かせください…",
  postReview: "レビューを投稿",
  posting: "投稿中…",
  deleteMyReview: "自分のレビューを削除",
  confirmDelete: "レビューを削除しますか？",
  seeMore: (n) => `さらにレビューを見る（${n}）`,
  showLess: "閉じる",
};

const ko: ReviewUIStrings = {
  writeReview: "리뷰 작성",
  shareTitle: "경험을 공유해 주세요",
  shareDesc: "리뷰는 아래에 바로 표시되며 매일 갱신됩니다.",
  firstNamePh: "이름 (예: David)",
  lastInitialPh: "W",
  occupationPh: "직업 (예: 은퇴)",
  locationPh: "도시, 국가 (예: 서울, 대한민국)",
  yourRating: "평점:",
  experiencePh: "경험을 알려주세요…",
  postReview: "리뷰 게시",
  posting: "게시 중…",
  deleteMyReview: "내 리뷰 삭제",
  confirmDelete: "리뷰를 삭제할까요?",
  seeMore: (n) => `리뷰 더 보기 (${n})`,
  showLess: "접기",
};

const ru: ReviewUIStrings = {
  writeReview: "Написать отзыв",
  shareTitle: "Поделитесь впечатлениями",
  shareDesc: "Ваш отзыв появится ниже сразу и обновляется ежедневно.",
  firstNamePh: "Имя (например, David)",
  lastInitialPh: "W",
  occupationPh: "Род занятий (например, Пенсионер)",
  locationPh: "Город, Страна (например, Москва, Россия)",
  yourRating: "Ваша оценка:",
  experiencePh: "Расскажите о вашем опыте…",
  postReview: "Опубликовать отзыв",
  posting: "Публикация…",
  deleteMyReview: "Удалить мой отзыв",
  confirmDelete: "Удалить ваш отзыв?",
  seeMore: (n) => `Показать больше отзывов (${n})`,
  showLess: "Свернуть",
};

const tr: ReviewUIStrings = {
  writeReview: "Yorum yaz",
  shareTitle: "Deneyiminizi paylaşın",
  shareDesc: "Yorumunuz anında aşağıda görünür ve her gün yenilenir.",
  firstNamePh: "Ad (ör. David)",
  lastInitialPh: "W",
  occupationPh: "Meslek (ör. Emekli)",
  locationPh: "Şehir, Ülke (ör. İstanbul, Türkiye)",
  yourRating: "Puanınız:",
  experiencePh: "Deneyiminizi anlatın…",
  postReview: "Yorumu gönder",
  posting: "Gönderiliyor…",
  deleteMyReview: "Yorumumu sil",
  confirmDelete: "Yorumunuzu silmek istiyor musunuz?",
  seeMore: (n) => `Daha fazla yorum gör (${n})`,
  showLess: "Daha az göster",
};

const pl: ReviewUIStrings = {
  writeReview: "Napisz opinię",
  shareTitle: "Podziel się doświadczeniem",
  shareDesc: "Twoja opinia pojawia się od razu poniżej i jest odświeżana codziennie.",
  firstNamePh: "Imię (np. David)",
  lastInitialPh: "W",
  occupationPh: "Zawód (np. Emeryt)",
  locationPh: "Miasto, Kraj (np. Warszawa, Polska)",
  yourRating: "Twoja ocena:",
  experiencePh: "Opowiedz nam o swoim doświadczeniu…",
  postReview: "Opublikuj opinię",
  posting: "Publikowanie…",
  deleteMyReview: "Usuń moją opinię",
  confirmDelete: "Usunąć twoją opinię?",
  seeMore: (n) => `Zobacz więcej opinii (${n})`,
  showLess: "Pokaż mniej",
};

const sv: ReviewUIStrings = {
  writeReview: "Skriv en recension",
  shareTitle: "Dela din upplevelse",
  shareDesc: "Din recension visas direkt nedan och uppdateras dagligen.",
  firstNamePh: "Förnamn (t.ex. David)",
  lastInitialPh: "W",
  occupationPh: "Yrke (t.ex. Pensionär)",
  locationPh: "Stad, Land (t.ex. Stockholm, Sverige)",
  yourRating: "Ditt betyg:",
  experiencePh: "Berätta om din upplevelse…",
  postReview: "Publicera recension",
  posting: "Publicerar…",
  deleteMyReview: "Ta bort min recension",
  confirmDelete: "Ta bort din recension?",
  seeMore: (n) => `Visa fler recensioner (${n})`,
  showLess: "Visa mindre",
};

const map: Record<string, ReviewUIStrings> = {
  en, "en-US": en, "en-GB": en,
  de, nl, fr, es, pt, "pt-BR": ptBR, "pt-PT": pt,
  ar, zh, ja, ko, ru, tr, pl, sv,
  // Sensible fallbacks for related languages
  no: sv, da: sv, fi: en, it: es, ro: fr, cs: pl, hu: de,
  el: en, uk: ru, hi: en,
};

export function getReviewUIStrings(lang: string): ReviewUIStrings {
  return map[lang] ?? map[lang.split("-")[0]] ?? en;
}
