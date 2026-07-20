// Lightweight worldwide geocoder using OpenStreetMap Nominatim.
// Results are cached in-memory and in localStorage to avoid repeat lookups.
// When a specific street address can't be resolved, we progressively simplify
// the query (city+state, state+country, country) so the map never lands on the
// wrong continent.

export type LatLng = [number, number];

const FALLBACK: Record<string, LatLng> = {
  // US cities / states
  "washington, dc": [38.9072, -77.0369],
  "washington dc": [38.9072, -77.0369],
  "new jersey": [40.0583, -74.4057],
  "new york": [40.7128, -74.006],
  "new york, ny": [40.7128, -74.006],
  "los angeles, ca": [34.0522, -118.2437],
  "los angeles": [34.0522, -118.2437],
  "santa clarita, ca": [34.3917, -118.5426],
  "santa clarita": [34.3917, -118.5426],
  "san francisco, ca": [37.7749, -122.4194],
  "san diego, ca": [32.7157, -117.1611],
  "sacramento, ca": [38.5816, -121.4944],
  "chicago, il": [41.8781, -87.6298],
  "miami, fl": [25.7617, -80.1918],
  "orlando, fl": [28.5383, -81.3792],
  "seattle, wa": [47.6062, -122.3321],
  "portland, or": [45.5152, -122.6784],
  "boston, ma": [42.3601, -71.0589],
  "philadelphia, pa": [39.9526, -75.1652],
  "houston, tx": [29.7604, -95.3698],
  "dallas, tx": [32.7767, -96.797],
  "austin, tx": [30.2672, -97.7431],
  "atlanta, ga": [33.749, -84.388],
  "denver, co": [39.7392, -104.9903],
  "phoenix, az": [33.4484, -112.074],
  "las vegas, nv": [36.1699, -115.1398],
  "detroit, mi": [42.3314, -83.0458],
  "minneapolis, mn": [44.9778, -93.265],
  "charlotte, nc": [35.2271, -80.8431],
  // US state centroids for two-letter fallbacks
  ca: [36.7783, -119.4179],
  california: [36.7783, -119.4179],
  fl: [27.6648, -81.5158],
  tx: [31.9686, -99.9018],
  ny: [40.7128, -74.006],
  wa: [47.7511, -120.7401],
  or: [43.8041, -120.5542],
  nv: [38.8026, -116.4194],
  az: [34.0489, -111.0937],
  co: [39.5501, -105.7821],
  il: [40.6331, -89.3985],
  ga: [32.1656, -82.9001],
  nc: [35.7596, -79.0193],
  ma: [42.4072, -71.3824],
  pa: [41.2033, -77.1945],
  mi: [44.3148, -85.6024],
  oh: [40.4173, -82.9071],
  va: [37.4316, -78.6569],
  nj: [40.0583, -74.4057],
  // World cities
  london: [51.5072, -0.1276],
  paris: [48.8566, 2.3522],
  dubai: [25.2048, 55.2708],
  lagos: [6.5244, 3.3792],
  shanghai: [31.2304, 121.4737],
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  montreal: [45.5017, -73.5673],
  "northam, western australia, australia": [-31.6536, 116.6689],
  "perth, australia": [-31.9523, 115.8613],
  "sydney, australia": [-33.8688, 151.2093],
  "melbourne, australia": [-37.8136, 144.9631],
  // Poland
  szczecin: [53.4285, 14.5528],
  "szczecin, poland": [53.4285, 14.5528],
  warsaw: [52.2297, 21.0122],
  warszawa: [52.2297, 21.0122],
  krakow: [50.0647, 19.945],
  "kraków": [50.0647, 19.945],
  gdansk: [54.352, 18.6466],
  "gdańsk": [54.352, 18.6466],
  poznan: [52.4064, 16.9252],
  wroclaw: [51.1079, 17.0385],
};

// Country-level fallbacks scanned as last resort by substring
const COUNTRY_FALLBACK: Record<string, LatLng> = {
  poland: [52.0693, 19.4803],
  polska: [52.0693, 19.4803],
  germany: [51.1657, 10.4515],
  deutschland: [51.1657, 10.4515],
  france: [46.2276, 2.2137],
  spain: [40.4637, -3.7492],
  italy: [41.8719, 12.5674],
  "united kingdom": [54.7584, -2.6918],
  england: [52.3555, -1.1743],
  ireland: [53.1424, -7.6921],
  netherlands: [52.1326, 5.2913],
  belgium: [50.5039, 4.4699],
  portugal: [39.3999, -8.2245],
  sweden: [60.1282, 18.6435],
  norway: [60.472, 8.4689],
  finland: [61.9241, 25.7482],
  denmark: [56.2639, 9.5018],
  switzerland: [46.8182, 8.2275],
  austria: [47.5162, 14.5501],
  greece: [39.0742, 21.8243],
  turkey: [38.9637, 35.2433],
  ukraine: [48.3794, 31.1656],
  russia: [61.524, 105.3188],
  china: [35.8617, 104.1954],
  japan: [36.2048, 138.2529],
  india: [20.5937, 78.9629],
  canada: [56.1304, -106.3468],
  mexico: [23.6345, -102.5528],
  brazil: [-14.235, -51.9253],
  australia: [-25.2744, 133.7751],
  usa: [39.8283, -98.5795],
  "u.s.a": [39.8283, -98.5795],
  "u.s.a.": [39.8283, -98.5795],
  "united states": [39.8283, -98.5795],
  "united states of america": [39.8283, -98.5795],
};

const CACHE_KEY = "geocode-cache-v2";
const memoryCache = new Map<string, LatLng>();

const loadDiskCache = (): Record<string, LatLng> => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveDiskCache = (key: string, value: LatLng) => {
  try {
    const current = loadDiskCache();
    current[key] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
};

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

// Drop the street number/name so "18820 Aphrodite Ln, Santa Clarita, CA" becomes "Santa Clarita, CA".
const simplifyQueries = (location: string): string[] => {
  const parts = location.split(",").map((s) => s.trim()).filter(Boolean);
  const out = new Set<string>();
  out.add(location);
  if (parts.length >= 2) {
    // Drop successive leading segments (street number, street name, neighborhood)
    for (let i = 1; i < parts.length; i++) {
      out.add(parts.slice(i).join(", "));
    }
  }
  // Also try the last segment alone (usually country or state)
  if (parts.length > 0) out.add(parts[parts.length - 1]);
  return Array.from(out);
};

export const lookupFallback = (location: string): LatLng | null => {
  const key = normalize(location);
  if (!key) return null;
  if (FALLBACK[key]) return FALLBACK[key];

  const segments = key.split(",").map((s) => s.trim()).filter(Boolean);
  // Try progressively shorter suffixes ("city, state, country" → "state, country" → "country")
  for (let i = 0; i < segments.length; i++) {
    const suffix = segments.slice(i).join(", ");
    if (FALLBACK[suffix]) return FALLBACK[suffix];
  }
  // Try each individual segment as an exact key
  for (const seg of segments) {
    if (FALLBACK[seg]) return FALLBACK[seg];
  }
  // Prefix/suffix word match on individual segments
  for (const seg of segments) {
    for (const [k, v] of Object.entries(FALLBACK)) {
      const head = k.split(",")[0];
      if (seg === head || seg.endsWith(" " + head) || seg.startsWith(head + " ")) return v;
    }
  }

  // Country-level fallback by substring on the full string
  for (const [k, v] of Object.entries(COUNTRY_FALLBACK)) {
    if (key.includes(k)) return v;
  }
  return null;
};

const fetchNominatim = async (query: string): Promise<LatLng | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch {
    // ignore
  }
  return null;
};

export const geocode = async (location: string): Promise<LatLng> => {
  const key = normalize(location);
  if (!key) return [0, 0];

  if (memoryCache.has(key)) return memoryCache.get(key)!;

  const disk = loadDiskCache();
  if (disk[key]) {
    memoryCache.set(key, disk[key]);
    return disk[key];
  }

  // Try Nominatim with progressively simpler queries so a bad street address
  // still resolves to at least the correct city / state / country.
  const queries = simplifyQueries(location);
  for (const q of queries) {
    const hit = await fetchNominatim(q);
    if (hit) {
      memoryCache.set(key, hit);
      saveDiskCache(key, hit);
      return hit;
    }
    // Local fallback for this simplified variant before going to the network again
    const fb = lookupFallback(q);
    if (fb) {
      memoryCache.set(key, fb);
      saveDiskCache(key, fb);
      return fb;
    }
  }

  // Absolute last-resort: the geographic center of the world, not West Africa.
  // Better to show a neutral point than to mislocate a US address to Mali.
  return [0, 0];
};
