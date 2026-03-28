"use client";

import { useState } from "react";

interface BrazilMapProps {
  data: { name: string; value: number }[];
}

// Simplified SVG paths for Brazilian states
// viewBox is set so the map is recognizable; paths are approximate
const statePaths: Record<string, string> = {
  AC: "M 78,280 L 98,275 108,285 105,300 85,305 Z",
  AM: "M 100,200 L 180,185 230,195 240,230 220,265 170,275 108,285 98,275 90,240 Z",
  RR: "M 155,145 L 190,130 210,150 200,180 170,185 155,170 Z",
  AP: "M 270,165 L 295,145 310,160 305,185 280,190 Z",
  PA: "M 230,195 L 280,190 310,185 340,195 360,215 350,250 310,260 270,250 240,230 Z",
  MA: "M 350,210 L 380,195 410,205 415,235 395,255 360,250 350,240 Z",
  PI: "M 395,235 L 415,225 430,240 425,275 405,285 390,270 Z",
  CE: "M 430,220 L 455,210 465,230 455,250 435,255 425,240 Z",
  RN: "M 465,230 L 485,225 490,240 475,250 460,248 Z",
  PB: "M 460,250 L 490,245 492,258 465,262 Z",
  PE: "M 435,260 L 492,258 490,275 440,278 430,270 Z",
  AL: "M 470,278 L 492,275 494,290 475,292 Z",
  SE: "M 460,290 L 475,288 478,300 462,302 Z",
  BA: "M 405,285 L 440,278 470,278 475,292 478,300 470,340 440,370 405,365 385,335 380,300 Z",
  TO: "M 340,250 L 360,250 370,260 380,300 370,340 345,340 330,310 325,270 Z",
  GO: "M 325,330 L 370,340 375,360 365,395 340,405 310,395 305,365 Z",
  DF: "M 345,370 L 358,370 358,382 345,382 Z",
  MT: "M 220,265 L 270,250 310,260 325,270 330,310 325,330 305,365 275,370 240,355 215,320 210,290 Z",
  MS: "M 240,355 L 275,370 305,365 310,395 300,425 270,435 245,420 230,390 Z",
  MG: "M 365,360 L 405,365 430,375 440,400 425,430 395,440 365,435 345,415 340,405 345,380 Z",
  ES: "M 440,380 L 460,375 465,400 450,415 435,410 Z",
  RJ: "M 415,430 L 440,420 455,430 445,445 420,445 Z",
  SP: "M 310,410 L 345,415 365,435 380,450 365,470 330,465 305,445 Z",
  PR: "M 285,450 L 330,465 345,475 330,495 300,500 275,485 Z",
  SC: "M 300,500 L 330,495 340,510 325,525 300,520 Z",
  RS: "M 280,510 L 300,520 325,525 330,545 310,570 280,575 260,555 255,530 Z",
  RO: "M 150,280 L 210,290 215,320 200,340 170,340 140,320 135,295 Z",
};

const stateNames: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AM: "Amazonas",
  AP: "Amapa",
  BA: "Bahia",
  CE: "Ceara",
  DF: "Distrito Federal",
  ES: "Espirito Santo",
  GO: "Goias",
  MA: "Maranhao",
  MG: "Minas Gerais",
  MS: "Mato Grosso do Sul",
  MT: "Mato Grosso",
  PA: "Para",
  PB: "Paraiba",
  PE: "Pernambuco",
  PI: "Piaui",
  PR: "Parana",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RO: "Rondonia",
  RR: "Roraima",
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  SE: "Sergipe",
  SP: "Sao Paulo",
  TO: "Tocantins",
};

function interpolateColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "#2E2E33";
  const ratio = Math.min(value / max, 1);
  // Interpolate from dark gray (#2E2E33) to orange (#F97316)
  const r = Math.round(0x2e + (0xf9 - 0x2e) * ratio);
  const g = Math.round(0x2e + (0x73 - 0x2e) * ratio);
  const b = Math.round(0x33 + (0x16 - 0x33) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function BrazilMap({ data }: BrazilMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const dataMap = new Map(data.map((d) => [d.name, d.value]));
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">
          Licitacoes por Estado
        </h3>
      </div>
      <div className="relative p-4">
        <svg
          viewBox="60 120 450 470"
          className="h-auto w-full"
          onMouseMove={handleMouseMove}
        >
          {Object.entries(statePaths).map(([uf, path]) => {
            const value = dataMap.get(uf) || 0;
            const fill = interpolateColor(value, maxValue);
            return (
              <path
                key={uf}
                d={path}
                fill={fill}
                stroke="#18181B"
                strokeWidth={1.5}
                className="cursor-pointer transition-opacity duration-150"
                opacity={hoveredState && hoveredState !== uf ? 0.6 : 1}
                onMouseEnter={() => setHoveredState(uf)}
                onMouseLeave={() => setHoveredState(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 shadow-lg"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 40,
            }}
          >
            <p className="text-xs font-semibold text-text-primary">
              {stateNames[hoveredState] || hoveredState} ({hoveredState})
            </p>
            <p className="text-xs text-text-muted">
              {(dataMap.get(hoveredState) || 0).toLocaleString("pt-BR")}{" "}
              licitacoes
            </p>
          </div>
        )}

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
