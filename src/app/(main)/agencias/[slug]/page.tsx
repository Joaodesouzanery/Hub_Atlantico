import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Landmark, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AgencyNewsSection } from "@/components/agencies/agency-news-section";
import type { Metadata } from "next";

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = await prisma.regulatoryAgency.findUnique({
    where: { slug },
    select: { name: true, fullName: true },
  });

  if (!agency) return { title: "Agência não encontrada" };

  return {
    title: agency.name,
    description: agency.fullName,
  };
}

export default async function AgenciaPage({ params }: PageProps) {
  const { slug } = await params;

  const agency = await prisma.regulatoryAgency.findUnique({
    where: { slug },
    include: {
      newsSource: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!agency) notFound();

  const color = regionColors[agency.region] || "#F97316";

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/agencias"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para agências
        </Link>

        {/* Agency Header */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Landmark className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">
                {agency.name}
              </h1>
              <p className="mt-1 text-sm text-text-muted">{agency.fullName}</p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {regionLabels[agency.region] || agency.region}
                </span>
                {agency.uf && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-dark-border bg-dark-surface px-2 py-0.5 text-xs font-medium text-text-secondary">
                    <MapPin className="h-3 w-3" />
                    {agency.uf}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {agency.description && (
            <div className="mt-6 border-t border-dark-border pt-5">
              <p className="text-sm leading-relaxed text-text-secondary">
                {agency.description}
              </p>
            </div>
          )}

          {/* Website & Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-dark-border pt-5">
            {agency.websiteUrl && (
              <a
                href={agency.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Visitar site
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <span className="text-xs text-text-muted">
              Cadastrada em {formatDate(agency.createdAt)}
            </span>
          </div>
        </div>

        {/* News Section */}
        {agency.newsSourceId && (
          <AgencyNewsSection newsSourceId={agency.newsSourceId} />
        )}
      </div>
    </div>
  );
}
