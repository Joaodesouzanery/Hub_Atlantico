import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-success"
      : changeType === "negative"
        ? "text-danger"
        : "text-text-muted";

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{title}</p>
        {Icon && (
          <div className="rounded-lg bg-dark-surface p-2">
            <Icon className="h-4 w-4 text-text-muted" />
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
      {change && (
        <p className={`mt-1 text-xs ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
