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
      {/* Image — always show, with fallback gradient */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-dark-surface to-dark-card sm:h-44">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/5 to-dark-surface">
            <svg className="h-10 w-10 text-dark-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {isPremium && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
            PRO
          </span>
        )}
        {/* Category badge on image */}
        <span
          className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
          style={{
            backgroundColor: `${category.color || "#F97316"}CC`,
            color: "#fff",
          }}
        >
          {category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Source */}
        <div className="mb-2 text-xs text-text-muted">
          {source.name}
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
