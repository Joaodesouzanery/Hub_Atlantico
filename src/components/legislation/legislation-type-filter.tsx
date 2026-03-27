"use client";

import { useRouter, useSearchParams } from "next/navigation";

const LEGISLATION_TYPES = [
  { value: null, label: "Todas" },
  { value: "LEI", label: "Leis", color: "#3B82F6" },
  { value: "DECRETO", label: "Decretos", color: "#8B5CF6" },
  { value: "NORMA_REGULAMENTADORA", label: "Normas Regulamentadoras", color: "#EF4444" },
  { value: "NBR", label: "NBRs", color: "#F59E0B" },
  { value: "RESOLUCAO", label: "Resolucoes", color: "#22C55E" },
  { value: "PORTARIA", label: "Portarias", color: "#EC4899" },
] as const;

export function LegislationTypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type");

  function handleClick(type: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.delete("page");
    router.push(`/legislacao?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {LEGISLATION_TYPES.map((item) => {
        const isActive = item.value === null ? !activeType : activeType === item.value;

        return (
          <button
            key={item.label}
            onClick={() => handleClick(item.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "text-white"
                : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
            }`}
            style={
              isActive
                ? {
                    backgroundColor:
                      item.value === null
                        ? "#F97316"
                        : ("color" in item ? item.color : "#F97316"),
                  }
                : undefined
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
