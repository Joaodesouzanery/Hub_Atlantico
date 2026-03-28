"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryDistributionProps {
  data: { name: string; value: number; color: string }[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 shadow-lg">
      <p className="text-xs text-text-secondary">{payload[0].name}</p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0].value} licitacoes
      </p>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload) return null;
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-text-muted">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">
          Distribuição por Categoria
        </h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
