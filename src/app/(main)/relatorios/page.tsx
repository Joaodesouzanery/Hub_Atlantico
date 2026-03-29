import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  getLicitacoesByUF,
  getLicitacoesByMonth,
  getLicitacoesByModalidade,
} from "@/lib/export/chart-data";
import { ExportButton } from "@/components/export/export-button";
import { ChartsSection } from "@/components/export/charts-section";
import { ReportFilters } from "@/components/filters/report-filters";
import { Briefcase, Newspaper, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Relatórios",
  description: "Relatórios e análises de licitações e notícias do setor.",
};

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  let totalLicitacoes = 0;
  let totalNoticias = 0;
  let valorMedio = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let byUF: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let byMonth: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let byModalidade: any[] = [];

  try {
    const [
      totalLicitacoesResult,
      totalNoticiasResult,
      valorAggregate,
      byUFResult,
      byMonthResult,
      byModalidadeResult,
    ] = await Promise.all([
      prisma.licitacao.count(),
      prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
      prisma.licitacao.aggregate({ _avg: { estimatedValue: true } }),
      getLicitacoesByUF(),
      getLicitacoesByMonth(),
      getLicitacoesByModalidade(),
    ]);

    totalLicitacoes = totalLicitacoesResult;
    totalNoticias = totalNoticiasResult;
    valorMedio = valorAggregate._avg.estimatedValue
      ? Number(valorAggregate._avg.estimatedValue)
      : 0;
    byUF = byUFResult;
    byMonth = byMonthResult;
    byModalidade = byModalidadeResult;
  } catch (error) {
    console.error("Database error:", error);
  }

  const stats = [
    {
      label: "Total Licitações",
      value: totalLicitacoes.toLocaleString("pt-BR"),
      icon: Briefcase,
      accent: true,
    },
    {
      label: "Total Notícias",
      value: totalNoticias.toLocaleString("pt-BR"),
      icon: Newspaper,
      accent: false,
    },
    {
      label: "Valor Médio",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(valorMedio),
      icon: DollarSign,
      accent: false,
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Relatórios</h1>
        <p className="mt-1 text-sm text-text-muted">
          Análises e exportações de dados
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Filtros do Relatório
        </h2>
        <Suspense fallback={null}>
          <ReportFilters />
        </Suspense>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-dark-border bg-dark-card p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  stat.accent
                    ? "bg-accent/10 text-accent"
                    : "bg-dark-hover text-text-muted"
                }`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{stat.label}</p>
                <p className="text-lg font-semibold text-text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ChartsSection
        byUF={byUF}
        byMonth={byMonth}
        byModalidade={byModalidade}
      />

      {/* Export Section */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Exportar Dados
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          Exporte os dados em PDF ou Excel para análise offline.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-text-secondary">
              Licitações
            </span>
            <ExportButton type="licitacoes" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-text-secondary">
              Notícias
            </span>
            <ExportButton type="noticias" />
          </div>
        </div>
      </div>
    </div>
  );
}
