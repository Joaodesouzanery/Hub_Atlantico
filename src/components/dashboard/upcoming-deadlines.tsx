import Link from "next/link";

interface Deadline {
  id: string;
  slug: string;
  title: string;
  organ: string | null;
  uf: string | null;
  closeDate: Date | null;
  status: string;
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

function getDaysRemaining(closeDate: Date | null): number {
  if (!closeDate) return 999;
  const now = new Date();
  const diff = new Date(closeDate).getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(days: number): string {
  if (days < 3) return "bg-red-500";
  if (days < 7) return "bg-yellow-500";
  return "bg-green-500";
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const sorted = [...deadlines].sort((a, b) => {
    const daysA = getDaysRemaining(a.closeDate);
    const daysB = getDaysRemaining(b.closeDate);
    return daysA - daysB;
  });

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card">
      <div className="border-b border-dark-border p-5">
        <h3 className="font-semibold text-text-primary">Prazos Próximos</h3>
      </div>
      <div className="p-4">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Nenhuma licitação com prazo próximo
          </p>
        ) : (
          <ul className="space-y-3">
            {sorted.map((item) => {
              const days = getDaysRemaining(item.closeDate);
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-dark-border p-3 transition-colors hover:bg-dark-hover"
                >
                  <div className="mt-1.5 flex-shrink-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getUrgencyColor(days)}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/licitacoes/${item.slug}`}
                      className="text-sm font-medium text-text-primary hover:text-accent"
                    >
                      <span className="line-clamp-2">{item.title}</span>
                    </Link>
                    {item.organ && (
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {item.organ}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      {item.uf && (
                        <span className="rounded bg-dark-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                          {item.uf}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium ${
                          days < 3
                            ? "text-red-400"
                            : days < 7
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {days === 0
                          ? "Encerra hoje"
                          : days === 1
                            ? "1 dia restante"
                            : `${days} dias restantes`}
                      </span>
                    </div>
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
