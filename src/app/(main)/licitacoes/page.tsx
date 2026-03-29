import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { LicitacaoSearchBar } from "@/components/licitacoes/licitacao-search-bar";
import { LicitacaoFilters } from "@/components/licitacoes/licitacao-filters";
import { SavedFilters } from "@/components/filters/saved-filters";

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
  let params: {
    page?: string;
    status?: string;
    uf?: string;
    modalidade?: string;
    search?: string;
  } = {};

  try {
    params = await searchParams;
  } catch {
    // searchParams failed
  }

  const page = parseInt(params.page || "1");
  const limit = 20;

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
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { organ: { contains: params.search, mode: "insensitive" } },
      { process: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let licitacoes: any[] = [];
  let total = 0;
  let abertas = 0;
  let encerradas = 0;
  let valorTotal = 0;

  try {
    const [licitacoesResult, totalResult, abertasResult, encerradasResult, valorAggregate] =
      await Promise.all([
        prisma.licitacao.findMany({
          where,
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            process: true,
            status: true,
            organ: true,
            uf: true,
            city: true,
            modalidade: true,
            estimatedValue: true,
            currency: true,
            closeDate: true,
            editalUrl: true,
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

    // Serialize Prisma objects (Decimal, Date) to plain JSON-safe values
    licitacoes = JSON.parse(JSON.stringify(licitacoesResult));
    total = totalResult;
    abertas = abertasResult;
    encerradas = encerradasResult;
    valorTotal = Number(valorAggregate._sum.estimatedValue ?? 0);
  } catch (error) {
    console.error("Database error:", error);
  }

  const totalPages = Math.ceil(total / limit);

  function buildPageUrl(targetPage: number) {
    const parts: string[] = [`page=${targetPage}`];
    if (params.status) parts.push(`status=${params.status}`);
    if (params.uf) parts.push(`uf=${params.uf}`);
    if (params.modalidade) parts.push(`modalidade=${params.modalidade}`);
    if (params.search) parts.push(`search=${params.search}`);
    return `/licitacoes?${parts.join("&")}`;
  }

  function formatBRL(value: number): string {
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
    }
    if (value >= 1_000) {
      return `R$ ${(value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}K`;
    }
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Licitações</h1>
        <p className="mt-1 text-sm text-text-muted">
          Licitações públicas de saneamento, engenharia e infraestrutura
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <Suspense fallback={null}>
          <LicitacaoSearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <LicitacaoFilters />
        </Suspense>
        <Suspense fallback={null}>
          <SavedFilters
            moduleKey="licitacoes"
            basePath="/licitacoes"
            filterKeys={["status", "uf", "modalidade", "search"]}
          />
        </Suspense>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-dark-border bg-dark-card p-5">
          <p className="text-sm text-text-muted">Total</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{total}</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-5">
          <p className="text-sm text-text-muted">Abertas</p>
          <p className="mt-1 text-2xl font-bold text-accent">{abertas}</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-5">
          <p className="text-sm text-text-muted">Encerradas</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{encerradas}</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-5">
          <p className="text-sm text-text-muted">Valor Estimado</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{formatBRL(valorTotal)}</p>
        </div>
      </div>

      {/* Grid */}
      {licitacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-20 text-center">
          <p className="text-text-secondary">Nenhuma licitação encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {licitacoes.map((lic) => (
            <Link
              key={lic.id}
              href={`/licitacoes/${lic.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card p-4 transition-all hover:border-dark-hover hover:bg-dark-elevated"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  lic.status === "ABERTA" ? "bg-green-50 text-green-700" :
                  lic.status === "ENCERRADA" ? "bg-red-50 text-red-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {lic.status}
                </span>
                {lic.category && (
                  <span
                    className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor: `${lic.category.color || "#F97316"}20`,
                      color: lic.category.color || "#F97316",
                    }}
                  >
                    {lic.category.name}
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-sm font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
                {lic.title}
              </h3>

              {lic.organ && (
                <p className="mb-1 text-xs text-text-secondary line-clamp-1">{lic.organ}</p>
              )}

              <p className="mb-3 text-xs text-text-muted">
                {[lic.city, lic.uf].filter(Boolean).join(", ") || "Local não informado"} · {lic.modalidade}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-dark-border pt-3">
                {lic.estimatedValue ? (
                  <span className="text-xs font-semibold text-accent">
                    {formatBRL(lic.estimatedValue)}
                  </span>
                ) : (
                  <span className="text-xs text-text-muted">Valor n/d</span>
                )}
                {lic.source && (
                  <span className="text-[10px] text-text-muted">{lic.source.name}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

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
