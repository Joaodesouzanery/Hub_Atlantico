import { LegislationCard } from "./legislation-card";

interface LegislationItem {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string | null;
  number?: string | null;
  description?: string | null;
  type: string;
  issuingBody?: string | null;
  publishedAt: string | Date;
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
}

interface LegislationGridProps {
  items: LegislationItem[];
  emptyMessage?: string;
}

export function LegislationGrid({
  items,
  emptyMessage = "Nenhuma legislacao encontrada.",
}: LegislationGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-20 text-center">
        <div className="mb-4 text-4xl">&#9878;</div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <LegislationCard key={item.id} {...item} />
      ))}
    </div>
  );
}
