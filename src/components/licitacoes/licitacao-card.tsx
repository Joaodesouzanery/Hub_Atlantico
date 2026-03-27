import Link from "next/link";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";
import { LicitacaoStatusBadge } from "./licitacao-status-badge";
import { formatDate } from "@/lib/utils";

interface LicitacaoCardProps {
  slug: string;
  title: string;
  status: string;
  organ?: string | null;
  uf?: string | null;
  city?: string | null;
  modalidade: string;
  estimatedValue?: number | null;
  currency?: string;
  closeDate?: string | Date | null;
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function LicitacaoCard({
  slug,
  title,
  status,
  organ,
  uf,
  city,
  modalidade,
  estimatedValue,
  closeDate,
  category,
}: LicitacaoCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-dark-hover hover:bg-dark-elevated">
      <div className="flex flex-1 flex-col p-4">
        {/* Status & Category */}
        <div className="mb-3 flex items-center gap-2">
          <LicitacaoStatusBadge status={status} />
          {category && (
            <>
              <span className="text-text-muted">|</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
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
        <Link href={`/licitacoes/${slug}`}>
          <h3 className="mb-3 text-[15px] font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        {/* Organ */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
          <Building2 className="h-3 w-3 flex-shrink-0 text-text-muted" />
          <span className="line-clamp-1">{organ || "Órgão não informado"}</span>
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>
            {[city, uf].filter(Boolean).join(", ") || "Local não informado"}
          </span>
        </div>

        {/* Modalidade badge */}
        <div className="mb-4">
          <span className="rounded-lg bg-dark-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary">
            {modalidade}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-dark-border pt-3">
          {estimatedValue ? (
            <div className="flex items-center gap-1 text-xs font-semibold text-accent">
              <DollarSign className="h-3 w-3" />
              {formatBRL(estimatedValue)}
            </div>
          ) : (
            <span className="text-xs text-text-muted">Valor n/d</span>
          )}

          {closeDate ? (
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="h-3 w-3" />
              {formatDate(closeDate)}
            </div>
          ) : (
            <span className="text-xs text-text-muted">Prazo n/d</span>
          )}
        </div>
      </div>
    </article>
  );
}
