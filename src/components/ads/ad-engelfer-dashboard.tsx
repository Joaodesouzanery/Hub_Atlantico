"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink, X } from "lucide-react";

const DISMISSED_KEY = "dashboard_ad_dismissed_at";
const ROTATION_KEY = "dashboard_ad_index";

const SPONSORS = [
  {
    name: "Engelfer Engenharia",
    tagline: "Projetos e execução em saneamento, infraestrutura hídrica e engenharia ambiental.",
    url: "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    bg: "from-[#1B3A2B] to-[#1B3A2B]/80",
    border: "#1B3A2B",
    cta: "Conhecer",
    ctaBg: "bg-accent hover:bg-orange-500",
    badge: (
      <svg width="52" height="52" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="94" stroke="white" strokeWidth="3" fill="none" opacity="0.8" />
        <circle cx="100" cy="100" r="66" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
        <g transform="translate(100, 100)">
          <polygon points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13" stroke="#9CA3AF" strokeWidth="3" fill="none" />
          <polygon points="0,-16 13.8,-8 13.8,8 0,16 -13.8,8 -13.8,-8" stroke="#9CA3AF" strokeWidth="2" fill="none" transform="rotate(30)" />
          <rect x="-7" y="-7" width="14" height="14" stroke="#9CA3AF" strokeWidth="2" fill="none" transform="rotate(45)" />
        </g>
      </svg>
    ),
  },
  {
    name: "ConstruData",
    tagline: "Inteligência Operacional para Construção e Saneamento.",
    url: "https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    bg: "from-[#0F172A] to-[#1E293B]",
    border: "#3B82F6",
    cta: "Conhecer",
    ctaBg: "bg-blue-500 hover:bg-blue-600",
    badge: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/sponsors/construdata-logo.svg" alt="ConstruData" className="h-[52px] w-[52px] rounded-lg" />
    ),
  },
];

/**
 * Banner de anúncio no dashboard, abaixo dos KPI cards.
 * Alterna entre Engelfer e ConstruData. Fecha com X, reaparece em 24h.
 */
export function AdEngelferDashboard() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Rotation
    const stored = parseInt(localStorage.getItem(ROTATION_KEY) || "0", 10);
    setIndex(stored);
    localStorage.setItem(ROTATION_KEY, String((stored + 1) % SPONSORS.length));

    // Dismissal check
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (!dismissedAt) {
      setVisible(true);
      return;
    }
    const elapsed = Date.now() - parseInt(dismissedAt, 10);
    if (elapsed > 24 * 60 * 60 * 1000) {
      setVisible(true);
    }
  }, [pathname]);

  function dismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  const sponsor = SPONSORS[index] || SPONSORS[0];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-r ${sponsor.bg} px-5 transition-all hover:shadow-lg`}
      style={{ minHeight: 80, borderColor: `${sponsor.border}60` }}
      aria-label={`${sponsor.name} — Patrocinado`}
    >
      <span className="absolute left-5 top-2 text-[9px] font-semibold uppercase tracking-widest text-white/40">
        Patrocinado
      </span>

      <div className="mr-4 mt-2 hidden shrink-0 sm:block">
        {sponsor.badge}
      </div>

      <div className="flex-1 py-4">
        <p className="text-sm font-bold text-white">{sponsor.name}</p>
        <p className="mt-0.5 text-xs text-white/70">{sponsor.tagline}</p>
      </div>

      <div className={`ml-4 flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg ${sponsor.ctaBg} px-4 text-sm font-semibold text-white transition-colors`}>
        <span>{sponsor.cta}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </div>

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
