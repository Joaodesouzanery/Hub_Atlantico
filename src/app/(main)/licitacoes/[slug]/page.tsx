import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Layers,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { LicitacaoStatusBadge } from "@/components/licitacoes/licitacao-status-badge";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const licitacao = await prisma.licitacao.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!licitacao) return { title: "Licitacao nao encontrada" };

  return {
    title: licitacao.title,
    description: licitacao.description
      ? licitacao.description.slice(0, 160)
      : undefined,
  };
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function LicitacaoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const licitacao = await prisma.licitacao.findUnique({
    where: { slug },
    include: {
      source: { select: { name: true, slug: true, baseUrl: true } },
      category: { select: { name: true, slug: true, color: true } },
    },
  });

  if (!licitacao) notFound();

  // Increment view count
  await prisma.licitacao.update({
    where: { id: licitacao.id },
    data: { viewCount: { increment: 1 } },
  });

  const metadataItems = [
    {
      icon: Hash,
      label: "Processo",
      value: licitacao.process,
    },
    {
      icon: Layers,
      label: "Modalidade",
      value: licitacao.modalidade,
    },
    {
      icon: Building2,
      label: "Orgao",
      value: licitacao.organ,
    },
    {
      icon: MapPin,
      label: "Localidade",
      value: `${licitacao.city}, ${licitacao.uf}`,
    },
    {
      icon: DollarSign,
      label: "Valor Estimado",
      value: licitacao.estimatedValue
        ? formatBRL(licitacao.estimatedValue)
        : "Nao informado",
    },
    {
      icon: Calendar,
      label: "Data de Abertura",
      value: licitacao.openDate ? formatDate(licitacao.openDate) : "Nao informada",
    },
    {
      icon: Calendar,
      label: "Data de Encerramento",
      value: licitacao.closeDate
        ? formatDate(licitacao.closeDate)
        : "Nao informada",
    },
    {
      icon: Calendar,
      label: "Publicado em",
      value: licitacao.publishedAt
        ? formatDate(licitacao.publishedAt)
        : "Nao informado",
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/licitacoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para licitacoes
        </Link>

        <article>
          {/* Status & Category */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <LicitacaoStatusBadge status={licitacao.status as "ABERTA" | "ENCERRADA" | "SUSPENSA" | "ANULADA" | "HOMOLOGADA" | "DESERTA"} size="md" />
            {licitacao.category && (
              <span
                className="rounded-md px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${licitacao.category.color || "#F97316"}20`,
                  color: licitacao.category.color || "#F97316",
                }}
              >
                {licitacao.category.name}
              </span>
            )}
            {licitacao.source && (
              <span className="text-sm text-text-muted">
                Fonte:{" "}
                <strong className="text-text-secondary">
                  {licitacao.source.name}
                </strong>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text-primary">
            {licitacao.title}
          </h1>

          {/* Description */}
          {licitacao.description && (
            <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
              <p className="text-base leading-relaxed text-text-secondary whitespace-pre-line">
                {licitacao.description}
              </p>
            </div>
          )}

          {/* Metadata grid */}
          <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Detalhes da Licitacao
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {metadataItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-dark-surface p-2">
                      <Icon className="h-4 w-4 text-text-muted" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">{item.label}</p>
                      <p className="text-sm font-medium text-text-primary">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CNPJ */}
          {licitacao.organCnpj && (
            <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-4">
              <p className="text-xs text-text-muted">
                CNPJ do Orgao:{" "}
                <span className="font-mono text-text-secondary">
                  {licitacao.organCnpj}
                </span>
              </p>
            </div>
          )}

          {/* Links: Edital & Original */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            {licitacao.editalUrl && (
              <a
                href={licitacao.editalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                <FileText className="h-4 w-4" />
                Baixar Edital
              </a>
            )}
            {licitacao.originalUrl && (
              <a
                href={licitacao.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-dark-border bg-dark-card px-6 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-dark-hover hover:text-text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Ver no portal original
              </a>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
