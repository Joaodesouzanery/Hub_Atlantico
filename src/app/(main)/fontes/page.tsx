import { prisma } from "@/lib/db";
import { ExternalLink, Rss, Globe, Code } from "lucide-react";

export const metadata = {
  title: "Fontes",
  description: "Conheça as fontes de notícias do HuB - Atlântico.",
};

export const dynamic = "force-dynamic";

const methodIcons: Record<string, typeof Rss> = {
  RSS: Rss,
  WP_API: Code,
  HTML_SCRAPE: Globe,
  MANUAL: Globe,
};

export default async function FontesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sources: any[] = [];

  try {
    sources = await prisma.newsSource.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Fontes de Notícias
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Agregamos notícias de {sources.length} fontes confiáveis do setor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => {
          const Icon = methodIcons[source.fetchMethod] || Globe;
          return (
            <div
              key={source.id}
              className="flex items-start gap-4 rounded-xl border border-dark-border bg-dark-card p-5 transition-colors hover:bg-dark-elevated"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {source.name}
                </h3>
                <p className="mt-0.5 text-xs text-text-muted">
                  Fonte ativa · {source.fetchMethod === "RSS" ? "RSS" : "Portal"}
                </p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-400"
                >
                  Visitar site
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-dark-border bg-dark-card p-5 text-center">
        <p className="text-sm text-text-muted">
          Todas as notícias são propriedade de suas respectivas fontes. O HuB -
          Atlântico apresenta apenas título, resumo e link para o conteúdo
          original, em conformidade com a LGPD.
        </p>
      </div>
    </div>
  );
}
