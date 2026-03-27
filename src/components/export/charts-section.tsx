"use client";

import dynamic from "next/dynamic";

const MarketAnalysisChart = dynamic(
  () =>
    import("@/components/export/market-analysis-chart").then(
      (mod) => mod.MarketAnalysisChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const RegionDistributionChart = dynamic(
  () =>
    import("@/components/export/region-distribution-chart").then(
      (mod) => mod.RegionDistributionChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const LineChartWrapper = dynamic(
  () =>
    import("@/components/export/line-chart-wrapper").then(
      (mod) => mod.LineChartWrapper
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

function ChartSkeleton() {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
    </div>
  );
}

interface ChartData {
  name: string;
  value: number;
}

interface ChartsSectionProps {
  byUF: ChartData[];
  byMonth: ChartData[];
  byModalidade: ChartData[];
}

export function ChartsSection({
  byUF,
  byMonth,
  byModalidade,
}: ChartsSectionProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-dark-border bg-dark-card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Licitações por UF
        </h2>
        <MarketAnalysisChart data={byUF} />
      </div>

      <div className="rounded-xl border border-dark-border bg-dark-card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Licitações por Mês
        </h2>
        <LineChartWrapper data={byMonth} />
      </div>

      <div className="rounded-xl border border-dark-border bg-dark-card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Licitações por Modalidade
        </h2>
        <RegionDistributionChart data={byModalidade} />
      </div>
    </div>
  );
}
