import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { NewsGrid } from "@/components/news/news-grid";
import { CategoryFilter } from "@/components/news/category-filter";
import { SearchBar } from "@/components/news/search-bar";
import { SavedFilters } from "@/components/filters/saved-filters";
import { PremiumPageGate } from "@/components/paywall/premium-page-gate";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    source?: string;
    search?: string;
  }>;
}

export const metadata = {
  title: "Notícias",
  description:
    "Todas as notícias do setor de saneamento, engenharia e tecnologia.",
};

export const dynamic = "force-dynamic";

export default async function NoticiasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.source) {
    where.source = { slug: params.source };
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { summary: { contains: params.search } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let articles: any[] = [];
  let total = 0;

  try {
    [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        include: {
          source: { select: { name: true, slug: true, logoUrl: true } },
          category: { select: { name: true, slug: true, color: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsArticle.count({ where }),
    ]);
  } catch (error) {
    console.error("Database error:", error);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Notícias</h1>
        <p className="mt-1 text-sm text-text-muted">
          Últimas notícias do setor de saneamento
        </p>
      </div>

      {/* Premium gate — FREE users see blurred preview */}
      <PremiumPageGate feature="notícias completas do setor">

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
        <Suspense fallback={null}>
          <SavedFilters
            moduleKey="noticias"
            basePath="/noticias"
            filterKeys={["category", "source", "search"]}
          />
        </Suspense>
      </div>

      {/* News Grid */}
      <NewsGrid articles={articles} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/noticias?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}`}
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
              href={`/noticias?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}`}
              className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-dark-hover"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
      </PremiumPageGate>
    </div>
  );
}
