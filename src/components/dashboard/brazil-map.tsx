"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

interface BrazilMapProps {
  data: { name: string; value: number }[];
}

// Centróides das capitais estaduais para CircleMarkers
const stateInfo: Record<string, { lat: number; lng: number; name: string }> = {
  AC: { lat: -9.97, lng: -67.81, name: "Acre" },
  AL: { lat: -9.67, lng: -35.74, name: "Alagoas" },
  AM: { lat: -3.12, lng: -60.02, name: "Amazonas" },
  AP: { lat: 0.03, lng: -51.05, name: "Amapá" },
  BA: { lat: -12.97, lng: -38.51, name: "Bahia" },
  CE: { lat: -3.72, lng: -38.54, name: "Ceará" },
  DF: { lat: -15.78, lng: -47.93, name: "Distrito Federal" },
  ES: { lat: -20.32, lng: -40.34, name: "Espírito Santo" },
  GO: { lat: -16.68, lng: -49.25, name: "Goiás" },
  MA: { lat: -2.53, lng: -44.28, name: "Maranhão" },
  MG: { lat: -19.92, lng: -43.94, name: "Minas Gerais" },
  MS: { lat: -20.44, lng: -54.65, name: "Mato Grosso do Sul" },
  MT: { lat: -15.6, lng: -56.1, name: "Mato Grosso" },
  PA: { lat: -1.46, lng: -48.5, name: "Pará" },
  PB: { lat: -7.12, lng: -34.86, name: "Paraíba" },
  PE: { lat: -8.05, lng: -34.87, name: "Pernambuco" },
  PI: { lat: -5.09, lng: -42.8, name: "Piauí" },
  PR: { lat: -25.43, lng: -49.27, name: "Paraná" },
  RJ: { lat: -22.91, lng: -43.17, name: "Rio de Janeiro" },
  RN: { lat: -5.79, lng: -35.21, name: "Rio Grande do Norte" },
  RO: { lat: -8.76, lng: -63.9, name: "Rondônia" },
  RR: { lat: 2.82, lng: -60.67, name: "Roraima" },
  RS: { lat: -30.03, lng: -51.23, name: "Rio Grande do Sul" },
  SC: { lat: -27.59, lng: -48.55, name: "Santa Catarina" },
  SE: { lat: -10.91, lng: -37.07, name: "Sergipe" },
  SP: { lat: -23.55, lng: -46.63, name: "São Paulo" },
  TO: { lat: -10.18, lng: -48.33, name: "Tocantins" },
};

// Mapeamento: código IBGE → sigla UF (API v2 usa "codarea")
const ibgeCodeToUF: Record<string, string> = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR",
  "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN",
  "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA",
  "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
  "41": "PR", "42": "SC", "43": "RS",
  "50": "MS", "51": "MT", "52": "GO", "53": "DF",
};

function getChoroColor(value: number, max: number): string {
  if (value === 0 || max === 0) return "rgba(249,115,22,0.08)";
  const ratio = Math.min(value / max, 1);
  // Escala: laranja bem transparente → laranja sólido
  const opacity = 0.15 + ratio * 0.70;
  return `rgba(249, 115, 22, ${opacity.toFixed(2)})`;
}

function interpolateRadius(value: number, max: number): number {
  if (max === 0 || value === 0) return 5;
  return 5 + Math.min(value / max, 1) * 20;
}

export function BrazilMap({ data }: BrazilMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const geoJsonRef = useRef<import("leaflet").GeoJSON | null>(null);

  const dataMap = new Map(data.map((d) => [d.name, d.value]));
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  useEffect(() => {
    setIsMounted(true);

    // API oficial do IBGE — retorna polígonos dos 27 estados, resolução 2 (simplificada)
    fetch(
      "https://servicodados.ibge.gov.br/api/v2/malhas/?resolucao=2&formato=application/vnd.geo+json",
      { cache: "force-cache" }
    )
      .then((r) => {
        if (!r.ok) throw new Error("IBGE fetch failed");
        return r.json();
      })
      .then((json: FeatureCollection) => setGeoData(json))
      .catch(() => {
        // Fallback silencioso — mapa mostra só CircleMarkers
      });
  }, []);

  // Re-aplica estilos no layer GeoJSON quando os dados mudam
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer((layer) => {
      const l = layer as import("leaflet").Path & { feature?: Feature };
      const ibgeCode = l.feature?.properties?.codarea ?? "";
      const uf = ibgeCodeToUF[ibgeCode] ?? "";
      const value = dataMap.get(uf) ?? 0;
      l.setStyle({
        fillColor: getChoroColor(value, maxValue),
        fillOpacity: 1,
        color: "#F97316",
        weight: 0.8,
      });
    });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateStyle = useCallback(
    (feature?: Feature): PathOptions => {
      const ibgeCode = feature?.properties?.codarea ?? "";
      const uf = ibgeCodeToUF[ibgeCode] ?? "";
      const value = dataMap.get(uf) ?? 0;
      return {
        fillColor: getChoroColor(value, maxValue),
        fillOpacity: 1,
        color: "#F97316",
        weight: 0.8,
      };
    },
    [dataMap, maxValue] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: import("leaflet").Layer) => {
      const ibgeCode = feature?.properties?.codarea ?? "";
      const uf = ibgeCodeToUF[ibgeCode] ?? "";
      const info = stateInfo[uf];
      const value = dataMap.get(uf) ?? 0;

      const path = layer as import("leaflet").Path;

      if (info) {
        path.bindTooltip(
          `<div style="font-size:13px;font-weight:700;color:#FAFAF9;margin-bottom:2px;">
            ${info.name} <span style="color:#F97316;">(${uf})</span>
           </div>
           <div style="font-size:12px;color:#A1A1AA;">
             ${
               value > 0
                 ? `<span style="color:#F97316;font-weight:600;">${value.toLocaleString("pt-BR")}</span> licitações ativas`
                 : "Sem licitações no período"
             }
           </div>`,
          { className: "brazil-map-tooltip", sticky: true }
        );
      }

      path.on({
        mouseover: (e) => {
          (e.target as import("leaflet").Path).setStyle({
            weight: 2.5,
            color: "#F97316",
            fillOpacity: 0.95,
          });
        },
        mouseout: (e) => {
          (e.target as import("leaflet").Path).setStyle({
            weight: 0.8,
            color: "#F97316",
            fillOpacity: 1,
          });
        },
      });
    },
    [dataMap] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const skeleton = (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">Licitações por Estado</h3>
        <p className="mt-0.5 text-xs text-text-muted">
          Distribuição geográfica das licitações ativas
        </p>
      </div>
      <div className="flex h-[420px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-border border-t-accent" />
      </div>
    </div>
  );

  if (!isMounted) return skeleton;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">Licitações por Estado</h3>
        <p className="mt-0.5 text-xs text-text-muted">
          Distribuição geográfica das licitações ativas
        </p>
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
            background: #e8f4f8 !important;
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
          {/* CartoDB Voyager — tiles com rótulos de cidades e visual limpo */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          <ZoomControl position="bottomright" />

          {/* Layer GeoJSON com polígonos dos estados (choropleth) */}
          {geoData && (
            <GeoJSON
              ref={(ref) => { geoJsonRef.current = ref; }}
              key={maxValue}
              data={geoData}
              style={stateStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {/* CircleMarkers nas capitais — visíveis sempre, maiores quando há dados */}
          {Object.entries(stateInfo).map(([uf, coords]) => {
            const value = dataMap.get(uf) ?? 0;
            const radius = interpolateRadius(value, maxValue);
            const hasData = value > 0;

            return (
              <CircleMarker
                key={uf}
                center={[coords.lat, coords.lng]}
                radius={hasData ? radius : 4}
                pathOptions={{
                  fillColor: hasData ? "#F97316" : "rgba(249,115,22,0.3)",
                  fillOpacity: hasData ? 0.95 : 0.6,
                  color: hasData ? "#fff" : "#F9731688",
                  weight: hasData ? 1.5 : 1,
                }}
              >
                <Tooltip
                  direction="top"
                  sticky={true}
                  className="brazil-map-tooltip"
                  offset={[0, -4]}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#FAFAF9",
                      marginBottom: 2,
                    }}
                  >
                    {coords.name}{" "}
                    <span style={{ color: "#F97316" }}>({uf})</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#A1A1AA" }}>
                    {hasData ? (
                      <>
                        <span style={{ color: "#F97316", fontWeight: 600 }}>
                          {value.toLocaleString("pt-BR")}
                        </span>{" "}
                        licitações ativas
                      </>
                    ) : (
                      "Sem licitações no período"
                    )}
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Legenda */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Menos</span>
            <div className="h-2 w-28 rounded-full bg-gradient-to-r from-[#F9731614] to-[#F97316]" />
            <span className="text-[10px] text-text-muted">Mais</span>
          </div>
          {maxValue > 1 && (
            <span className="text-[10px] text-text-muted">
              Máx:{" "}
              <span className="font-semibold text-accent">
                {maxValue.toLocaleString("pt-BR")}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
