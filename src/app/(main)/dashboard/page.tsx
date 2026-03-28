import { Metadata } from "next";
import { getDashboardData } from "@/lib/dashboard/queries";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import {
  DashboardBrazilMap,
  DashboardChartsRow2,
  DashboardChartsRow3,
} from "@/components/dashboard/dashboard-charts";
import { AdEngelferDashboard } from "@/components/ads/ad-engelfer-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Inteligente",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          Dashboard Inteligente
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Visão geral de licitações, notícias e atividades do setor.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <KpiCards {...data.kpis} />

      {/* Ad Banner — Engelfer */}
      <AdEngelferDashboard />

      {/* Row 2: Map + Deadlines */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardBrazilMap data={data.licitacoesPorUF} />
        </div>
        <div className="xl:col-span-1">
          <UpcomingDeadlines deadlines={data.proximosPrazos} />
        </div>
      </div>

      {/* Row 3: Monthly Trend + Category Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DashboardChartsRow2
          licitacoesPorMes={data.licitacoesPorMes}
          licitacoesPorCategoria={data.licitacoesPorCategoria}
        />
      </div>

      {/* Row 4: Top Organs + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DashboardChartsRow3 topOrgaos={data.topOrgaos} />
        <div className="xl:col-span-2">
          <RecentActivityFeed activities={data.atividadeRecente} />
        </div>
      </div>
    </div>
  );
}
