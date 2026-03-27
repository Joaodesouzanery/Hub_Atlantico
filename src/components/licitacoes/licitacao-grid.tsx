import { LicitacaoCard } from "./licitacao-card";

interface Licitacao {
  id: string;
  slug: string;
  title: string;
  status: string;
  organ?: string | null;
  uf?: string | null;
  city?: string | null;
  modalidade: string;
  estimatedValue?: number | null;
  currency?: string;
  closeDate?: string | Date | null;
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
}

interface LicitacaoGridProps {
  licitacoes: Licitacao[];
  emptyMessage?: string;
}

export function LicitacaoGrid({
  licitacoes,
  emptyMessage = "Nenhuma licitacao encontrada.",
}: LicitacaoGridProps) {
  if (licitacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-20 text-center">
        <div className="mb-4 text-4xl">📋</div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {licitacoes.map((licitacao) => (
        <LicitacaoCard key={licitacao.id} {...licitacao} />
      ))}
    </div>
  );
}
