"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface BrazilMapProps {
  data: { name: string; value: number }[];
}

const stateCapitals: Record<string, { lat: number; lng: number; name: string }> = {
  AC: { lat: -9.97, lng: -67.81, name: "Acre" },
  AL: { lat: -9.67, lng: -35.74, name: "Alagoas" },
  AM: { lat: -3.12, lng: -60.02, name: "Amazonas" },
  AP: { lat: 0.03, lng: -51.05, name: "Amapa" },
  BA: { lat: -12.97, lng: -38.51, name: "Bahia" },
  CE: { lat: -3.72, lng: -38.54, name: "Ceara" },
  DF: { lat: -15.78, lng: -47.93, name: "Distrito Federal" },
  ES: { lat: -20.32, lng: -40.34, name: "Espirito Santo" },
  GO: { lat: -16.68, lng: -49.25, name: "Goias" },
  MA: { lat: -2.53, lng: -44.28, name: "Maranhao" },
  MG: { lat: -19.92, lng: -43.94, name: "Minas Gerais" },
  MS: { lat: -20.44, lng: -54.65, name: "Mato Grosso do Sul" },
  MT: { lat: -15.6, lng: -56.1, name: "Mato Grosso" },
  PA: { lat: -1.46, lng: -48.5, name: "Para" },
  PB: { lat: -7.12, lng: -34.86, name: "Paraiba" },
  PE: { lat: -8.05, lng: -34.87, name: "Pernambuco" },
  PI: { lat: -5.09, lng: -42.8, name: "Piaui" },
  PR: { lat: -25.43, lng: -49.27, name: "Parana" },
  RJ: { lat: -22.91, lng: -43.17, name: "Rio de Janeiro" },
  RN: { lat: -5.79, lng: -35.21, name: "Rio Grande do Norte" },
  RO: { lat: -8.76, lng: -63.9, name: "Rondonia" },
  RR: { lat: 2.82, lng: -60.67, name: "Roraima" },
  RS: { lat: -30.03, lng: -51.23, name: "Rio Grande do Sul" },
  SC: { lat: -27.59, lng: -48.55, name: "Santa Catarina" },
  SE: { lat: -10.91, lng: -37.07, name: "Sergipe" },
  SP: { lat: -23.55, lng: -46.63, name: "Sao Paulo" },
  TO: { lat: -10.18, lng: -48.33, name: "Tocantins" },
};

function interpolateColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "#2E2E33";
  const ratio = Math.min(value / max, 1);
  const r = Math.round(0x2e + (0xf9 - 0x2e) * ratio);
  const g = Math.round(0x2e + (0x73 - 0x2e) * ratio);
  const b = Math.round(0x33 + (0x16 - 0x33) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

function interpolateRadius(value: number, max: number): number {
  if (max === 0 || value === 0) return 5;
  const ratio = Math.min(value / max, 1);
  return 5 + ratio * 20; // 5 to 25
}

export function BrazilMap({ data }: BrazilMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dataMap = new Map(data.map((d) => [d.name, d.value]));
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-card">
        <div className="border-b border-dark-border p-5">
          <h3 className="font-semibold text-text-primary">
            Licitacoes por Estado
          </h3>
        </div>
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-border border-t-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">
          Licitacoes por Estado
        </h3>
      </div>
      <div className="relative p-4">
        <style>{`
          .brazil-map-tooltip {
            background: #27272A !important;
            border: 1px solid #3F3F46 !important;
            border-radius: 8px !important;
            padding: 6px 10px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
          }
          .brazil-map-tooltip::before {
            border-top-color: #3F3F46 !important;
          }
          .leaflet-container {
            background: #18181B !important;
            border-radius: 8px;
          }
        `}</style>
        <MapContainer
          center={[-15.78, -47.93]}
          zoom={4}
          style={{ height: "400px", width: "100%", borderRadius: "8px" }}
          zoomControl={true}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          {Object.entries(stateCapitals).map(([uf, coords]) => {
            const value = dataMap.get(uf) || 0;
            const radius = interpolateRadius(value, maxValue);
            const color = interpolateColor(value, maxValue);

            return (
              <CircleMarker
                key={uf}
                center={[coords.lat, coords.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.85,
                  color: value > 0 ? "#F97316" : "#3F3F46",
                  weight: value > 0 ? 1.5 : 0.5,
                  opacity: 1,
                }}
              >
                <Tooltip
                  direction="top"
                  sticky={true}
                  className="brazil-map-tooltip"
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FAFAF9" }}>
                    {coords.name} ({uf})
                  </div>
                  <div style={{ fontSize: "12px", color: "#A1A1AA" }}>
                    {value.toLocaleString("pt-BR")} licitacoes
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] text-text-muted">0</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[#2E2E33] to-[#F97316]" />
          <span className="text-[10px] text-text-muted">
            {maxValue.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}
