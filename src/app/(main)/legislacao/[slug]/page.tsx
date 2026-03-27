import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, Building2, Calendar, Hash } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  LEI: { label: "Lei", color: "#3B82F6" },
  DECRETO: { label: "Decreto", color: "#8B5CF6" },
  NORMA_REGULAMENTADORA: { label: "Norma Regulamentadora", color: "#EF4444" },
  NBR: { label: "NBR", color: "#F59E0B" },
  RESOLUCAO: { label: "Resolucao", color: "#22C55E" },
  PORTARIA: { label: "Portaria", color: "#EC4899" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const legislation = await prisma.legislation.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!legislation) return { title: "Legislacao nao encontrada" };

  return {
    title: legislation.title,
    description: legislation.description || undefined,
  };
}

export default async function LegislacaoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const legislation = await prisma.legislation.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true, color: true, icon: true },
      },
    },
  });

  if (!legislation) notFound();

  const typeInfo = TYPE_CONFIG[legislation.type] || {
    label: legislation.type,
    color: "#F97316",
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/legislacao"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para legislacao
        </Link>

        <article>
          {/* Type badge & Category */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${typeInfo.color}20`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.label}
            </span>
            {legislation.category && (
              <span
                className="rounded-md px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${legislation.category.color || "#F97316"}20`,
                  color: legislation.category.color || "#F97316",
                }}
              >
                {legislation.category.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text-primary">
            {legislation.title}
          </h1>

          {/* Metadata Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {legislation.number && (
              <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card p-4">
                <Hash className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Numero</p>
                  <p className="text-sm font-medium text-text-primary">
                    {legislation.number}
                  </p>
                </div>
              </div>
            )}

            {legislation.issuingBody && (
              <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card p-4">
                <Building2 className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Orgao Emissor</p>
                  <p className="text-sm font-medium text-text-primary">
                    {legislation.issuingBody}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card p-4">
              <Clock className="h-5 w-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Data de Publicacao</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(legislation.publishedAt)}
                </p>
              </div>
            </div>

            {legislation.effectiveAt && (
              <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card p-4">
                <Calendar className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Data de Vigencia</p>
                  <p className="text-sm font-medium text-text-primary">
                    {formatDate(legislation.effectiveAt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {legislation.description && (
            <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
              <h2 className="mb-3 text-sm font-semibold text-text-secondary">
                Descricao
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                {legislation.description}
              </p>
            </div>
          )}

          {/* CTA - Access Document */}
          {legislation.documentUrl && (
            <div className="mb-8 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
              <p className="mb-4 text-sm text-text-secondary">
                Acesse o documento oficial completo no site do orgao emissor.
              </p>
              <a
                href={legislation.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Acessar documento oficial
                <ExternalLink className="h-4 w-4" />
              </a>
              {legislation.issuingBody && (
                <p className="mt-3 text-xs text-text-muted">
                  Voce sera redirecionado para {legislation.issuingBody}
                </p>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
