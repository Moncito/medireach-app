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

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Query nearby healthcare facilities within a radius (meters) of a point.
 * Uses Overpass QL to search OpenStreetMap data.
 */
export async function fetchNearbyFacilities(
  lat: number,
  lon: number,
  radiusMeters = 5000
): Promise<Facility[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
      node["amenity"="dentist"](around:${radiusMeters},${lat},${lon});
      node["amenity"="doctors"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
    );
    out center body;
  `;

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error("Failed to fetch facilities");

  const data = await res.json();

  const facilities: Facility[] = data.elements
    .map((el: Record<string, unknown>): Facility | null => {
      const tags = (el.tags ?? {}) as Record<string, string>;
      const amenity = tags.amenity as Facility["type"] | undefined;
      if (!amenity) return null;

      const elLat = (el.lat ?? (el.center as { lat: number } | undefined)?.lat) as number | undefined;
      const elLon = (el.lon ?? (el.center as { lon: number } | undefined)?.lon) as number | undefined;
      if (!elLat || !elLon) return null;

      return {
        id: el.id as number,
        name: tags.name || formatType(amenity),
        type: amenity,
        lat: elLat,
        lon: elLon,
        address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"]]
          .filter(Boolean)
          .join(", ") || undefined,
        phone: tags.phone || tags["contact:phone"] || undefined,
        website: tags.website || tags["contact:website"] || undefined,
        openingHours: tags.opening_hours || undefined,
        distance: haversineKm(lat, lon, elLat, elLon),
      };
    })
    .filter((f: Facility | null): f is Facility => f !== null)
    .sort((a: Facility, b: Facility) => (a.distance ?? 0) - (b.distance ?? 0));

  return facilities;
}

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
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
  { label: string; color: string; emoji: string }
> = {
  hospital: { label: "Hospital", color: "#EF4444", emoji: "🏥" },
  clinic: { label: "Clinic", color: "#3B82F6", emoji: "🩺" },
  pharmacy: { label: "Pharmacy", color: "#10B981", emoji: "💊" },
  dentist: { label: "Dentist", color: "#8B5CF6", emoji: "🦷" },
  doctors: { label: "Doctor", color: "#FF6B35", emoji: "👨‍⚕️" },
};
