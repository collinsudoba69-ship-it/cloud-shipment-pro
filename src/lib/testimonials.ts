// Localized testimonial pool with daily rotation.
import { getReviewStrings, type ReviewStrings } from "./locales/reviews";

export interface Review {
  name: string;
  role: string;        // already plain text — kept neutral
  location: string;    // proper nouns — kept as-is across languages
  rating: number;
  text: string;
  initials: string;
}

const FIRST_NAMES = [
  "Sarah","James","Aisha","Liam","Maria","David","Fatima","Kwame","Emily","Hiroshi",
  "Sophie","Carlos","Priya","Ahmed","Olivia","Pierre","Grace","Marcus","Isabella","Benjamin",
  "Chloe","Tunde","Natalia","Lucas","Amara","Noah","Zara","Ethan","Layla","Mason",
  "Yuki","Ravi","Elena","Omar","Hannah","Diego","Mia","Samuel","Nia","Thabo",
  "Anika","Mateo","Leila","Jonas","Ingrid","Felix","Adaeze","Hugo","Camille","Arjun",
  "Sienna","Kofi","Anya","Rashid","Bianca","Sven","Amira","Tomás","Yara","Henrik",
  "Zainab","Oscar","Lucia","Idris","Astrid","Theo","Nadia","Jamal","Esme","Mohammed",
  "Linnea","Pablo","Nora","Sebastián","Imani","Viktor","Rania","Daniel","Sade","Kenji",
  "Lila","Andre","Maya","Stefan","Halima","Renata","Joel","Saoirse","Alex","Beatriz",
  "Ibrahim","Tara","Niko","Aaliyah","Mateusz","Solange","Kai","Dilan","Femi","Anna",
];

const LAST_INITIALS = ["M","O","B","C","G","T","S","P","K","R","L","D","N","H","F","A","W","Q","V","Z"];

// Roles per language so they translate too
const ROLES_BY_LANG: Record<string, string[]> = {
  en: ["Small Business Owner","E-commerce Seller","Online Retailer","Importer","Exporter","Frequent Sender","Logistics Manager","Boutique Owner","Etsy Seller","Antique Dealer","Wine Exporter","Coffee Exporter","Beauty Brand Founder","Fashion Designer","Subscription Box Owner","Tech Reseller","Wholesaler","Crafts Seller","Fine Art Dealer","Drop-shipper","Marketplace Seller","Auto Parts Trader","Jewelry Designer","Vintage Collector","Frequent Buyer","Bookseller","Pharmacy Owner","Toy Importer","Sneaker Reseller","Home Decor Seller","Spice Trader","Textile Trader","Skincare Founder","Streetwear Brand","Print-on-demand Seller"],
  de: ["Kleinunternehmer","E-Commerce-Verkäufer","Online-Händler","Importeur","Exporteur","Stammkunde","Logistikleiter","Boutique-Besitzer","Etsy-Verkäufer","Antiquitätenhändler","Weinexporteur","Kaffeeexporteur","Beauty-Gründer","Modedesigner","Abo-Box-Inhaber","Tech-Wiederverkäufer","Großhändler","Handwerksverkäufer","Kunsthändler","Dropshipper","Marktplatz-Verkäufer","Autoteilehändler","Schmuckdesigner","Vintage-Sammler","Stammkäufer","Buchhändler","Apothekenbesitzer","Spielzeugimporteur","Sneaker-Wiederverkäufer","Wohndeko-Verkäufer","Gewürzhändler","Textilhändler","Hautpflege-Gründer","Streetwear-Marke","Print-on-Demand-Verkäufer"],
  fr: ["Petit entrepreneur","Vendeur e-commerce","Détaillant en ligne","Importateur","Exportateur","Expéditeur fréquent","Responsable logistique","Propriétaire de boutique","Vendeur Etsy","Antiquaire","Exportateur de vin","Exportateur de café","Fondatrice beauté","Créateur de mode","Propriétaire de box","Revendeur tech","Grossiste","Vendeur d'artisanat","Marchand d'art","Drop-shipper","Vendeur marketplace","Marchand d'auto-pièces","Créateur de bijoux","Collectionneur vintage","Acheteur fréquent","Libraire","Propriétaire de pharmacie","Importateur de jouets","Revendeur sneakers","Vendeur déco maison","Marchand d'épices","Marchand de textiles","Fondateur skincare","Marque streetwear","Vendeur print-on-demand"],
  es: ["Pequeño empresario","Vendedor e-commerce","Minorista online","Importador","Exportador","Remitente frecuente","Gerente de logística","Dueño de boutique","Vendedor Etsy","Anticuario","Exportador de vino","Exportador de café","Fundadora de belleza","Diseñador de moda","Dueño de subscription box","Revendedor tech","Mayorista","Vendedor de artesanía","Marchante de arte","Drop-shipper","Vendedor de marketplace","Comerciante de autopartes","Diseñador de joyas","Coleccionista vintage","Comprador frecuente","Librero","Dueño de farmacia","Importador de juguetes","Revendedor de sneakers","Vendedor de decoración","Comerciante de especias","Comerciante textil","Fundador skincare","Marca streetwear","Vendedor print-on-demand"],
  pt: ["Pequeno empresário","Vendedor e-commerce","Retalhista online","Importador","Exportador","Remetente frequente","Gestor de logística","Dono de boutique","Vendedor Etsy","Antiquário","Exportador de vinho","Exportador de café","Fundadora de beleza","Designer de moda","Dono de subscription box","Revendedor de tecnologia","Grossista","Vendedor de artesanato","Marchand de arte","Drop-shipper","Vendedor de marketplace","Comerciante de autopeças","Designer de joias","Colecionador vintage","Comprador frequente","Livreiro","Dono de farmácia","Importador de brinquedos","Revendedor de sneakers","Vendedor de decoração","Comerciante de especiarias","Comerciante têxtil","Fundador skincare","Marca streetwear","Vendedor print-on-demand"],
  ar: ["صاحب عمل صغير","بائع تجارة إلكترونية","تاجر تجزئة عبر الإنترنت","مستورد","مصدّر","مرسل دائم","مدير لوجستيات","صاحب بوتيك","بائع Etsy","تاجر تحف","مصدّر نبيذ","مصدّر قهوة","مؤسسة علامة جمال","مصمم أزياء","صاحب صندوق اشتراك","موزّع تقنية","تاجر جملة","بائع حرف يدوية","تاجر فنون","دروبشيبر","بائع في الأسواق الإلكترونية","تاجر قطع غيار سيارات","مصمم مجوهرات","جامع قطع كلاسيكية","مشتري دائم","بائع كتب","صاحب صيدلية","مستورد ألعاب","موزّع أحذية رياضية","بائع ديكور منزلي","تاجر بهارات","تاجر منسوجات","مؤسس علامة عناية بالبشرة","علامة ستريت وير","بائع طباعة عند الطلب"],
  zh: ["小企业主","电商卖家","线上零售商","进口商","出口商","常用寄件人","物流经理","精品店店主","Etsy 卖家","古董商","葡萄酒出口商","咖啡出口商","美妆品牌创始人","时装设计师","订阅盒主理人","科技产品分销商","批发商","手工艺品卖家","艺术品经销商","代发货商","市场卖家","汽车配件商","珠宝设计师","复古收藏家","常客","书商","药店店主","玩具进口商","球鞋分销商","家居装饰卖家","香料商","纺织品商","护肤品创始人","街头服饰品牌","按需印刷卖家"],
  fi: ["Pienyrittäjä","Verkkokauppias","Verkkomyyjä","Maahantuoja","Viejä","Vakiolähettäjä","Logistiikkapäällikkö","Putiikinomistaja","Etsy-myyjä","Antiikkikauppias","Viinin viejä","Kahvin viejä","Kauneusbrändin perustaja","Muotisuunnittelija","Tilauslaatikkomyyjä","Teknologian jälleenmyyjä","Tukkukauppias","Käsityömyyjä","Taidekauppias","Drop-shipper","Markkinapaikkamyyjä","Autonosakauppias","Korusuunnittelija","Vintage-keräilijä","Vakioasiakas","Kirjakauppias","Apteekinomistaja","Lelujen maahantuoja","Lenkkareiden jälleenmyyjä","Sisustusmyyjä","Maustekauppias","Tekstiilikauppias","Ihonhoitobrändin perustaja","Streetwear-brändi","Print-on-demand -myyjä"],
  sv: ["Småföretagare","E-handelssäljare","Onlinehandlare","Importör","Exportör","Frekvent avsändare","Logistikchef","Butiksägare","Etsy-säljare","Antikhandlare","Vinexportör","Kaffeexportör","Skönhetsmärkesgrundare","Modedesigner","Prenumerationsboxägare","Teknikåterförsäljare","Grossist","Hantverksförsäljare","Konsthandlare","Drop-shipper","Marknadsplatssäljare","Bildelshandlare","Smyckesdesigner","Vintagesamlare","Stamkund","Bokhandlare","Apoteksägare","Leksaksimportör","Sneakeråterförsäljare","Heminredningssäljare","Kryddhandlare","Textilhandlare","Hudvårdsgrundare","Streetwear-märke","Print-on-demand-säljare"],
  no: ["Småbedriftseier","E-handelsselger","Nettforhandler","Importør","Eksportør","Hyppig avsender","Logistikksjef","Butikkseier","Etsy-selger","Antikvitetshandler","Vineksportør","Kaffeeksportør","Skjønnhetsmerkegründer","Motedesigner","Abonnementsboks-eier","Teknologiforhandler","Grossist","Håndverksselger","Kunsthandler","Drop-shipper","Markedsplassselger","Bildelhandler","Smykkedesigner","Vintage-samler","Fast kunde","Bokhandler","Apotekereier","Leketøyimportør","Sneakerforhandler","Boliginnredningsselger","Krydderhandler","Tekstilhandler","Hudpleiegründer","Streetwear-merke","Print-on-demand-selger"],
  da: ["Småvirksomhedsejer","E-handelssælger","Onlineforhandler","Importør","Eksportør","Hyppig afsender","Logistikchef","Butiksejer","Etsy-sælger","Antikvitetshandler","Vineksportør","Kaffeeksportør","Skønhedsmærkegrundlægger","Modedesigner","Abonnementsboks-ejer","Teknologiforhandler","Grossist","Håndværkssælger","Kunsthandler","Drop-shipper","Markedspladssælger","Bildelhandler","Smykkedesigner","Vintage-samler","Fast kunde","Boghandler","Apotekejer","Legetøjsimportør","Sneakerforhandler","Boligindretningssælger","Krydderihandler","Tekstilhandler","Hudplejegrundlægger","Streetwear-mærke","Print-on-demand-sælger"],
  "pt-BR": ["Pequeno empresário","Vendedor e-commerce","Varejista online","Importador","Exportador","Remetente frequente","Gerente de logística","Dono de boutique","Vendedor Etsy","Antiquário","Exportador de vinho","Exportador de café","Fundadora de beleza","Designer de moda","Dono de subscription box","Revendedor de tecnologia","Atacadista","Vendedor de artesanato","Marchand de arte","Drop-shipper","Vendedor de marketplace","Comerciante de autopeças","Designer de joias","Colecionador vintage","Comprador frequente","Livreiro","Dono de farmácia","Importador de brinquedos","Revendedor de tênis","Vendedor de decoração","Comerciante de especiarias","Comerciante têxtil","Fundador skincare","Marca streetwear","Vendedor print-on-demand"],
  nl: ["Kleine ondernemer","E-commerce verkoper","Online retailer","Importeur","Exporteur","Frequente verzender","Logistiek manager","Boetiekeigenaar","Etsy-verkoper","Antiekhandelaar","Wijnexporteur","Koffie-exporteur","Beauty-oprichter","Modeontwerper","Abonnementsbox-eigenaar","Tech-wederverkoper","Groothandelaar","Ambachtsverkoper","Kunsthandelaar","Drop-shipper","Marktplaatsverkoper","Auto-onderdelenhandelaar","Sieradenontwerper","Vintage-verzamelaar","Vaste koper","Boekhandelaar","Apotheekhouder","Speelgoedimporteur","Sneakerverkoper","Woondecoratieverkoper","Specerijenhandelaar","Textielhandelaar","Skincare-oprichter","Streetwear-merk","Print-on-demand-verkoper"],
  pl: ["Właściciel małej firmy","Sprzedawca e-commerce","Sprzedawca internetowy","Importer","Eksporter","Stały nadawca","Menedżer logistyki","Właściciel butiku","Sprzedawca Etsy","Antykwariusz","Eksporter wina","Eksporter kawy","Założyciel marki kosmetycznej","Projektant mody","Właściciel subscription boxa","Sprzedawca tech","Hurtownik","Sprzedawca rękodzieła","Marszand sztuki","Drop-shipper","Sprzedawca na marketplace","Handlarz częściami samochodowymi","Projektant biżuterii","Kolekcjoner vintage","Stały klient","Księgarz","Właściciel apteki","Importer zabawek","Sprzedawca sneakersów","Sprzedawca dekoracji","Handlarz przyprawami","Handlarz tekstyliami","Założyciel marki skincare","Marka streetwear","Sprzedawca print-on-demand"],
  ru: ["Владелец малого бизнеса","Продавец e-commerce","Интернет-ритейлер","Импортёр","Экспортёр","Постоянный отправитель","Менеджер логистики","Владелец бутика","Продавец Etsy","Антиквар","Экспортёр вина","Экспортёр кофе","Основательница бьюти-бренда","Дизайнер одежды","Владелец subscription box","Реселлер техники","Оптовик","Продавец рукоделия","Арт-дилер","Дропшиппер","Продавец маркетплейса","Торговец автозапчастями","Ювелирный дизайнер","Винтажный коллекционер","Постоянный покупатель","Книготорговец","Владелец аптеки","Импортёр игрушек","Реселлер кроссовок","Продавец декора","Торговец специями","Торговец текстилем","Основатель скинкер-бренда","Streetwear-бренд","Продавец print-on-demand"],
  uk: ["Власник малого бізнесу","Продавець e-commerce","Інтернет-ритейлер","Імпортер","Експортер","Постійний відправник","Менеджер логістики","Власник бутіка","Продавець Etsy","Антиквар","Експортер вина","Експортер кави","Засновниця б'юті-бренду","Дизайнер одягу","Власник subscription box","Реселер техніки","Оптовик","Продавець рукоділля","Арт-дилер","Дропшипер","Продавець маркетплейсу","Торговець автозапчастинами","Ювелірний дизайнер","Вінтажний колекціонер","Постійний покупець","Книготорговець","Власник аптеки","Імпортер іграшок","Реселер кросівок","Продавець декору","Торговець спеціями","Торговець текстилем","Засновник скінкер-бренду","Streetwear-бренд","Продавець print-on-demand"],
  tr: ["Küçük işletme sahibi","E-ticaret satıcısı","Online perakendeci","İthalatçı","İhracatçı","Sık gönderici","Lojistik müdürü","Butik sahibi","Etsy satıcısı","Antika tüccarı","Şarap ihracatçısı","Kahve ihracatçısı","Güzellik markası kurucusu","Moda tasarımcısı","Abonelik kutusu sahibi","Teknoloji bayisi","Toptancı","El sanatları satıcısı","Sanat tüccarı","Drop-shipper","Pazaryeri satıcısı","Oto yedek parça tüccarı","Mücevher tasarımcısı","Vintage koleksiyoncu","Sık alıcı","Kitapçı","Eczane sahibi","Oyuncak ithalatçısı","Sneaker bayisi","Ev dekorasyonu satıcısı","Baharat tüccarı","Tekstil tüccarı","Cilt bakım kurucusu","Streetwear markası","Print-on-demand satıcısı"],
  ja: ["小規模事業主","ECセラー","オンライン小売業者","輸入業者","輸出業者","常連発送者","物流マネージャー","ブティックオーナー","Etsyセラー","骨董商","ワイン輸出業者","コーヒー輸出業者","ビューティーブランド創業者","ファッションデザイナー","サブスクボックス運営者","テックリセラー","卸売業者","ハンドメイド作家","アートディーラー","ドロップシッパー","マーケットプレイス出品者","自動車部品商","ジュエリーデザイナー","ヴィンテージコレクター","常連購入者","書店主","薬局オーナー","玩具輸入業者","スニーカーリセラー","ホームデコレーション販売者","スパイス商","テキスタイル商","スキンケア創業者","ストリートウェアブランド","プリントオンデマンド販売者"],
  ko: ["소상공인","이커머스 셀러","온라인 소매업자","수입업자","수출업자","정기 발송자","물류 매니저","부티크 사장","Etsy 셀러","골동품 상인","와인 수출업자","커피 수출업자","뷰티 브랜드 창업자","패션 디자이너","구독 박스 운영자","테크 리셀러","도매업자","수공예 셀러","미술 딜러","드롭쉬퍼","마켓플레이스 셀러","자동차 부품상","주얼리 디자이너","빈티지 수집가","단골 구매자","서점 주인","약국 사장","장난감 수입업자","스니커즈 리셀러","홈 데코 셀러","향신료 상인","섬유 상인","스킨케어 창업자","스트리트웨어 브랜드","주문제작 셀러"],
  hi: ["छोटे व्यवसाय के मालिक","ई-कॉमर्स विक्रेता","ऑनलाइन रिटेलर","आयातक","निर्यातक","नियमित प्रेषक","लॉजिस्टिक्स मैनेजर","बुटीक मालिक","Etsy विक्रेता","प्राचीन वस्तु व्यापारी","वाइन निर्यातक","कॉफी निर्यातक","ब्यूटी ब्रांड संस्थापक","फैशन डिज़ाइनर","सब्सक्रिप्शन बॉक्स मालिक","टेक रीसेलर","थोक विक्रेता","हस्तशिल्प विक्रेता","कला व्यापारी","ड्रॉप-शिपर","मार्केटप्लेस विक्रेता","ऑटो पार्ट्स व्यापारी","ज्वेलरी डिज़ाइनर","विंटेज संग्रहकर्ता","नियमित खरीदार","पुस्तक विक्रेता","फार्मेसी मालिक","खिलौना आयातक","स्नीकर रीसेलर","होम डेकोर विक्रेता","मसाला व्यापारी","कपड़ा व्यापारी","स्किनकेयर संस्थापक","स्ट्रीटवियर ब्रांड","प्रिंट-ऑन-डिमांड विक्रेता"],
  ro: ["Proprietar afacere mică","Vânzător e-commerce","Retailer online","Importator","Exportator","Expeditor frecvent","Manager logistică","Proprietar boutique","Vânzător Etsy","Anticar","Exportator de vin","Exportator de cafea","Fondatoare brand beauty","Designer modă","Proprietar subscription box","Revânzător tech","Angrosist","Vânzător de artizanat","Comerciant de artă","Drop-shipper","Vânzător marketplace","Comerciant piese auto","Designer bijuterii","Colecționar vintage","Cumpărător frecvent","Librar","Proprietar farmacie","Importator jucării","Revânzător sneakers","Vânzător decor casă","Comerciant condimente","Comerciant textile","Fondator skincare","Brand streetwear","Vânzător print-on-demand"],
  cs: ["Majitel malé firmy","E-commerce prodejce","Online prodejce","Dovozce","Vývozce","Stálý odesílatel","Manažer logistiky","Majitel butiku","Prodejce Etsy","Starožitník","Vývozce vína","Vývozce kávy","Zakladatelka beauty značky","Módní návrhář","Majitel subscription boxu","Tech reseller","Velkoobchodník","Prodejce řemesel","Obchodník s uměním","Drop-shipper","Prodejce na marketplace","Obchodník s autodíly","Návrhář šperků","Sběratel vintage","Stálý zákazník","Knihkupec","Majitel lékárny","Dovozce hraček","Reseller tenisek","Prodejce dekorací","Obchodník s kořením","Textilní obchodník","Zakladatel skincare","Streetwear značka","Prodejce print-on-demand"],
  el: ["Ιδιοκτήτης μικρής επιχείρησης","Πωλητής e-commerce","Διαδικτυακός λιανέμπορος","Εισαγωγέας","Εξαγωγέας","Συχνός αποστολέας","Διευθυντής logistics","Ιδιοκτήτης μπουτίκ","Πωλητής Etsy","Αντικέρ","Εξαγωγέας οίνου","Εξαγωγέας καφέ","Ιδρύτρια beauty brand","Σχεδιαστής μόδας","Ιδιοκτήτης subscription box","Μεταπωλητής tech","Χονδρέμπορος","Πωλητής χειροτεχνίας","Έμπορος τέχνης","Drop-shipper","Πωλητής marketplace","Έμπορος ανταλλακτικών","Σχεδιαστής κοσμημάτων","Συλλέκτης vintage","Συχνός αγοραστής","Βιβλιοπώλης","Ιδιοκτήτης φαρμακείου","Εισαγωγέας παιχνιδιών","Μεταπωλητής sneakers","Πωλητής διακόσμησης","Έμπορος μπαχαρικών","Έμπορος υφασμάτων","Ιδρυτής skincare","Streetwear brand","Πωλητής print-on-demand"],
  hu: ["Kisvállalkozó","E-kereskedelmi eladó","Online kiskereskedő","Importőr","Exportőr","Gyakori feladó","Logisztikai vezető","Butiktulajdonos","Etsy-eladó","Régiségkereskedő","Borexportőr","Kávéexportőr","Beauty márkaalapító","Divattervező","Subscription box tulajdonos","Tech viszonteladó","Nagykereskedő","Kézművesárú-eladó","Műkereskedő","Drop-shipper","Marketplace eladó","Autóalkatrész-kereskedő","Ékszertervező","Vintage gyűjtő","Törzsvásárló","Könyvkereskedő","Gyógyszertár tulajdonos","Játékimportőr","Sneaker viszonteladó","Lakberendezés-eladó","Fűszerkereskedő","Textilkereskedő","Skincare alapító","Streetwear márka","Print-on-demand eladó"],
};

const LOCATIONS = [
  "New York, USA","Los Angeles, USA","Houston, USA","Chicago, USA","Miami, USA","Atlanta, USA","Austin, USA","Seattle, USA","Boston, USA",
  "Toronto, Canada","Vancouver, Canada","Montreal, Canada",
  "London, UK","Manchester, UK","Dublin, Ireland","Edinburgh, UK",
  "Paris, France","Bordeaux, France","Lyon, France",
  "Berlin, Germany","Munich, Germany","Hamburg, Germany",
  "Madrid, Spain","Barcelona, Spain","Rome, Italy","Milan, Italy","Lisbon, Portugal","Amsterdam, NL","Brussels, Belgium",
  "Stockholm, Sweden","Oslo, Norway","Copenhagen, Denmark","Helsinki, Finland","Warsaw, Poland","Vienna, Austria","Zurich, Switzerland",
  "Lagos, Nigeria","Abuja, Nigeria","Accra, Ghana","Nairobi, Kenya","Cape Town, SA","Johannesburg, SA","Kampala, Uganda","Dakar, Senegal","Cairo, Egypt","Casablanca, Morocco",
  "Dubai, UAE","Riyadh, KSA","Doha, Qatar","Istanbul, Turkey","Tel Aviv, Israel","Beirut, Lebanon",
  "Mumbai, India","Delhi, India","Bangalore, India","Karachi, Pakistan","Dhaka, Bangladesh","Colombo, Sri Lanka",
  "Singapore","Kuala Lumpur, MY","Bangkok, Thailand","Manila, Philippines","Jakarta, Indonesia","Hanoi, Vietnam","Ho Chi Minh, VN",
  "Tokyo, Japan","Osaka, Japan","Seoul, South Korea","Shanghai, China","Hong Kong","Taipei, Taiwan",
  "Sydney, Australia","Melbourne, Australia","Auckland, NZ",
  "Mexico City, MX","São Paulo, Brazil","Rio, Brazil","Buenos Aires, AR","Bogotá, Colombia","Lima, Peru","Santiago, Chile",
];

// Mulberry32 — deterministic PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function buildPool(strings: ReviewStrings, roles: string[]): Review[] {
  const rand = mulberry32(20260101); // stable seed → identical pool composition
  const pool: Review[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (pool.length < 520 && attempts < 5000) {
    attempts++;
    const first = pick(FIRST_NAMES, rand);
    const lastI = pick(LAST_INITIALS, rand);
    const name = `${first} ${lastI}.`;
    const location = pick(LOCATIONS, rand);
    const role = pick(roles, rand);
    const key = `${name}|${location}|${role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tpl = pick(strings.templates, rand);
    const extra = pick(strings.extras, rand);
    const text = tpl.replace("{extra}", extra);
    const rating = rand() < 0.88 ? 5 : 4;
    pool.push({
      name,
      role,
      location,
      rating,
      text,
      initials: (first[0] + lastI).toUpperCase(),
    });
  }
  return pool;
}

function dayIndex(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Cache pools per language
const poolCache = new Map<string, Review[]>();
function getPool(lang: string): Review[] {
  const baseLang = lang.split("-")[0];
  const cached = poolCache.get(lang) ?? poolCache.get(baseLang);
  if (cached) return cached;
  const strings = getReviewStrings(lang);
  const roles = ROLES_BY_LANG[lang] ?? ROLES_BY_LANG[baseLang] ?? ROLES_BY_LANG.en;
  const pool = buildPool(strings, roles);
  poolCache.set(lang, pool);
  return pool;
}

/** Daily-rotating slice of the testimonial pool, in the given language. */
export function getDailyReviews(lang: string, count = 24, date = new Date()): Review[] {
  const pool = getPool(lang);
  const seed = dayIndex(date) * 2654435761;
  return seededShuffle(pool, seed).slice(0, count);
}

export function getPoolStats(lang: string) {
  const pool = getPool(lang);
  const avg = (pool.reduce((s, r) => s + r.rating, 0) / pool.length).toFixed(1);
  return { size: pool.length, avg };
}
