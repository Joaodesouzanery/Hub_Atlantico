"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface RegionDistributionChartProps {
  data: ChartDataItem[];
}

const COLORS = [
  "#F97316", // accent
  "#3B82F6", // blue
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#EC4899", // pink
  "#14B8A6", // teal
  "#A855F7", // purple
];

export function RegionDistributionChart({
  data,
}: RegionDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-text-muted">
        Sem dados disponiveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          stroke="#0C0C0E"
          strokeWidth={2}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
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
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            color: "#A0A0A8",
            fontSize: 12,
            paddingTop: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
