"use client";

import {
  LineChart,
  Line,
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

interface LineChartWrapperProps {
  data: ChartDataItem[];
}

export function LineChartWrapper({ data }: LineChartWrapperProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-text-muted">
        Sem dados disponiveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F97316"
          strokeWidth={2.5}
          dot={{ fill: "#F97316", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#F97316", stroke: "#F1F5F9", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
