"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { brazilGeoJSON } from "@/lib/brazil-geojson";

interface BrazilMapProps {
  data: { name: string; value: number }[];
}

function interpolateColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "#2E2E33";
  const ratio = Math.min(value / max, 1);
  const r = Math.round(0x2e + (0xf9 - 0x2e) * ratio);
  const g = Math.round(0x2e + (0x73 - 0x2e) * ratio);
  const b = Math.round(0x33 + (0x16 - 0x33) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function BrazilMap({ data }: BrazilMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dataMap = new Map(data.map((d) => [d.name, d.value]));
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  const style = useCallback(
    (feature: GeoJSON.Feature | undefined) => {
      if (!feature || !feature.properties) {
        return {
          fillColor: "#2E2E33",
          weight: 1,
          opacity: 1,
          color: "#18181B",
          fillOpacity: 0.85,
        };
      }
      const uf = feature.properties.UF as string;
      const value = dataMap.get(uf) || 0;
      return {
        fillColor: interpolateColor(value, maxValue),
        weight: 1,
        opacity: 1,
        color: "#18181B",
        fillOpacity: 0.85,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxValue, data]
  );

  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      if (!feature.properties) return;
      const uf = feature.properties.UF as string;
      const name = feature.properties.name as string;
      const value = dataMap.get(uf) || 0;

      layer.bindTooltip(
        `<div style="font-size:13px;font-weight:600;color:#FAFAF9;">${name} (${uf})</div>
         <div style="font-size:12px;color:#A1A1AA;">${value.toLocaleString("pt-BR")} licitações</div>`,
        {
          sticky: true,
          direction: "top",
          className: "brazil-map-tooltip",
        }
      );

      const pathLayer = layer as L.Path;

      layer.on({
        mouseover: () => {
          pathLayer.setStyle({
            weight: 2,
            color: "#F97316",
            fillOpacity: 1,
          });
          pathLayer.bringToFront();
        },
        mouseout: () => {
          if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(pathLayer);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxValue, data]
  );

  if (!isMounted) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-card">
        <div className="border-b border-dark-border p-5">
          <h3 className="font-semibold text-text-primary">
            Licitações por Estado
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
          center={[-14.235, -51.925]}
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
          <GeoJSON
            ref={geoJsonRef as any}
            data={brazilGeoJSON}
            style={style}
            onEachFeature={onEachFeature}
          />
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
