import { Gavel, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface LicitacaoStatsProps {
  total: number;
  abertas: number;
  encerradas: number;
  valorTotal: number;
}

function formatBRLCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })}K`;
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function LicitacaoStats({
  total,
  abertas,
  encerradas,
  valorTotal,
}: LicitacaoStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total de Licitacoes"
        value={total}
        icon={Gavel}
      />
      <StatCard
        title="Abertas"
        value={abertas}
        icon={CheckCircle}
        changeType="positive"
        change={total > 0 ? `${((abertas / total) * 100).toFixed(0)}% do total` : undefined}
      />
      <StatCard
        title="Encerradas"
        value={encerradas}
        icon={XCircle}
        changeType="neutral"
        change={total > 0 ? `${((encerradas / total) * 100).toFixed(0)}% do total` : undefined}
      />
      <StatCard
        title="Valor Total Estimado"
        value={formatBRLCompact(valorTotal)}
        icon={DollarSign}
      />
    </div>
  );
}
