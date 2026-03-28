"use client";

import dynamic from "next/dynamic";

const TopOrgansChart = dynamic(
  () =>
    import("@/components/dashboard/top-organs-chart").then(
      (mod) => mod.TopOrgansChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const MonthlyTrendChart = dynamic(
  () =>
    import("@/components/dashboard/monthly-trend-chart").then(
      (mod) => mod.MonthlyTrendChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const CategoryDistribution = dynamic(
  () =>
    import("@/components/dashboard/category-distribution").then(
      (mod) => mod.CategoryDistribution
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

function ChartSkeleton() {
  return (
    <div className="flex h-[370px] items-center justify-center rounded-xl border border-dark-border bg-dark-card">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-border border-t-accent" />
    </div>
  );
}

interface DashboardChartsProps {
  topOrgaos: { name: string; value: number }[];
  licitacoesPorMes: { name: string; value: number }[];
  licitacoesPorCategoria: { name: string; value: number; color: string }[];
}

export function DashboardChartsRow2({
  licitacoesPorMes,
  licitacoesPorCategoria,
}: {
  licitacoesPorMes: DashboardChartsProps["licitacoesPorMes"];
  licitacoesPorCategoria: DashboardChartsProps["licitacoesPorCategoria"];
}) {
  return (
    <>
      <div className="xl:col-span-2">
        <MonthlyTrendChart data={licitacoesPorMes} />
      </div>
      <div className="xl:col-span-1">
        <CategoryDistribution data={licitacoesPorCategoria} />
      </div>
    </>
  );
}

export function DashboardChartsRow3({
  topOrgaos,
}: {
  topOrgaos: DashboardChartsProps["topOrgaos"];
}) {
  return (
    <div className="xl:col-span-1">
      <TopOrgansChart data={topOrgaos} />
    </div>
  );
}
