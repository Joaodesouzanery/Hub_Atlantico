import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { LegislationGrid } from "@/components/legislation/legislation-grid";
import { LegislationTypeFilter } from "@/components/legislation/legislation-type-filter";
import { LegislationSearchBar } from "@/components/legislation/legislation-search-bar";
import { LegislationAdvancedFilters } from "@/components/legislation/legislation-advanced-filters";
import { SavedFilters } from "@/components/filters/saved-filters";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    search?: string;
    category?: string;
    issuingBody?: string;
    year?: string;
  }>;
}

export const metadata = {
  title: "Legislação",
  description:
    "Legislações, normas e regulamentações do setor de saneamento.",
};

export const dynamic = "force-dynamic";

export default async function LegislacaoPage({ searchParams }: PageProps) {
  let params: {
    page?: string;
    type?: string;
    search?: string;
    category?: string;
    issuingBody?: string;
    year?: string;
  } = {};

  try {
    params = await searchParams;
  } catch {
    // fallback
  }

  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.type) {
    where.type = params.type;
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.issuingBody) {
    where.issuingBody = { contains: params.issuingBody, mode: "insensitive" };
  }

  if (params.year) {
    if (params.year === "2010s") {
      where.publishedAt = { gte: new Date("2010-01-01"), lt: new Date("2020-01-01") };
    } else if (params.year === "2000s") {
      where.publishedAt = { gte: new Date("2000-01-01"), lt: new Date("2010-01-01") };
    } else if (params.year === "pre2000") {
      where.publishedAt = { lt: new Date("2000-01-01") };
    } else {
      const y = parseInt(params.year);
      if (y > 0) {
        where.publishedAt = { gte: new Date(`${y}-01-01`), lt: new Date(`${y + 1}-01-01`) };
      }
    }
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[] = [];
  let total = 0;

  try {
    const [itemsResult, totalResult] = await Promise.all([
      prisma.legislation.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true, color: true },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.legislation.count({ where }),
    ]);
    items = JSON.parse(JSON.stringify(itemsResult));
    total = totalResult;
  } catch (error) {
    console.error("Database error:", error);
  }

  const totalPages = Math.ceil(total / limit);

  function buildPageUrl(targetPage: number) {
    const parts: string[] = [`page=${targetPage}`];
    if (params.type) parts.push(`type=${params.type}`);
    if (params.category) parts.push(`category=${params.category}`);
    if (params.issuingBody) parts.push(`issuingBody=${params.issuingBody}`);
    if (params.year) parts.push(`year=${params.year}`);
    if (params.search) parts.push(`search=${params.search}`);
    return `/legislacao?${parts.join("&")}`;
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Legislação</h1>
        <p className="mt-1 text-sm text-text-muted">
          Leis, decretos, normas e resoluções do setor de saneamento
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <Suspense fallback={null}>
          <LegislationSearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <LegislationTypeFilter />
        </Suspense>
        <Suspense fallback={null}>
          <LegislationAdvancedFilters />
        </Suspense>
        <Suspense fallback={null}>
          <SavedFilters
            moduleKey="legislacao"
            basePath="/legislacao"
            filterKeys={["type", "search", "category", "issuingBody", "year"]}
          />
        </Suspense>
      </div>

      {/* Legislation Grid */}
      <LegislationGrid items={items} />

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
