"use client";

import { PremiumGate, usePlan } from "./premium-gate";

/**
 * Wraps a full page with premium gating.
 * FREE users see a blurred preview of the first part + upgrade CTA.
 * Used as a client boundary around server-rendered page content.
 */
export function PremiumPageGate({
  children,
  feature,
  freePreviewRows = 3,
}: {
  children: React.ReactNode;
  feature: string;
  freePreviewRows?: number;
}) {
  const { isPremium } = usePlan();

  // Premium users see everything
  if (isPremium) return <>{children}</>;

  return (
    <PremiumGate feature={feature}>
      <div style={{ maxHeight: `${freePreviewRows * 120}px`, overflow: "hidden" }}>
        {children}
      </div>
    </PremiumGate>
  );
}
