"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

const SPONSORS = [
  {
    name: "ConstruData",
    tagline: "Inteligência Operacional para Construção e Saneamento",
    url: "https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    accent: "#3B82F6",
    logo: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/sponsors/construdata-logo.svg" alt="ConstruData" className="h-8 w-8 rounded-md" />
    ),
  },
  {
    name: "Engelfer Engenharia",
    tagline: "Soluções em saneamento e infraestrutura hídrica",
    url: "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    accent: "#F97316",
    logo: (
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1B3A2B]">
        <svg width={16} height={16} viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" stroke="white" strokeWidth="2" fill="none" />
          <rect x="15" y="15" width="10" height="10" stroke="white" strokeWidth="1.5" fill="none" transform="rotate(45 20 20)" />
        </svg>
      </div>
    ),
  },
];

const KEY = "inline_sponsor_idx";

/**
 * Small inline sponsor banner — fits inside any page.
 * Alternates between sponsors on each page navigation.
 */
export function InlineSponsor() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(KEY) || "0", 10);
    setIndex(stored);
    localStorage.setItem(KEY, String((stored + 1) % SPONSORS.length));
  }, [pathname]);

  const sponsor = SPONSORS[index] || SPONSORS[0];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 transition-all hover:border-dark-hover hover:shadow-md"
    >
      {sponsor.logo}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Patrocinado</span>
        </div>
        <p className="truncate text-xs font-medium text-text-primary">{sponsor.name}</p>
        <p className="truncate text-[10px] text-text-muted">{sponsor.tagline}</p>
      </div>
      <div
        className="flex h-7 shrink-0 items-center gap-1 rounded-md px-2.5 text-[10px] font-semibold text-white"
        style={{ backgroundColor: sponsor.accent }}
      >
        Conhecer
        <ExternalLink className="h-2.5 w-2.5" />
      </div>
    </a>
  );
}
