"use client";

import { ExternalLink } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

/** SVG inline do badge circular Engelfer (versão escura) */
function EngelferBadgeSVG({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Engelfer Engenharia"
    >
      {/* Fundo circular */}
      <circle cx="100" cy="100" r="100" fill="#1B3A2B" />
      {/* Anel externo */}
      <circle cx="100" cy="100" r="94" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9" />
      {/* Anel interno */}
      <circle cx="100" cy="100" r="66" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />

      {/* Traço decorativo esquerdo */}
      <line x1="15" y1="100" x2="28" y2="100" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Traço decorativo direito */}
      <line x1="172" y1="100" x2="185" y2="100" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ícone geométrico central — hexágono estilizado */}
      <g transform="translate(100, 100)">
        {/* Hexágono externo */}
        <polygon
          points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
          stroke="#9CA3AF" strokeWidth="2" fill="none"
        />
        {/* Hexágono médio rotacionado */}
        <polygon
          points="0,-16 13.8,-8 13.8,8 0,16 -13.8,8 -13.8,-8"
          stroke="#9CA3AF" strokeWidth="1.5" fill="none"
          transform="rotate(30)"
        />
        {/* Quadrado central */}
        <rect x="-7" y="-7" width="14" height="14" stroke="#9CA3AF" strokeWidth="1.5" fill="none" transform="rotate(45)" />
      </g>

      {/* Texto "ENGELFER" curvado no topo */}
      <defs>
        <path id="topArc" d="M 18,100 A 82,82 0 0,1 182,100" />
        <path id="bottomArc" d="M 32,114 A 74,74 0 0,0 168,114" />
      </defs>
      <text fontSize="15" fontWeight="700" fill="white" letterSpacing="4" fontFamily="system-ui, sans-serif">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">ENGELFER</textPath>
      </text>
      {/* Texto "ENGENHARIA" curvado no fundo */}
      <text fontSize="11" fontWeight="500" fill="white" letterSpacing="3" fontFamily="system-ui, sans-serif" opacity="0.85">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">ENGENHARIA</textPath>
      </text>
    </svg>
  );
}

export function AdEngelferSidebar() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-[#1B3A2B] hover:shadow-lg hover:shadow-black/20"
      aria-label="Engelfer Engenharia — Ver no Instagram"
    >
      {/* Badge Patrocinado */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">
          Patrocinado
        </span>
        <ExternalLink className="h-3 w-3 text-text-muted transition-colors group-hover:text-accent" />
      </div>

      {/* Logo SVG centralizado */}
      <div className="flex items-center justify-center py-3 bg-[#1B3A2B]/30 mx-3 rounded-lg">
        <EngelferBadgeSVG size={100} />
      </div>

      {/* Texto descritivo */}
      <div className="px-3 py-2">
        <p className="text-[11px] font-semibold text-text-primary leading-tight">
          Engelfer Engenharia
        </p>
        <p className="text-[10px] text-text-muted leading-snug mt-0.5">
          Soluções em saneamento e infraestrutura
        </p>
      </div>

      {/* CTA — mínimo 44px de altura para touch */}
      <div className="px-3 pb-3">
        <div className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-accent px-3 text-[11px] font-semibold text-white transition-colors group-hover:bg-orange-500">
          <span>Ver no Instagram</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </a>
  );
}
