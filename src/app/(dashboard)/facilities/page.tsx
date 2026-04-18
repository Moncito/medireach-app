"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Loader2,
  AlertTriangle,
  Navigation,
  Filter,
} from "lucide-react";
import { type Facility, FACILITY_CONFIG, fetchNearbyFacilities } from "@/lib/overpass";
import { FacilityCard } from "@/features/facilities/facility-card";

// Dynamic import — Leaflet can't run on server
const FacilityMap = dynamic(
  () => import("@/features/facilities/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="w-full h-full rounded-2xl bg-surface animate-pulse" /> }
);

type FacilityType = Facility["type"] | "all";

const filterOptions: { value: FacilityType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hospital", label: "🏥 Hospitals" },
  { value: "clinic", label: "🩺 Clinics" },
  { value: "pharmacy", label: "💊 Pharmacies" },
  { value: "dentist", label: "🦷 Dentists" },
  { value: "doctors", label: "👨‍⚕️ Doctors" },
];

export default function FacilitiesPage() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FacilityType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "requesting" | "denied" | "ready">("idle");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoStatus("requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setGeoStatus("ready");
      },
      (err) => {
        setGeoStatus("denied");
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied. Please enable location permissions in your browser settings.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Location unavailable. Please try again.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Fetch facilities when location is available
  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);
    fetchNearbyFacilities(location[0], location[1], 5000)
      .then((data) => {
        setFacilities(data);
        if (data.length === 0) {
          setError("No healthcare facilities found nearby. Try expanding your search area.");
        }
      })
      .catch(() => {
        setError("Failed to fetch nearby facilities. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [location]);

  const filteredFacilities = useMemo(() => {
    let result = facilities;
    if (filter !== "all") {
      result = result.filter((f) => f.type === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.address?.toLowerCase().includes(q) ||
          FACILITY_CONFIG[f.type].label.toLowerCase().includes(q)
      );
    }
    return result;
  }, [facilities, filter, searchQuery]);

  const handleSelect = useCallback((facility: Facility) => {
    setSelectedId((prev) => (prev === facility.id ? null : facility.id));
  }, []);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: facilities.length };
    facilities.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });
    return counts;
  }, [facilities]);

  // Location permission / loading state
  if (geoStatus === "idle" || geoStatus === "requesting") {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent-coral/10 flex items-center justify-center mb-6">
            <Navigation className="w-7 h-7 text-accent-coral animate-pulse" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Finding Your Location</h1>
          <p className="text-muted max-w-md mb-6">
            Please allow location access to find healthcare facilities near you.
          </p>
          <Loader2 className="w-6 h-6 text-accent-coral animate-spin" />
        </div>
      </div>
    );
  }

  if (geoStatus === "denied" && !location) {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Location Access Required</h1>
          <p className="text-muted max-w-md mb-6">{error}</p>
          <button onClick={requestLocation} className="btn-primary">
            <Navigation className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-accent-coral/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent-coral" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">Nearby Facilities</h1>
            <p className="text-sm text-muted">
              {loading
                ? "Searching nearby..."
                : `${facilities.length} healthcare facilities within 5km`}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent-coral/40 focus:ring-2 focus:ring-accent-coral/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filter === opt.value
                  ? "bg-accent-coral text-white shadow-sm"
                  : "bg-surface text-muted hover:bg-surface/80"
              }`}
            >
              {opt.label}
              {typeCounts[opt.value] != null && (
                <span className="ml-1 opacity-70">({typeCounts[opt.value]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Map + List layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5" style={{ minHeight: "500px" }}>
        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border/60 shadow-soft">
          {location && (
            <FacilityMap
              center={location}
              facilities={filteredFacilities}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* List */}
        <div className="lg:col-span-2 overflow-y-auto space-y-3 max-h-[500px] lg:max-h-[600px] pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-accent-coral animate-spin mb-3" />
              <p className="text-sm text-muted">Finding facilities near you...</p>
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="w-8 h-8 text-muted-light mb-3" />
              <p className="text-sm text-muted">
                {searchQuery || filter !== "all"
                  ? "No facilities match your search."
                  : "No facilities found nearby."}
              </p>
            </div>
          ) : (
            filteredFacilities.map((f) => (
              <FacilityCard
                key={f.id}
                facility={f}
                isSelected={f.id === selectedId}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && !loading && facilities.length > 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}
    </div>
  );
}
