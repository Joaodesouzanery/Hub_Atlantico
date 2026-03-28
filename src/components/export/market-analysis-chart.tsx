"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface MarketAnalysisChartProps {
  data: ChartDataItem[];
}

export function MarketAnalysisChart({ data }: MarketAnalysisChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-text-muted">
        Sem dados disponiveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E2E8F0"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={{ stroke: "#E2E8F0" }}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={{ stroke: "#E2E8F0" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            color: "#0F172A",
            fontSize: 13,
          }}
          labelStyle={{ color: "#475569" }}
          cursor={{ fill: "rgba(249, 115, 22, 0.06)" }}
        />
        <Bar
          dataKey="value"
          fill="#F97316"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
