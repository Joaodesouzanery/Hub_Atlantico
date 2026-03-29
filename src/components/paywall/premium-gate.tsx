"use client";

import { useEffect, createContext, useContext, useState } from "react";
import { Lock, Crown, Check, ArrowRight } from "lucide-react";

interface UserPlan {
  role: string;
  isPremium: boolean;
}

const PlanContext = createContext<UserPlan>({ role: "FREE", isPremium: false });

export function usePlan() {
  return useContext(PlanContext);
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<UserPlan>({ role: "FREE", isPremium: false });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        const role = data.role || "FREE";
        setPlan({ role, isPremium: role === "PREMIUM" || role === "ADMIN" });
      })
      .catch(() => {});
  }, []);

  return <PlanContext.Provider value={plan}>{children}</PlanContext.Provider>;
}

/**
 * Paywall overlay — shown when FREE users try to access premium content.
 * Wraps content with a blurred preview + upgrade CTA.
 */
export function PremiumGate({
  children,
  feature = "este conteúdo",
}: {
  children: React.ReactNode;
  feature?: string;
}) {
  const { isPremium } = usePlan();

  if (isPremium) return <>{children}</>;

  function handleUpgrade() {
    window.open("https://buy.stripe.com/5kQ00i93i1thcZY7p7cV204", "_blank");
  }

  return (
    <div className="relative">
      {/* Blurred preview of content */}
      <div className="pointer-events-none max-h-[400px] select-none overflow-hidden">
        <div className="blur-sm">{children}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/60 to-dark-bg" />
      </div>

      {/* Upgrade CTA overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 pt-16">
        <div className="w-full max-w-md rounded-2xl border border-accent/20 bg-dark-card p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <Lock size={28} className="text-accent" />
          </div>

          <h3 className="text-lg font-bold text-text-primary">
            Conte&uacute;do Premium
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            Acesse {feature} e todas as funcionalidades com o plano Pro.
          </p>

          <div className="mt-4 space-y-2 text-left">
            {[
              "Notícias e licitações ilimitadas",
              "Export Excel e PDF",
              "Alertas personalizados de licitação",
              "Filtros avançados",
              "10% de desconto em parceiros",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                <Check size={14} className="shrink-0 text-accent" />
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-dark-bg transition-colors hover:bg-accent/90"
          >
            <Crown size={16} />
            Assinar Pro — R$ 14,99/m&ecirc;s
            <ArrowRight size={16} />
          </button>

          <p className="mt-3 text-xs text-text-muted">
            Cancele quando quiser. Sem compromisso.
          </p>
        </div>
      </div>
    </div>
  );
}
