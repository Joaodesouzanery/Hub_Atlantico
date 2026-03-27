import Link from "next/link";
import { ExternalLink, Clock } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

interface NewsCardProps {
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  originalUrl: string;
  publishedAt: string | Date;
  source: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
    color?: string | null;
  };
  isPremium?: boolean;
}

export function NewsCard({
  slug,
  title,
  summary,
  imageUrl,
  originalUrl,
  publishedAt,
  source,
  category,
  isPremium,
}: NewsCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-dark-hover hover:bg-dark-elevated">
      {/* Image */}
      {imageUrl && (
        <div className="relative h-44 w-full overflow-hidden bg-dark-surface">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {isPremium && (
            <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-white">
              PRO
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Category & Source */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span
            className="rounded-md px-2 py-0.5 font-medium"
            style={{
              backgroundColor: `${category.color || "#F97316"}20`,
              color: category.color || "#F97316",
            }}
          >
            {category.name}
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-text-muted">{source.name}</span>
        </div>

        {/* Title */}
        <Link href={`/noticias/${slug}`}>
          <h3 className="mb-2 text-[15px] font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
          {summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-dark-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            {formatRelativeDate(publishedAt)}
          </div>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-400"
          >
            Ler original
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
