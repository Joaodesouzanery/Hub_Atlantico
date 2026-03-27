import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  Globe,
  FolderOpen,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentSources } from "@/components/dashboard/recent-sources";
import { NewsGrid } from "@/components/news/news-grid";
import { categories } from "@/config/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let articleCount = 0;
  let sourceCount = 0;
  let categoryCount = 0;
  let todayCount = 0;
  let latestArticles: any[] = [];
  let topSources: any[] = [];

  try {
    [articleCount, sourceCount, categoryCount, latestArticles, topSources] =
      await Promise.all([
        prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
        prisma.newsSource.count({ where: { isActive: true } }),
        prisma.category.count(),
        prisma.newsArticle.findMany({
          where: { status: "PUBLISHED" },
          include: {
            source: { select: { name: true, slug: true, logoUrl: true } },
            category: { select: { name: true, slug: true, color: true } },
          },
          orderBy: { publishedAt: "desc" },
          take: 6,
        }),
        prisma.newsSource.findMany({
          where: { isActive: true },
          include: { _count: { select: { articles: true } } },
          orderBy: { name: "asc" },
          take: 8,
        }),
      ]);

    todayCount = await prisma.newsArticle.count({
      where: {
        status: "PUBLISHED",
        fetchedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
  } catch (error) {
    console.error("Database query error:", error);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
        <Header />
        <main className="flex-1 bg-dark-bg p-4 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">
              Bem-vindo ao HuB - Atlântico
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Acompanhe as últimas notícias do setor de saneamento.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total de Notícias"
              value={articleCount}
              change={`+${todayCount} hoje`}
              changeType="positive"
              icon={Newspaper}
            />
            <StatCard
              title="Fontes Ativas"
              value={sourceCount}
              change="Atualização diária"
              changeType="neutral"
              icon={Globe}
            />
            <StatCard
              title="Categorias"
              value={categoryCount}
              icon={FolderOpen}
            />
            <StatCard
              title="Visualizações"
              value={0}
              change="Período: 7 dias"
              changeType="neutral"
              icon={TrendingUp}
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Latest News - 2 cols */}
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                  Últimas Notícias
                </h3>
                <Link
                  href="/noticias"
                  className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-400"
                >
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <NewsGrid
                articles={latestArticles}
                emptyMessage="Nenhuma notícia ainda. As notícias serão carregadas automaticamente."
              />
            </div>

            {/* Sidebar content - 1 col */}
            <div className="space-y-6">
              {/* Sources */}
              <RecentSources
                sources={topSources.map((s: any) => ({
                  name: s.name,
                  slug: s.slug,
                  articleCount: s._count?.articles || 0,
                }))}
              />

              {/* Categories */}
              <div className="rounded-xl border border-dark-border bg-dark-card">
                <div className="border-b border-dark-border p-5">
                  <h3 className="font-semibold text-text-primary">
                    Categorias
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/noticias?category=${cat.slug}`}
                        className="rounded-lg border border-dark-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
                        style={{
                          borderColor: `${cat.color}40`,
                          color: cat.color,
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
