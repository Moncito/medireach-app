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

      const size = isSelected ? 36 : 28;
      const icon = L.divIcon({
        html: `<svg width="${size}" height="${size + 8}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${config.color}" ${isSelected ? `stroke="white" stroke-width="2"` : ""}/>
          <circle cx="14" cy="14" r="8" fill="white"/>
          <text x="14" y="${config.icon.length > 1 ? "17" : "18"}" text-anchor="middle" fill="${config.color}" font-size="${config.icon.length > 1 ? "9" : "12"}" font-weight="700" font-family="system-ui,sans-serif">${config.icon}</text>
        </svg>`,
        className: "",
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 8],
      });

      const marker = L.marker([f.lat, f.lon], { icon });
      marker.on("click", () => onSelect(f));

      // Build popup as DOM nodes to prevent XSS from OSM data
      const popupEl = document.createElement("div");
      const nameEl = document.createElement("strong");
      nameEl.textContent = f.name;
      popupEl.appendChild(nameEl);
      popupEl.appendChild(document.createElement("br"));
      const typeEl = document.createElement("span");
      typeEl.textContent = config.label;
      typeEl.style.color = config.color;
      popupEl.appendChild(typeEl);
      if (f.address) {
        popupEl.appendChild(document.createElement("br"));
        const addrEl = document.createElement("small");
        addrEl.textContent = f.address;
        popupEl.appendChild(addrEl);
      }
      marker.bindPopup(popupEl);

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
