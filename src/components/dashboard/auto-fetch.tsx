"use client";

import { useEffect } from "react";

const AUTO_FETCH_KEY = "hub_auto_fetch_triggered";

/**
 * Auto-triggers data fetch on first dashboard visit if no data exists.
 * Runs once per browser session, silently in the background.
 */
export function AutoFetch({ hasData }: { hasData: boolean }) {
  useEffect(() => {
    if (hasData) return;
    if (sessionStorage.getItem(AUTO_FETCH_KEY)) return;

    sessionStorage.setItem(AUTO_FETCH_KEY, "1");
    fetch("/api/internal/trigger-fetch", { method: "POST" }).catch(() => {});
  }, [hasData]);

  return null;
}
