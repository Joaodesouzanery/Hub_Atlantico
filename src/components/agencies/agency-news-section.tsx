import { prisma } from "@/lib/db";
import { NewsGrid } from "@/components/news/news-grid";

interface AgencyNewsSectionProps {
  newsSourceId: string;
}

export async function AgencyNewsSection({
  newsSourceId,
}: AgencyNewsSectionProps) {
  const articles = await prisma.newsArticle.findMany({
    where: {
      sourceId: newsSourceId,
      status: "PUBLISHED",
    },
    include: {
      source: { select: { name: true, slug: true, logoUrl: true } },
      category: { select: { name: true, slug: true, color: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  return (
    <section className="mt-10 border-t border-dark-border pt-8">
      <h2 className="mb-6 text-xl font-bold text-text-primary">
        Notícias desta Agência
      </h2>
      {articles.length > 0 ? (
        <NewsGrid articles={articles} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16 text-center">
          <p className="text-text-secondary">
            Nenhuma notícia desta agência ainda.
          </p>
        </div>
      )}
    </section>
  );
}
