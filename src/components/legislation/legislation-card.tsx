import Link from "next/link";
import { Clock, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  LEI: { label: "Lei", color: "#3B82F6" },
  DECRETO: { label: "Decreto", color: "#8B5CF6" },
  NORMA_REGULAMENTADORA: { label: "Norma Regulamentadora", color: "#EF4444" },
  NBR: { label: "NBR", color: "#F59E0B" },
  RESOLUCAO: { label: "Resolucao", color: "#22C55E" },
  PORTARIA: { label: "Portaria", color: "#EC4899" },
};

interface LegislationCardProps {
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

export function LegislationCard({
  slug,
  title,
  shortTitle,
  number,
  description,
  type,
  issuingBody,
  publishedAt,
  category,
}: LegislationCardProps) {
  const typeInfo = TYPE_CONFIG[type] || { label: type, color: "#F97316" };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-dark-hover hover:bg-dark-elevated">
      <div className="flex flex-1 flex-col p-4">
        {/* Type badge & Category */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            className="rounded-md px-2 py-0.5 font-medium"
            style={{
              backgroundColor: `${typeInfo.color}20`,
              color: typeInfo.color,
            }}
          >
            {typeInfo.label}
          </span>
          {category && (
            <>
              <span className="text-text-muted">&bull;</span>
              <span
                className="rounded-md px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: `${category.color || "#F97316"}20`,
                  color: category.color || "#F97316",
                }}
              >
                {category.name}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/legislacao/${slug}`}>
          <h3 className="mb-1 text-[15px] font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        {/* Short title or Number */}
        {(shortTitle || number) && (
          <p className="mb-2 text-xs font-medium text-text-secondary">
            {shortTitle || number}
          </p>
        )}

        {/* Issuing Body */}
        {issuingBody && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
            <Building2 className="h-3 w-3" />
            {issuingBody}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-dark-border pt-3 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            {formatDate(publishedAt)}
          </div>
          <Link
            href={`/legislacao/${slug}`}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-400"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
