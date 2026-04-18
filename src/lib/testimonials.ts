// Large pool of testimonials. Each day a deterministic subset is shown,
// so reviews "refresh" automatically every 24 hours.

export interface Review {
  name: string;
  role: string;
  location: string;
  rating: number; // 4 or 5
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

const ROLES = [
  "Small Business Owner","E-commerce Seller","Online Retailer","Importer","Exporter","Frequent Sender","Logistics Manager",
  "Boutique Owner","Etsy Seller","Antique Dealer","Wine Exporter","Coffee Exporter","Beauty Brand Founder","Fashion Designer",
  "Subscription Box Owner","Tech Reseller","Wholesaler","Crafts Seller","Fine Art Dealer","Drop-shipper","Marketplace Seller",
  "Auto Parts Trader","Jewelry Designer","Vintage Collector","Frequent Buyer","Bookseller","Pharmacy Owner","Toy Importer",
  "Sneaker Reseller","Home Decor Seller","Spice Trader","Textile Trader","Skincare Founder","Streetwear Brand","Print-on-demand Seller",
];

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

const TEMPLATES = [
  "Cloud Shipment delivered my package faster than I expected. The live tracking map kept me informed the whole way. {extra}",
  "Honestly the most reliable courier I've ever used. Even during peak season my deliveries arrived on schedule. {extra}",
  "The tracking notifications are so smooth — I always know exactly where my parcel is. {extra}",
  "Customer support replied within minutes and resolved my issue immediately. Truly 5-star service. {extra}",
  "I ship internationally every week and Cloud Shipment has never let me down. Pricing is fair and transit is fast. {extra}",
  "The receipt and invoice feature looks so professional. My customers love the transparency. {extra}",
  "Beautifully designed platform. The dark mode and language switcher are a really nice touch. {extra}",
  "My fragile items always arrive in perfect condition. Their handling is top-tier. {extra}",
  "Express delivery was even faster than promised. I'll definitely keep using Cloud Shipment. {extra}",
  "We switched our entire fulfillment to Cloud Shipment. Reliable, transparent, and easy to use. {extra}",
  "The animated live updates make me feel completely in control of every shipment. {extra}",
  "Affordable, fast and trustworthy. Already recommended Cloud Shipment to everyone in my circle. {extra}",
  "Multi-language support and a clean interface — finally a courier built for the modern world. {extra}",
  "From booking to delivery the entire process was seamless. Bravo to the Cloud Shipment team! {extra}",
  "I love the real-time map. Watching my package move across continents is genuinely fun. {extra}",
  "Bulk shipping is now stress-free. The admin dashboard is intuitive and powerful. {extra}",
  "Great experience overall. Tracking updates are accurate and the team is friendly. {extra}",
  "Cloud Shipment has elevated my brand. My customers comment on the tracking page every time. {extra}",
  "Temperature-sensitive shipping handled perfectly. I'm very impressed with the care taken. {extra}",
  "Documentation and delivery were both spotless. The attention to detail is rare these days. {extra}",
  "The mobile experience is buttery smooth. I can manage everything from my phone. {extra}",
  "Pricing is the most transparent I've seen — no hidden fees, ever. Refreshing! {extra}",
  "I had a customs question and support walked me through it step-by-step. So helpful. {extra}",
  "Fast onboarding, easy shipment creation, and instant tracking links. Exactly what I needed. {extra}",
  "Cloud Shipment makes me look so professional to my buyers. Worth every penny. {extra}",
];

const EXTRAS = [
  "Highly recommended!","10/10.","Will definitely use again.","Couldn't be happier.","A true game-changer.",
  "Trustworthy and consistent.","My new go-to courier.","Five stars all around.","Exceeded my expectations.",
  "Worth every cent.","Smooth from start to finish.","Top-tier service.","Setting the standard.","Just brilliant.",
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

function buildPool(): Review[] {
  const rand = mulberry32(20260101); // stable seed → identical pool every build
  const pool: Review[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (pool.length < 520 && attempts < 5000) {
    attempts++;
    const first = pick(FIRST_NAMES, rand);
    const lastI = pick(LAST_INITIALS, rand);
    const name = `${first} ${lastI}.`;
    const location = pick(LOCATIONS, rand);
    const role = pick(ROLES, rand);
    const key = `${name}|${location}|${role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tpl = pick(TEMPLATES, rand);
    const extra = pick(EXTRAS, rand);
    const text = tpl.replace("{extra}", extra);
    const rating = rand() < 0.88 ? 5 : 4; // mostly 5★
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

export const TESTIMONIAL_POOL: Review[] = buildPool();

/** Day-of-year index (UTC) so the rotation flips at midnight UTC. */
function dayIndex(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  return Math.floor(diff / 86_400_000);
}

/** Shuffle deterministically with a Fisher–Yates seeded by `seed`. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Returns a daily-rotating slice of the testimonial pool.
 * Same set for everyone on the same UTC day; flips at midnight UTC.
 */
export function getDailyReviews(count = 24, date = new Date()): Review[] {
  const day = dayIndex(date);
  const seed = day * 2654435761; // hash-ish multiplier
  const shuffled = seededShuffle(TESTIMONIAL_POOL, seed);
  return shuffled.slice(0, count);
}

/** Average rating across the entire pool — stable, used in the header. */
export const POOL_AVG_RATING = (
  TESTIMONIAL_POOL.reduce((s, r) => s + r.rating, 0) / TESTIMONIAL_POOL.length
).toFixed(1);

export const POOL_SIZE = TESTIMONIAL_POOL.length;
