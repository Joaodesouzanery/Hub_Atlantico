"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { regions } from "@/config/navigation";

const regionColors: Record<string, string> = {
  NACIONAL: "#F97316",
  SUDESTE: "#3B82F6",
  SUL: "#22C55E",
  NORDESTE: "#8B5CF6",
  CENTRO_OESTE: "#F59E0B",
  NORTE: "#14B8A6",
  INTERMUNICIPAL: "#EC4899",
};

export function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRegion = searchParams.get("region");

  function handleClick(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("region", value);
    } else {
      params.delete("region");
    }
    router.push(`/agencias?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick(null)}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          !activeRegion
            ? "bg-accent text-white"
            : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
        }`}
      >
        Todas
      </button>
      {regions.map((region) => (
        <button
          key={region.value}
          onClick={() => handleClick(region.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            activeRegion === region.value
              ? "text-white"
              : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
          }`}
          style={
            activeRegion === region.value
              ? { backgroundColor: regionColors[region.value] || "#F97316" }
              : undefined
          }
        >
          {region.label}
        </button>
      ))}
    </div>
  );
}
