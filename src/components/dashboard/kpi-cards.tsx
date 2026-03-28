import { Gavel, CheckCircle, DollarSign, Newspaper } from "lucide-react";

interface KpiCardsProps {
  totalLicitacoes: number;
  licitacoesAbertas: number;
  valorTotal: number;
  totalNoticias: number;
  fontesAtivas: number;
  totalAgencias: number;
}

function formatCompactBRL(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}K`;
  }
  return `R$ ${value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

export function KpiCards({
  totalLicitacoes,
  licitacoesAbertas,
  valorTotal,
  totalNoticias,
  fontesAtivas,
  totalAgencias,
}: KpiCardsProps) {
  const cards = [
    {
      icon: Gavel,
      label: "Licitacoes Totais",
      value: totalLicitacoes.toLocaleString("pt-BR"),
      subtitle: `${totalAgencias} agencias reguladoras`,
    },
    {
      icon: CheckCircle,
      label: "Licitacoes Abertas",
      value: licitacoesAbertas.toLocaleString("pt-BR"),
      subtitle: "Com prazo vigente",
    },
    {
      icon: DollarSign,
      label: "Valor Total Estimado",
      value: formatCompactBRL(valorTotal),
      subtitle: "Soma dos valores estimados",
    },
    {
      icon: Newspaper,
      label: "Noticias",
      value: totalNoticias.toLocaleString("pt-BR"),
      subtitle: `${fontesAtivas} fontes ativas`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-dark-border bg-dark-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <card.icon className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {card.label}
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-text-primary">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-text-muted">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
