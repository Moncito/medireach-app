"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Facility, FACILITY_CONFIG } from "@/lib/overpass";

interface FacilityMapProps {
  center: [number, number];
  facilities: Facility[];
  selectedId: number | null;
  onSelect: (facility: Facility) => void;
}

export function FacilityMap({ center, facilities, selectedId, onSelect }: FacilityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      html: `<div style="width:16px;height:16px;background:#FF6B35;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(center, { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup("You are here");

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center
  useEffect(() => {
    mapRef.current?.setView(center, 14);
  }, [center]);

  // Update facility markers
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    facilities.forEach((f) => {
      const config = FACILITY_CONFIG[f.type];
      const isSelected = f.id === selectedId;

      const icon = L.divIcon({
        html: `<div style="
          font-size:${isSelected ? "24px" : "20px"};
          filter:${isSelected ? "drop-shadow(0 0 6px " + config.color + ")" : "none"};
          transition:all 0.2s;
          cursor:pointer;
        ">${config.emoji}</div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([f.lat, f.lon], { icon });
      marker.on("click", () => onSelect(f));
      marker.bindPopup(
        `<strong>${f.name}</strong><br/><span style="color:${config.color}">${config.label}</span>${f.address ? `<br/><small>${f.address}</small>` : ""}`
      );

      markersRef.current!.addLayer(marker);
    });
  }, [facilities, selectedId, onSelect]);

  // Pan to selected facility
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const f = facilities.find((x) => x.id === selectedId);
    if (f) mapRef.current.setView([f.lat, f.lon], 16, { animate: true });
  }, [selectedId, facilities]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: 400 }}
    />
  );
}
