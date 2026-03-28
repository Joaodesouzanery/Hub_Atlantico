"use client";

import { ExternalLink } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

/**
 * Bloco de anúncio para inserção após o 3º parágrafo de uma notícia.
 */
export function AdEngelferNewsDetail() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-6 flex items-center gap-4 overflow-hidden rounded-xl border border-[#1B3A2B]/50 bg-gradient-to-r from-[#1B3A2B]/20 to-transparent px-5 py-4 transition-all hover:border-[#1B3A2B]/80 hover:bg-[#1B3A2B]/25"
      style={{ minHeight: 120 }}
      aria-label="Engelfer Engenharia — Patrocinado"
    >
      {/* SVG badge */}
      <div className="shrink-0">
        <svg width="64" height="64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="100" cy="100" r="100" fill="#1B3A2B" />
          <circle cx="100" cy="100" r="94" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9" />
          <circle cx="100" cy="100" r="66" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
          <line x1="15" y1="100" x2="28" y2="100" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="172" y1="100" x2="185" y2="100" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="translate(100, 100)">
            <polygon points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13" stroke="#9CA3AF" strokeWidth="2" fill="none" />
            <polygon points="0,-16 13.8,-8 13.8,8 0,16 -13.8,8 -13.8,-8" stroke="#9CA3AF" strokeWidth="1.5" fill="none" transform="rotate(30)" />
            <rect x="-7" y="-7" width="14" height="14" stroke="#9CA3AF" strokeWidth="1.5" fill="none" transform="rotate(45)" />
          </g>
          <defs>
            <path id="detailTopArc" d="M 18,100 A 82,82 0 0,1 182,100" />
            <path id="detailBottomArc" d="M 32,114 A 74,74 0 0,0 168,114" />
          </defs>
          <text fontSize="15" fontWeight="700" fill="white" letterSpacing="4" fontFamily="system-ui, sans-serif">
            <textPath href="#detailTopArc" startOffset="50%" textAnchor="middle">ENGELFER</textPath>
          </text>
          <text fontSize="11" fontWeight="500" fill="white" letterSpacing="3" fontFamily="system-ui, sans-serif" opacity="0.85">
            <textPath href="#detailBottomArc" startOffset="50%" textAnchor="middle">ENGENHARIA</textPath>
          </text>
        </svg>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">
            Patrocinado
          </span>
          <p className="mt-0.5 text-sm font-bold text-text-primary">Engelfer Engenharia</p>
          <p className="mt-0.5 text-xs text-text-secondary">
            &ldquo;Excelência em projetos de saneamento e infraestrutura hídrica.&rdquo;
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors group-hover:bg-orange-500">
            <span>Saiba mais</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </a>
  );
}
