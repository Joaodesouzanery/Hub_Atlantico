"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

const SPONSORS = [
  {
    name: "Engelfer Engenharia",
    url: "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    cta: "Ver no Instagram",
    accent: "#F97316",
  },
  {
    name: "ConstruData",
    url: "https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    cta: "Conhecer",
    accent: "#3B82F6",
  },
];

const MOBILE_ROTATION_KEY = "sponsor_mobile_index";

/**
 * Barra fixa no rodapé em dispositivos móveis (visível apenas em < lg).
 * Alterna entre patrocinadores a cada navegação.
 */
export function AdEngelferMobileFooter() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(MOBILE_ROTATION_KEY) || "0", 10);
    setIndex(stored);
    localStorage.setItem(MOBILE_ROTATION_KEY, String((stored + 1) % SPONSORS.length));
  }, [pathname]);

  const sponsor = SPONSORS[index] || SPONSORS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[60px] items-center justify-between gap-3 border-t-2 bg-dark-surface px-4"
        style={{ borderColor: sponsor.accent }}
        aria-label={`${sponsor.name} — Patrocinado`}
      >
        <div className="min-w-0">
          <span className="block text-[8px] font-semibold uppercase tracking-widest text-text-muted">
            Patrocinado
          </span>
          <p className="truncate text-xs font-semibold text-text-primary">
            {sponsor.name}
          </p>
        </div>

        <div
          className="flex shrink-0 min-h-[44px] items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-white"
          style={{ backgroundColor: sponsor.accent }}
        >
          <span>{sponsor.cta}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </a>
    </div>
  );
}
