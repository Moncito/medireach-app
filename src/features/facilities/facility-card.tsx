"use client";

import { type Facility, FACILITY_CONFIG } from "@/lib/overpass";
import { MapPin, Phone, Globe, Clock, Building2, Stethoscope, Pill, SmilePlus, UserRound } from "lucide-react";

const FACILITY_ICONS: Record<Facility["type"], React.ElementType> = {
  hospital: Building2,
  clinic: Stethoscope,
  pharmacy: Pill,
  dentist: SmilePlus,
  doctors: UserRound,
};

interface FacilityCardProps {
  facility: Facility;
  isSelected: boolean;
  onSelect: (facility: Facility) => void;
}

export function FacilityCard({ facility, isSelected, onSelect }: FacilityCardProps) {
  const config = FACILITY_CONFIG[facility.type];

  return (
    <button
      onClick={() => onSelect(facility)}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
        isSelected
          ? "border-accent-coral/40 bg-accent-coral/5 shadow-card"
          : "border-border/60 bg-white hover:border-border hover:shadow-soft"
      }`}
    >
      <div className="flex items-start gap-3">
        {(() => { const Icon = FACILITY_ICONS[facility.type]; return (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.color}15` }}>
            <Icon className="w-4.5 h-4.5" style={{ color: config.color }} />
          </div>
        ); })()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading text-sm font-bold text-foreground truncate">
              {facility.name}
            </h3>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: config.color }}
            >
              {config.label}
            </span>
          </div>

          {facility.distance != null && (
            <p className="text-xs text-muted mb-2">
              {facility.distance < 1
                ? `${Math.round(facility.distance * 1000)}m away`
                : `${facility.distance.toFixed(1)}km away`}
            </p>
          )}

          <div className="space-y-1">
            {facility.address && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{facility.address}</span>
              </div>
            )}
            {facility.phone && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Phone className="h-3 w-3 shrink-0" />
                <span>{facility.phone}</span>
              </div>
            )}
            {facility.openingHours && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="truncate">{facility.openingHours}</span>
              </div>
            )}
            {facility.website && (
              <div className="flex items-center gap-1.5 text-xs text-accent-coral">
                <Globe className="h-3 w-3 shrink-0" />
                <a
                  href={facility.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="truncate hover:underline"
                >
                  Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
