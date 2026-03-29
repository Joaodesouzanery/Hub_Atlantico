"use client";

import { usePlan } from "./premium-gate";
import { Crown, ArrowRight, Check } from "lucide-react";

/**
 * Limited view gate — FREE users see real content but limited quantity.
 * Shows an upgrade banner AFTER the limited content (not a blur wall).
 */
export function PremiumPageGate({
  children,
  feature,
}: {
  children: React.ReactNode;
  feature: string;
  freePreviewRows?: number;
}) {
  const { isPremium } = usePlan();

  if (isPremium) return <>{children}</>;

  function handleUpgrade() {
    window.open("https://buy.stripe.com/5kQ00i93i1thcZY7p7cV204", "_blank");
  }

  return (
    <>
      {/* Show full content — server already limits to page 1 */}
      {children}

      {/* Upgrade banner after content */}
      <div className="mt-8 rounded-2xl border border-accent/20 bg-gradient-to-r from-dark-card to-dark-elevated p-6 text-center">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Crown size={24} className="text-accent" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            Quer acesso completo?
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            No plano gratuito você vê {feature} de forma limitada. Com o Pro, acesse tudo sem restrições.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-text-muted">
            {["Conteúdo ilimitado", "Exportação Excel e PDF", "Alertas personalizados", "10% em parceiros"].map((b) => (
              <span key={b} className="flex items-center gap-1">
                <Check size={12} className="text-accent" /> {b}
              </span>
            ))}
          </div>
          <button
            onClick={handleUpgrade}
            className="mt-5 flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-dark-bg transition-colors hover:bg-accent/90"
          >
            <Crown size={16} />
            Assinar Pro — R$ 14,99/mês
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
