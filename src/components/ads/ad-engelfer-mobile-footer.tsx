"use client";

import { ExternalLink } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

/**
 * Barra fixa no rodapé em dispositivos móveis (visível apenas em < lg).
 * Exibida no layout principal, acima do footer existente.
 */
export function AdEngelferMobileFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[60px] items-center justify-between gap-3 border-t-2 border-accent bg-dark-surface px-4"
        aria-label="Engelfer Engenharia — Patrocinado"
      >
        {/* Texto */}
        <div className="min-w-0">
          <span className="block text-[8px] font-semibold uppercase tracking-widest text-text-muted">
            Patrocinado
          </span>
          <p className="truncate text-xs font-semibold text-text-primary">
            Engelfer Engenharia
          </p>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 min-h-[44px] items-center gap-1.5 rounded-lg bg-accent px-4 text-xs font-semibold text-white">
          <span>Ver no Instagram</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </a>
    </div>
  );
}
