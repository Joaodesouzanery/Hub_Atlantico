"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
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
  if (max === 0 || value === 0) return "#E2E8F0";
  const ratio = Math.min(value / max, 1);
  const r = Math.round(0xe2 + (0xf9 - 0xe2) * ratio);
  const g = Math.round(0xe8 + (0x73 - 0xe8) * ratio);
  const b = Math.round(0xf0 + (0x16 - 0xf0) * ratio);
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
          Licitações por Estado
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">Distribuição geográfica das licitações ativas</p>
      </div>
      <div className="relative p-4">
        <style>{`
          .brazil-map-tooltip {
            background: #1C1C1F !important;
            border: 1px solid #F97316 !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
            color: #FAFAF9 !important;
          }
          .brazil-map-tooltip::before {
            border-top-color: #F97316 !important;
          }
          .leaflet-container {
            background: #f0ebe3 !important;
            border-radius: 8px;
          }
          .leaflet-control-zoom {
            border: 1px solid #d0ccc4 !important;
            border-radius: 8px !important;
            overflow: hidden;
          }
          .leaflet-control-zoom a {
            background: #fff !important;
            color: #333 !important;
            border-bottom: 1px solid #d0ccc4 !important;
            font-size: 16px !important;
            line-height: 26px !important;
          }
          .leaflet-control-zoom a:hover {
            background: #f5f5f5 !important;
          }
          .leaflet-control-attribution {
            display: none !important;
          }
        `}</style>
        <MapContainer
          center={[-14.0, -52.0]}
          zoom={4}
          style={{ height: "420px", width: "100%", borderRadius: "8px" }}
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          {/* CartoDB Voyager — mostra labels, ícones de cidades e estradas com visual limpo */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          <ZoomControl position="bottomright" />
          {Object.entries(stateCapitals).map(([uf, coords]) => {
            const value = dataMap.get(uf) || 0;
            const radius = interpolateRadius(value, maxValue);
            const color = interpolateColor(value, maxValue);
            const hasData = value > 0;

            return (
              <CircleMarker
                key={uf}
                center={[coords.lat, coords.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: hasData ? color : "rgba(249,115,22,0.15)",
                  fillOpacity: hasData ? 0.88 : 0.5,
                  color: hasData ? "#F97316" : "#F9731688",
                  weight: hasData ? 2 : 1,
                  opacity: 1,
                }}
              >
                <Tooltip
                  direction="top"
                  sticky={true}
                  className="brazil-map-tooltip"
                  offset={[0, -4]}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#FAFAF9", marginBottom: 2 }}>
                    {coords.name} <span style={{ color: "#F97316" }}>({uf})</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#A1A1AA" }}>
                    {hasData
                      ? <><span style={{ color: "#F97316", fontWeight: 600 }}>{value.toLocaleString("pt-BR")}</span> licitações ativas</>
                      : "Sem licitações no período"
                    }
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Menos</span>
            <div className="h-2 w-28 rounded-full bg-gradient-to-r from-[#F9731622] to-[#F97316]" />
            <span className="text-[10px] text-text-muted">Mais</span>
          </div>
          <span className="text-[10px] text-text-muted">
            Máx: <span className="font-semibold text-accent">{maxValue.toLocaleString("pt-BR")}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
