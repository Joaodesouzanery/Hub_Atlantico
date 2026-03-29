import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdapter } from "@/lib/news/sources";
import { categorizeArticle } from "@/lib/news/categorizer";
import { deduplicateArticles } from "@/lib/news/deduplicator";
import slugify from "slugify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/internal/fetch-batch?type=news&offset=0&limit=5
 * POST /api/internal/fetch-batch?type=licitacoes
 *
 * Fetches a small batch of sources to fit within 60s Hobby limit.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "news";
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  try {
    if (type === "licitacoes") {
      // Import dynamically to avoid loading everything
      const { fetchAllLicitacoes } = await import("@/lib/licitacoes/fetcher");
      const result = await fetchAllLicitacoes();
      return NextResponse.json({ success: true, ...result });
    }

    // News: fetch a batch of sources
    const sources = await prisma.newsSource.findMany({
      where: { isActive: true },
      skip: offset,
      take: limit,
      orderBy: { name: "asc" },
    });

    if (sources.length === 0) {
      return NextResponse.json({ done: true, message: "No more sources" });
    }

    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
    const fallbackCategoryId = categoryMap.get("saneamento-basico") ?? categories[0]?.id;

    const existingUrls = new Set(
      (await prisma.newsArticle.findMany({ select: { originalUrl: true } }))
        .map((a) => a.originalUrl)
    );

    let totalArticles = 0;
    let newArticles = 0;
    const errors: string[] = [];

    for (const source of sources) {
      try {
        const adapter = createAdapter(source);
        const articles = await Promise.race([
          adapter.fetch(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout 10s")), 10000)
          ),
        ]);

        const deduped = deduplicateArticles(articles);
        totalArticles += deduped.length;

        for (const article of deduped) {
          if (existingUrls.has(article.originalUrl)) continue;

          const categorySlug = categorizeArticle(article.title, article.summary);
          const categoryId = categoryMap.get(categorySlug) ?? fallbackCategoryId;
          if (!categoryId) continue;

          const baseSlug = slugify(article.title, { lower: true, strict: true, locale: "pt" }).slice(0, 100);
          const slug = `${baseSlug}-${Date.now().toString(36)}`;

          try {
            await prisma.newsArticle.create({
              data: {
                slug,
                title: article.title,
                summary: article.summary,
                imageUrl: article.imageUrl,
                originalUrl: article.originalUrl,
                sourceId: source.id,
                categoryId,
                publishedAt: article.publishedAt,
                status: "PUBLISHED",
              },
            });
            newArticles++;
            existingUrls.add(article.originalUrl);
          } catch {
            // Skip duplicates
          }
        }

        await prisma.newsSource.update({
          where: { slug: source.slug },
          data: { lastFetchAt: new Date() },
        }).catch(() => {});
      } catch (error) {
        errors.push(`${source.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const totalSources = await prisma.newsSource.count({ where: { isActive: true } });

    return NextResponse.json({
      success: true,
      batch: { offset, limit, fetched: sources.length },
      totalActiveSources: totalSources,
      hasMore: offset + limit < totalSources,
      nextOffset: offset + limit,
      totalArticles,
      newArticles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
