// Lightweight worldwide geocoder using OpenStreetMap Nominatim.
// Results are cached in-memory and in localStorage to avoid repeat lookups.

export type LatLng = [number, number];

const FALLBACK: Record<string, LatLng> = {
  "washington, dc": [38.9072, -77.0369],
  "washington dc": [38.9072, -77.0369],
  "new jersey": [40.0583, -74.4057],
  "new york": [40.7128, -74.006],
  "new york, ny": [40.7128, -74.006],
  "los angeles, ca": [34.0522, -118.2437],
  "chicago, il": [41.8781, -87.6298],
  "miami, fl": [25.7617, -80.1918],
  "seattle, wa": [47.6062, -122.3321],
  london: [51.5072, -0.1276],
  paris: [48.8566, 2.3522],
  dubai: [25.2048, 55.2708],
  lagos: [6.5244, 3.3792],
  shanghai: [31.2304, 121.4737],
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
  "united states": [39.8283, -98.5795],
};

const CACHE_KEY = "geocode-cache-v1";
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

export const lookupFallback = (location: string): LatLng | null => {
  const key = normalize(location);
  if (FALLBACK[key]) return FALLBACK[key];
  // partial match on first comma segment
  const first = key.split(",")[0].trim();
  for (const [k, v] of Object.entries(FALLBACK)) {
    if (k.startsWith(first) || first.includes(k.split(",")[0])) return v;
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

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (data && data.length > 0) {
        const coords: LatLng = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        memoryCache.set(key, coords);
        saveDiskCache(key, coords);
        return coords;
      }
    }
  } catch {
    // network errors fall through to fallback
  }

  const fb = lookupFallback(location);
  if (fb) {
    memoryCache.set(key, fb);
    return fb;
  }

  // Last-resort default (Atlantic) so the map still renders
  return [20, 0];
};
