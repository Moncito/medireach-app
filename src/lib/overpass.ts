/* ------------------------------------------------------------------ */
/*  Overpass API — query nearby healthcare facilities from OSM         */
/* ------------------------------------------------------------------ */

export interface Facility {
  id: number;
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "dentist" | "doctors";
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  distance?: number; // km
}

/* Overpass endpoints — try each in order, with retries */
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

/** Simple in-memory + sessionStorage cache keyed by rounded coords */
function getCacheKey(lat: number, lon: number, radius: number): string {
  return `overpass_${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`;
}

function getCached(key: string): Facility[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    // Cache valid for 10 minutes
    if (Date.now() - ts > 10 * 60 * 1000) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data as Facility[];
  } catch {
    return null;
  }
}

function setCache(key: string, data: Facility[]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* quota exceeded — ignore */
  }
}

/**
 * Query nearby healthcare facilities within a radius (meters) of a point.
 * Uses Overpass QL to search OpenStreetMap data.
 * Tries multiple endpoints with retry. Caches results in sessionStorage.
 */
export async function fetchNearbyFacilities(
  lat: number,
  lon: number,
  radiusMeters = 5000
): Promise<Facility[]> {
  const cacheKey = getCacheKey(lat, lon, radiusMeters);
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[Overpass] Cache hit: ${cached.length} facilities`);
    return cached;
  }

  const query = `
    [out:json][timeout:25];
    (
      nwr["amenity"~"^(hospital|clinic|pharmacy|dentist|doctors)$"](around:${radiusMeters},${lat},${lon});
      nwr["healthcare"~"^(hospital|clinic|pharmacy|dentist|doctor)$"](around:${radiusMeters},${lat},${lon});
    );
    out body center qt;
  `;

  let data: { elements?: unknown[] } | null = null;
  let lastError: unknown = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    // Try each endpoint up to 2 times
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          // Brief delay before retry
          await new Promise((r) => setTimeout(r, 1500));
        }

        console.log(`[Overpass] Trying ${endpoint} (attempt ${attempt + 1})`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          console.warn(`[Overpass] ${endpoint} rate limited (${res.status})`);
          lastError = new Error(`Rate limited: ${res.status}`);
          break; // Skip retries for this endpoint, try next
        }

        if (!res.ok) {
          console.warn(`[Overpass] ${endpoint} returned ${res.status}`);
          lastError = new Error(`HTTP ${res.status}`);
          continue;
        }

        data = await res.json();

        if (data?.elements && data.elements.length > 0) {
          console.log(`[Overpass] Success from ${endpoint}: ${data.elements.length} elements`);
          break;
        }

        // Got response but 0 elements — try next endpoint
        console.warn(`[Overpass] ${endpoint} returned 0 elements`);
        lastError = new Error("Empty response");
      } catch (err) {
        console.warn(`[Overpass] ${endpoint} attempt ${attempt + 1} failed:`, err);
        lastError = err;
        continue;
      }
    }

    if (data?.elements && data.elements.length > 0) break;
  }

  if (!data?.elements) {
    throw lastError instanceof Error ? lastError : new Error("All Overpass endpoints failed");
  }

  console.log(`[Overpass] Got ${data.elements.length} raw elements`);

  const seen = new Set<string>();

  const facilities: Facility[] = (data.elements as Record<string, unknown>[])
    .map((el): Facility | null => {
      const tags = (el.tags ?? {}) as Record<string, string>;

      // Resolve type from amenity or healthcare tag
      const raw = tags.amenity || tags.healthcare || "";
      const type = normalizeType(raw);
      if (!type) return null;

      // Deduplicate using composite key (type:id) — nodes/ways/relations can share numeric ids
      const dedupeKey = `${el.type}:${el.id}`;
      if (seen.has(dedupeKey)) return null;
      seen.add(dedupeKey);
      const id = el.id as number;

      // Coordinates: nodes have lat/lon directly, ways/relations use center
      const center = el.center as { lat?: number; lon?: number } | undefined;
      const elLat = (el.lat as number | undefined) ?? center?.lat;
      const elLon = (el.lon as number | undefined) ?? center?.lon;
      if (elLat == null || elLon == null) return null;

      return {
        id,
        name: tags.name || formatType(type),
        type,
        lat: elLat,
        lon: elLon,
        address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"]]
          .filter(Boolean)
          .join(", ") || undefined,
        phone: tags.phone || tags["contact:phone"] || undefined,
        website: sanitizeUrl(tags.website || tags["contact:website"]) || undefined,
        openingHours: tags.opening_hours || undefined,
        distance: haversineKm(lat, lon, elLat, elLon),
      };
    })
    .filter((f): f is Facility => f !== null)
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  if (facilities.length > 0) {
    setCache(cacheKey, facilities);
  }

  return facilities;
}

/** Map raw OSM tag values to our Facility type union */
function normalizeType(raw: string): Facility["type"] | null {
  const map: Record<string, Facility["type"]> = {
    hospital: "hospital",
    clinic: "clinic",
    pharmacy: "pharmacy",
    dentist: "dentist",
    doctors: "doctors",
    doctor: "doctors", // healthcare=doctor → doctors
  };
  return map[raw] ?? null;
}

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** Only allow http/https URLs from untrusted OSM data */
function sanitizeUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch { /* invalid URL */ }
  return undefined;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export const FACILITY_CONFIG: Record<
  Facility["type"],
  { label: string; color: string; icon: string }
> = {
  hospital: { label: "Hospital", color: "#EF4444", icon: "H" },
  clinic: { label: "Clinic", color: "#3B82F6", icon: "C" },
  pharmacy: { label: "Pharmacy", color: "#10B981", icon: "Rx" },
  dentist: { label: "Dentist", color: "#8B5CF6", icon: "D" },
  doctors: { label: "Doctor", color: "#F59E0B", icon: "Dr" },
};
