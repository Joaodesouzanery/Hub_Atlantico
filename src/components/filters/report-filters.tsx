"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SavedFilters } from "./saved-filters";

const UF_OPTIONS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

const MODALIDADE_OPTIONS = [
  { value: "PREGAO_ELETRONICO", label: "Pregao Eletronico" },
  { value: "CONCORRENCIA", label: "Concorrencia" },
  { value: "TOMADA_PRECO", label: "Tomada de Precos" },
  { value: "CONVITE", label: "Convite" },
  { value: "DISPENSA", label: "Dispensa" },
  { value: "INEXIGIBILIDADE", label: "Inexigibilidade" },
];

const PERIOD_OPTIONS = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 ano" },
  { value: "", label: "Todo o periodo" },
];

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeUf = searchParams.get("uf") || "";
  const activeModalidade = searchParams.get("modalidade") || "";
  const activePeriod = searchParams.get("periodo") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/relatorios?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Period filter */}
        <div className="min-w-[140px]">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            Periodo
          </p>
          <select
            value={activePeriod}
            onChange={(e) => updateParam("periodo", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* UF filter */}
        <div className="min-w-[140px]">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            Estado (UF)
          </p>
          <select
            value={activeUf}
            onChange={(e) => updateParam("uf", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Todos</option>
            {UF_OPTIONS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        {/* Modalidade filter */}
        <div className="min-w-[180px] flex-1">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            Modalidade
          </p>
          <select
            value={activeModalidade}
            onChange={(e) => updateParam("modalidade", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Todas</option>
            {MODALIDADE_OPTIONS.map((mod) => (
              <option key={mod.value} value={mod.value}>{mod.label}</option>
            ))}
          </select>
        </div>
      </div>

      <SavedFilters
        moduleKey="relatorios"
        basePath="/relatorios"
        filterKeys={["uf", "modalidade", "periodo"]}
      />
    </div>
  );
}
