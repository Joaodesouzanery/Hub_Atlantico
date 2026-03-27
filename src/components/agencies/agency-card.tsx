import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";

const regionColors: Record<string, string> = {
  NACIONAL: "#F97316",
  SUDESTE: "#3B82F6",
  SUL: "#22C55E",
  NORDESTE: "#8B5CF6",
  CENTRO_OESTE: "#F59E0B",
  NORTE: "#14B8A6",
  INTERMUNICIPAL: "#EC4899",
};

const regionLabels: Record<string, string> = {
  NACIONAL: "Nacional",
  SUDESTE: "Sudeste",
  SUL: "Sul",
  NORDESTE: "Nordeste",
  CENTRO_OESTE: "Centro-Oeste",
  NORTE: "Norte",
  INTERMUNICIPAL: "Intermunicipal",
};

interface AgencyCardProps {
  slug: string;
  name: string;
  fullName: string;
  region: string;
  uf?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
}

export function AgencyCard({
  slug,
  name,
  fullName,
  region,
  uf,
  description,
  websiteUrl,
}: AgencyCardProps) {
  const color = regionColors[region] || "#F97316";

  return (
    <div className="flex flex-col rounded-xl border border-dark-border bg-dark-card p-5 transition-colors hover:bg-dark-elevated">
      {/* Header */}
      <div className="mb-3">
        <Link href={`/agencias/${slug}`}>
          <h3 className="text-lg font-bold text-text-primary transition-colors hover:text-accent">
            {name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-text-muted">{fullName}</p>
      </div>

      {/* Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="rounded-md px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {regionLabels[region] || region}
        </span>
        {uf && (
          <span className="inline-flex items-center gap-1 rounded-md border border-dark-border bg-dark-surface px-2 py-0.5 text-xs font-medium text-text-secondary">
            <MapPin className="h-3 w-3" />
            {uf}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
          {description}
        </p>
      )}

      {/* Link */}
      {websiteUrl && (
        <div className="mt-auto pt-3 border-t border-dark-border">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-400"
          >
            Visitar site
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
