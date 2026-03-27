"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { label: "Todas", value: "" },
  { label: "Abertas", value: "ABERTA" },
  { label: "Encerradas", value: "ENCERRADA" },
  { label: "Suspensas", value: "SUSPENSA" },
  { label: "Anuladas", value: "ANULADA" },
  { label: "Homologadas", value: "HOMOLOGADA" },
  { label: "Desertas", value: "DESERTA" },
];

const UF_OPTIONS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

const MODALIDADE_OPTIONS = [
  "Pregao Eletronico",
  "Pregao Presencial",
  "Concorrencia",
  "Tomada de Precos",
  "Convite",
  "Concurso",
  "Leilao",
  "Dispensa",
  "Inexigibilidade",
];

export function LicitacaoFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") || "";
  const activeUf = searchParams.get("uf") || "";
  const activeModalidade = searchParams.get("modalidade") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/licitacoes?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div>
        <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateParam("status", option.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeStatus === option.value
                  ? "bg-accent text-white"
                  : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* UF Select */}
        <div className="min-w-[160px]">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            Estado (UF)
          </p>
          <select
            value={activeUf}
            onChange={(e) => updateParam("uf", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Todos os estados</option>
            {UF_OPTIONS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        {/* Modalidade Select */}
        <div className="min-w-[200px] flex-1">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            Modalidade
          </p>
          <select
            value={activeModalidade}
            onChange={(e) => updateParam("modalidade", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Todas as modalidades</option>
            {MODALIDADE_OPTIONS.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
