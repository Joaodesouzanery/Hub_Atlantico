"use client";

import { useEffect } from "react";

const AUTO_FETCH_KEY = "hub_auto_fetch_triggered";

/**
 * Auto-triggers data fetch when dashboard has insufficient data.
 * Runs once per browser session, silently in the background.
 */
export function AutoFetch({ totalNoticias, totalLicitacoes }: { totalNoticias: number; totalLicitacoes: number }) {
  useEffect(() => {
    // Only fetch if we have fewer items than expected
    if (totalNoticias >= 200 && totalLicitacoes >= 400) return;
    if (sessionStorage.getItem(AUTO_FETCH_KEY)) return;

    sessionStorage.setItem(AUTO_FETCH_KEY, "1");
    fetch("/api/internal/trigger-fetch", { method: "POST" }).catch(() => {});
  }, [totalNoticias, totalLicitacoes]);

  return null;
}
