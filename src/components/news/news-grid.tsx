import { NewsCard } from "./news-card";
import { AdEngelferInline } from "@/components/ads/ad-engelfer-inline";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  originalUrl: string;
  publishedAt: string | Date;
  isPremium: boolean;
  source: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
    color?: string | null;
  };
}

interface NewsGridProps {
  articles: Article[];
  emptyMessage?: string;
}

export function NewsGrid({
  articles,
  emptyMessage = "Nenhuma notícia encontrada.",
}: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-20 text-center">
        <div className="mb-4 text-4xl">📰</div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  // Intercala um AdEngelferInline a cada 5 cards
  const items: React.ReactNode[] = [];
  articles.forEach((article, index) => {
    items.push(<NewsCard key={article.id} {...article} />);
    if ((index + 1) % 5 === 0 && index + 1 < articles.length) {
      items.push(<AdEngelferInline key={`ad-${index}`} />);
    }
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items}
    </div>
  );
}
