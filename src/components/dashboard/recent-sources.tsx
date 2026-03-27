import { Globe } from "lucide-react";

interface Source {
  name: string;
  articleCount: number;
  slug: string;
}

interface RecentSourcesProps {
  sources: Source[];
}

export function RecentSources({ sources }: RecentSourcesProps) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="flex items-center justify-between border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">Fontes Recentes</h3>
      </div>
      <div className="divide-y divide-dark-border">
        {sources.map((source) => (
          <div
            key={source.slug}
            className="flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-surface">
                <Globe className="h-4 w-4 text-text-muted" />
              </div>
              <span className="text-sm text-text-primary">{source.name}</span>
            </div>
            <span className="text-sm text-text-muted">
              {source.articleCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
