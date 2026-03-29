"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink, X, ChevronDown, Ticket } from "lucide-react";

interface Sponsor {
  name: string;
  tagline: string;
  url: string;
  ctaText: string;
  bgColor: string;
  accentColor: string;
  couponCode: string;
  badge: React.ReactNode;
}

const ENGELFER: Sponsor = {
  name: "Engelfer Engenharia",
  tagline: "Soluções em saneamento e infraestrutura",
  url: "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  ctaText: "Ver no Instagram",
  bgColor: "#1B3A2B",
  accentColor: "#F97316",
  couponCode: "HUBPRO10",
  badge: <EngelferBadge />,
};

const CONSTRUDATA: Sponsor = {
  name: "ConstruData",
  tagline: "Inteligência Operacional para Construção e Saneamento",
  url: "https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  ctaText: "Conhecer",
  bgColor: "#0F172A",
  accentColor: "#3B82F6",
  couponCode: "HUBPRO10",
  badge: <ConstruDataBadge />,
};

const SPONSORS = [ENGELFER, CONSTRUDATA];
const ROTATION_KEY = "sponsor_rotation_index";
const DISMISSED_KEY = "sponsor_sidebar_dismissed";

function EngelferBadge() {
  return (
    <svg width={90} height={90} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Engelfer Engenharia">
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
        <path id="topArcS" d="M 18,100 A 82,82 0 0,1 182,100" />
        <path id="bottomArcS" d="M 32,114 A 74,74 0 0,0 168,114" />
      </defs>
      <text fontSize="15" fontWeight="700" fill="white" letterSpacing="4" fontFamily="system-ui, sans-serif">
        <textPath href="#topArcS" startOffset="50%" textAnchor="middle">ENGELFER</textPath>
      </text>
      <text fontSize="11" fontWeight="500" fill="white" letterSpacing="3" fontFamily="system-ui, sans-serif" opacity="0.85">
        <textPath href="#bottomArcS" startOffset="50%" textAnchor="middle">ENGENHARIA</textPath>
      </text>
    </svg>
  );
}

function ConstruDataBadge() {
  return (
    <svg width={90} height={90} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ConstruData">
      <circle cx="100" cy="100" r="100" fill="#0F172A" />
      <circle cx="100" cy="100" r="94" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="100" cy="100" r="66" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.5" />
      <g transform="translate(100, 100)">
        <rect x="-22" y="-5" width="10" height="25" rx="2" fill="#3B82F6" opacity="0.7" />
        <rect x="-7" y="-18" width="10" height="38" rx="2" fill="#3B82F6" opacity="0.85" />
        <rect x="8" y="-12" width="10" height="32" rx="2" fill="#3B82F6" />
        <path d="M-17 -8 L-2 -20 L13 -14" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13" cy="-14" r="3" fill="#60A5FA" />
      </g>
      <defs>
        <path id="topArcCD" d="M 18,100 A 82,82 0 0,1 182,100" />
        <path id="bottomArcCD" d="M 32,114 A 74,74 0 0,0 168,114" />
      </defs>
      <text fontSize="14" fontWeight="700" fill="white" letterSpacing="3" fontFamily="system-ui, sans-serif">
        <textPath href="#topArcCD" startOffset="50%" textAnchor="middle">CONSTRUDATA</textPath>
      </text>
      <text fontSize="10" fontWeight="500" fill="#60A5FA" letterSpacing="2" fontFamily="system-ui, sans-serif" opacity="0.9">
        <textPath href="#bottomArcCD" startOffset="50%" textAnchor="middle">SOFTWARE</textPath>
      </text>
    </svg>
  );
}

export function AdSponsorSidebar({ isPremium = false }: { isPremium?: boolean }) {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Rotate sponsor on every page navigation
  useEffect(() => {
    const stored = parseInt(localStorage.getItem(ROTATION_KEY) || "0", 10);
    setIndex(stored);
    const next = (stored + 1) % SPONSORS.length;
    localStorage.setItem(ROTATION_KEY, String(next));

    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY) === "true";
    setDismissed(wasDismissed);
  }, [pathname]);

  const sponsor = SPONSORS[index] || SPONSORS[0];

  // If dismissed, show a small "reopen" button
  if (dismissed) {
    return (
      <button
        onClick={() => {
          setDismissed(false);
          sessionStorage.removeItem(DISMISSED_KEY);
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-[10px] text-text-muted transition-colors hover:bg-dark-hover"
      >
        <ChevronDown className="h-3 w-3" />
        Ver patrocinador
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-dark-border bg-dark-card">
      {/* Close button */}
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem(DISMISSED_KEY, "true");
        }}
        className="absolute right-1.5 top-1.5 z-10 rounded-md p-1 text-text-muted transition-colors hover:bg-dark-hover hover:text-text-primary"
        title="Fechar anúncio"
      >
        <X className="h-3 w-3" />
      </button>

      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label={`${sponsor.name} — ${sponsor.ctaText}`}
      >
        {/* Badge Patrocinado */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">
            Patrocinado
          </span>
          <ExternalLink className="h-3 w-3 text-text-muted transition-colors group-hover:text-accent" />
        </div>

        {/* Logo SVG */}
        <div
          className="flex items-center justify-center py-3 mx-3 rounded-lg"
          style={{ backgroundColor: `${sponsor.bgColor}40` }}
        >
          {sponsor.badge}
        </div>

        {/* Texto */}
        <div className="px-3 py-2">
          <p className="text-[11px] font-semibold text-text-primary leading-tight">
            {sponsor.name}
          </p>
          <p className="text-[10px] text-text-muted leading-snug mt-0.5">
            {sponsor.tagline}
          </p>
        </div>

        {/* CTA */}
        <div className="px-3 pb-2">
          <div
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: sponsor.accentColor }}
          >
            <span>{sponsor.ctaText}</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </a>

      {/* Cupom 10% para assinantes Premium */}
      {isPremium && (
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2">
          <Ticket className="h-3.5 w-3.5 shrink-0 text-accent" />
          <div>
            <p className="text-[10px] font-bold text-accent">10% OFF exclusivo Pro</p>
            <p className="text-[9px] text-text-muted">
              Cupom: <span className="font-mono font-bold text-text-primary">{sponsor.couponCode}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
