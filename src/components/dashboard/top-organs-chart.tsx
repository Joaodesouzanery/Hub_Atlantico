"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopOrgansChartProps {
  data: { name: string; value: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 shadow-lg">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0].value} licitações
      </p>
    </div>
  );
}

export function TopOrgansChart({ data }: TopOrgansChartProps) {
  const truncated = data.map((d) => ({
    ...d,
    shortName: d.name.length > 30 ? d.name.slice(0, 27) + "..." : d.name,
  }));

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">
          Top Órgãos Licitantes
        </h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={truncated}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={150}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F5F9" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {truncated.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#F97316" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
