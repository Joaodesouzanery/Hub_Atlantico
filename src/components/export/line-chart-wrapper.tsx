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
          stroke="#2A2A2D"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#A0A0A8", fontSize: 12 }}
          axisLine={{ stroke: "#2A2A2D" }}
          tickLine={{ stroke: "#2A2A2D" }}
        />
        <YAxis
          tick={{ fill: "#A0A0A8", fontSize: 12 }}
          axisLine={{ stroke: "#2A2A2D" }}
          tickLine={{ stroke: "#2A2A2D" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A1A1D",
            border: "1px solid #2A2A2D",
            borderRadius: "8px",
            color: "#F5F5F5",
            fontSize: 13,
          }}
          labelStyle={{ color: "#A0A0A8" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F97316"
          strokeWidth={2.5}
          dot={{ fill: "#F97316", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#F97316", stroke: "#0C0C0E", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
