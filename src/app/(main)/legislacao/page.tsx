import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { LegislationGrid } from "@/components/legislation/legislation-grid";
import { LegislationTypeFilter } from "@/components/legislation/legislation-type-filter";
import { LegislationSearchBar } from "@/components/legislation/legislation-search-bar";
import { SavedFilters } from "@/components/filters/saved-filters";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    search?: string;
  }>;
}

export const metadata = {
  title: "Legislação",
  description:
    "Legislações, normas e regulamentações do setor de saneamento.",
};

export const dynamic = "force-dynamic";

export default async function LegislacaoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.type) {
    where.type = params.type;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[] = [];
  let total = 0;

  try {
    [items, total] = await Promise.all([
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
  } catch (error) {
    console.error("Database error:", error);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Legislação</h1>
        <p className="mt-1 text-sm text-text-muted">
          {total} {total === 1 ? "legislação encontrada" : "legislações encontradas"}
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
          <SavedFilters
            moduleKey="legislacao"
            basePath="/legislacao"
            filterKeys={["type", "search"]}
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
              href={`/legislacao?page=${page - 1}${params.type ? `&type=${params.type}` : ""}${params.search ? `&search=${params.search}` : ""}`}
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
              href={`/legislacao?page=${page + 1}${params.type ? `&type=${params.type}` : ""}${params.search ? `&search=${params.search}` : ""}`}
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
