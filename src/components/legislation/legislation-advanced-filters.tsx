"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORY_OPTIONS = [
  { value: "", label: "Todas as categorias" },
  { value: "saneamento-leg", label: "Saneamento" },
  { value: "licitacoes-leg", label: "Licitações" },
  { value: "recursos-hidricos", label: "Recursos Hídricos" },
  { value: "meio-ambiente-leg", label: "Meio Ambiente" },
  { value: "saude-publica", label: "Saúde Pública" },
  { value: "infraestrutura-concessoes", label: "Infraestrutura e Concessões" },
  { value: "seguranca", label: "Segurança do Trabalho" },
  { value: "normas-tecnicas", label: "Normas Técnicas" },
  { value: "regulacao", label: "Regulação" },
];

const ISSUING_BODY_OPTIONS = [
  { value: "", label: "Todos os órgãos" },
  { value: "Presidência da República", label: "Presidência da República" },
  { value: "ANA", label: "ANA" },
  { value: "CONAMA", label: "CONAMA" },
  { value: "CNRH", label: "CNRH" },
  { value: "ABNT", label: "ABNT" },
  { value: "Ministério da Saúde", label: "Ministério da Saúde" },
  { value: "SNSA/MCidades", label: "SNSA / MCidades" },
  { value: "MDR", label: "MDR" },
  { value: "Ministério das Cidades", label: "Ministério das Cidades" },
  { value: "Ministério do Trabalho e Emprego", label: "MTE" },
];

const YEAR_OPTIONS = [
  { value: "", label: "Todos os anos" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2010s", label: "2010-2019" },
  { value: "2000s", label: "2000-2009" },
  { value: "pre2000", label: "Antes de 2000" },
];

export function LegislationAdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeIssuingBody = searchParams.get("issuingBody") || "";
  const activeYear = searchParams.get("year") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/legislacao?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* Category filter */}
      <div className="min-w-[180px]">
        <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
          Categoria
        </p>
        <select
          value={activeCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Issuing body filter */}
      <div className="min-w-[180px]">
        <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
          Órgão Emissor
        </p>
        <select
          value={activeIssuingBody}
          onChange={(e) => updateParam("issuingBody", e.target.value)}
          className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {ISSUING_BODY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Year filter */}
      <div className="min-w-[140px]">
        <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
          Ano
        </p>
        <select
          value={activeYear}
          onChange={(e) => updateParam("year", e.target.value)}
          className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {YEAR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
