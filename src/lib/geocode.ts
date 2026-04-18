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
