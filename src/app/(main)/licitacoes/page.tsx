import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { LicitacaoGrid } from "@/components/licitacoes/licitacao-grid";
import { LicitacaoFilters } from "@/components/licitacoes/licitacao-filters";
import { LicitacaoSearchBar } from "@/components/licitacoes/licitacao-search-bar";
import { LicitacaoStats } from "@/components/licitacoes/licitacao-stats";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    uf?: string;
    modalidade?: string;
    search?: string;
  }>;
}

export const metadata = {
  title: "Licitações",
  description:
    "Acompanhe as licitações públicas de saneamento, engenharia e infraestrutura.",
};

export const dynamic = "force-dynamic";

export default async function LicitacoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;

  // Build filter query
  const where: Record<string, unknown> = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.uf) {
    where.uf = params.uf;
  }

  if (params.modalidade) {
    where.modalidade = params.modalidade;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
      { organ: { contains: params.search } },
      { process: { contains: params.search } },
    ];
  }

  // Fetch data and stats in parallel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let licitacoes: any[] = [];
  let total = 0;
  let abertas = 0;
  let encerradas = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let valorTotal: any = 0;

  try {
    const [licitacoesResult, totalResult, abertasResult, encerradasResult, valorAggregate] =
      await Promise.all([
        prisma.licitacao.findMany({
          where,
          include: {
            source: { select: { name: true, slug: true } },
            category: { select: { name: true, slug: true, color: true } },
          },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.licitacao.count({ where }),
        prisma.licitacao.count({ where: { ...where, status: "ABERTA" } }),
        prisma.licitacao.count({ where: { ...where, status: "ENCERRADA" } }),
        prisma.licitacao.aggregate({
          where,
          _sum: { estimatedValue: true },
        }),
      ]);

    licitacoes = licitacoesResult;
    total = totalResult;
    abertas = abertasResult;
    encerradas = encerradasResult;
    valorTotal = valorAggregate._sum.estimatedValue || 0;
  } catch (error) {
    console.error("Database error:", error);
  }

  const totalPages = Math.ceil(total / limit);

  // Build pagination query string
  function buildPageUrl(targetPage: number) {
    const parts: string[] = [`page=${targetPage}`];
    if (params.status) parts.push(`status=${params.status}`);
    if (params.uf) parts.push(`uf=${params.uf}`);
    if (params.modalidade) parts.push(`modalidade=${params.modalidade}`);
    if (params.search) parts.push(`search=${params.search}`);
    return `/licitacoes?${parts.join("&")}`;
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Licitações</h1>
        <p className="mt-1 text-sm text-text-muted">
          {total} {total === 1 ? "licitação encontrada" : "licitações encontradas"}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <LicitacaoStats
          total={total}
          abertas={abertas}
          encerradas={encerradas}
          valorTotal={valorTotal}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <Suspense>
          <LicitacaoSearchBar />
        </Suspense>
        <Suspense>
          <LicitacaoFilters />
        </Suspense>
      </div>

      {/* Grid */}
      <LicitacaoGrid licitacoes={licitacoes} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-dark-hover"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          )}

          <span className="px-4 py-2 text-sm text-text-muted">
            {page} de {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-dark-hover"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
