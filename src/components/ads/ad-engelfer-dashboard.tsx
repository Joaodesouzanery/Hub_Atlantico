"use client";

import { useState, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const DISMISSED_KEY = "engelfer_dashboard_dismissed_at";

/**
 * Banner de anúncio no dashboard, abaixo dos KPI cards.
 * Fecha com ×, não reaparece por 24h.
 */
export function AdEngelferDashboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (!dismissedAt) {
      setVisible(true);
      return;
    }
    const elapsed = Date.now() - parseInt(dismissedAt, 10);
    if (elapsed > 24 * 60 * 60 * 1000) {
      setVisible(true);
    }
  }, []);

  function dismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[#1B3A2B]/60 bg-gradient-to-r from-[#1B3A2B] to-[#1B3A2B]/80 px-5 transition-all hover:border-[#1B3A2B] hover:shadow-lg"
      style={{ minHeight: 80 }}
      aria-label="Engelfer Engenharia — Patrocinado"
    >
      {/* Badge */}
      <span className="absolute left-5 top-2 text-[9px] font-semibold uppercase tracking-widest text-white/40">
        Patrocinado
      </span>

      {/* SVG badge pequeno */}
      <div className="mr-4 mt-2 hidden shrink-0 sm:block">
        <svg width="52" height="52" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="100" cy="100" r="94" stroke="white" strokeWidth="3" fill="none" opacity="0.8" />
          <circle cx="100" cy="100" r="66" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
          <g transform="translate(100, 100)">
            <polygon points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13" stroke="#9CA3AF" strokeWidth="3" fill="none" />
            <polygon points="0,-16 13.8,-8 13.8,8 0,16 -13.8,8 -13.8,-8" stroke="#9CA3AF" strokeWidth="2" fill="none" transform="rotate(30)" />
            <rect x="-7" y="-7" width="14" height="14" stroke="#9CA3AF" strokeWidth="2" fill="none" transform="rotate(45)" />
          </g>
        </svg>
      </div>

      {/* Texto */}
      <div className="flex-1 py-4">
        <p className="text-sm font-bold text-white">Engelfer Engenharia</p>
        <p className="mt-0.5 text-xs text-white/70">
          Projetos e execução em saneamento, infraestrutura hídrica e engenharia ambiental.
        </p>
      </div>

      {/* CTA */}
      <div className="ml-4 flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors group-hover:bg-orange-500">
        <span>Conhecer</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </div>

      {/* Fechar */}
      <button
        onClick={dismiss}
        className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Fechar anúncio"
      >
        <X className="h-4 w-4" />
      </button>
    </a>
  );
}
