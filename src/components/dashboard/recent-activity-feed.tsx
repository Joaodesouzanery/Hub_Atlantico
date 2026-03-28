import Link from "next/link";
import { Gavel, Newspaper } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: "licitacao" | "noticia";
  title: string;
  source: string;
  date: Date;
  slug: string;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">Atividade Recente</h3>
      </div>
      <div className="p-4">
        {activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Nenhuma atividade recente
          </p>
        ) : (
          <ul className="space-y-1">
            {activities.map((activity) => {
              const isLicitacao = activity.type === "licitacao";
              const Icon = isLicitacao ? Gavel : Newspaper;
              const href = isLicitacao
                ? `/licitacoes/${activity.slug}`
                : `/noticias/${activity.slug}`;

              return (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-dark-hover"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-dark-elevated">
                    <Icon className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          isLicitacao
                            ? "bg-accent/10 text-accent"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {isLicitacao ? "Licitação" : "Notícia"}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatRelativeDate(activity.date)}
                      </span>
                    </div>
                    <Link
                      href={href}
                      className="mt-1 block text-sm font-medium text-text-primary hover:text-accent"
                    >
                      <span className="line-clamp-2">{activity.title}</span>
                    </Link>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {activity.source}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
