import { prisma } from "@/lib/db";
import slugify from "slugify";
import { createAdapter } from "./sources";
import type { FetchResult, RawArticle } from "./sources/types";
import { deduplicateArticles } from "./deduplicator";
import { categorizeArticle } from "./categorizer";

export interface FetchSummary {
  totalSources: number;
  successCount: number;
  errorCount: number;
  totalArticlesFound: number;
  totalNewArticles: number;
  results: FetchResult[];
}

export async function fetchAllNews(): Promise<FetchSummary> {
  // Load all active sources from DB
  const sources = await prisma.newsSource.findMany({
    where: { isActive: true },
  });

  console.log(`Fetching news from ${sources.length} active sources...`);

  // Process sources in batches of 6 with 10s timeout per source to fit in 60s
  const BATCH_SIZE = 6;
  const SOURCE_TIMEOUT = 10_000;
  const fetchResults: FetchResult[] = [];

  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);

    const batchPromises = batch.map(async (source): Promise<FetchResult> => {
      const start = Date.now();
      const adapter = createAdapter(source);

      try {
        const articles = await Promise.race([
          adapter.fetch(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Source timeout (10s)")), SOURCE_TIMEOUT)
          ),
        ]);
        const duration = Date.now() - start;

        console.log(
          `[${source.name}] Fetched ${articles.length} articles in ${duration}ms`
        );

        return {
          sourceSlug: source.slug,
          sourceName: source.name,
          articles,
          duration,
        };
      } catch (error) {
        const duration = Date.now() - start;
        const errorMsg =
          error instanceof Error ? error.message : String(error);

        console.error(`[${source.name}] Error: ${errorMsg}`);

        return {
          sourceSlug: source.slug,
          sourceName: source.name,
          articles: [],
          error: errorMsg,
          duration,
        };
      }
    });

    const results = await Promise.allSettled(batchPromises);
    for (const r of results) {
      fetchResults.push(
        r.status === "fulfilled"
          ? r.value
          : {
              sourceSlug: "unknown",
              sourceName: "unknown",
              articles: [],
              error: r.reason?.message || "Unknown error",
              duration: 0,
            }
      );
    }
  }

  // Collect all articles and deduplicate
  const allArticles = fetchResults.flatMap((r) => r.articles);
  const deduplicated = deduplicateArticles(allArticles);

  console.log(
    `Total: ${allArticles.length} articles, ${deduplicated.length} after dedup`
  );

  // Store new articles in database
  const newArticleCount = await storeArticles(deduplicated, sources);

  // Log fetch results
  await logFetchResults(fetchResults);

  // Update lastFetchAt for successful sources
  for (const result of fetchResults) {
    if (!result.error) {
      await prisma.newsSource.update({
        where: { slug: result.sourceSlug },
        data: { lastFetchAt: new Date() },
      }).catch(() => {});
    }
  }

  return {
    totalSources: sources.length,
    successCount: fetchResults.filter((r) => !r.error).length,
    errorCount: fetchResults.filter((r) => !!r.error).length,
    totalArticlesFound: allArticles.length,
    totalNewArticles: newArticleCount,
    results: fetchResults,
  };
}

async function storeArticles(
  articles: RawArticle[],
  sources: Awaited<ReturnType<typeof prisma.newsSource.findMany>>
): Promise<number> {
  const sourceMap = new Map(sources.map((s) => [s.name, s.id]));
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Fallback category: "Saneamento Básico" — ensures articles are never silently dropped
  const fallbackCategoryId =
    categoryMap.get("saneamento-basico") ?? categories[0]?.id;

  // Get existing URLs to avoid duplicates
  const existingUrls = new Set(
    (
      await prisma.newsArticle.findMany({
        select: { originalUrl: true },
      })
    ).map((a) => a.originalUrl)
  );

  let newCount = 0;

  for (const article of articles) {
    // Skip if URL already exists
    if (existingUrls.has(article.originalUrl)) continue;

    const sourceId = sourceMap.get(article.sourceName);
    if (!sourceId) continue;

    // Auto-categorize — fall back to "Saneamento Básico" if no match
    const categorySlug = categorizeArticle(article.title, article.summary);
    const categoryId = categoryMap.get(categorySlug) ?? fallbackCategoryId;
    if (!categoryId) continue;

    // Generate unique slug
    const baseSlug = slugify(article.title, {
      lower: true,
      strict: true,
      locale: "pt",
    }).slice(0, 100);

    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    try {
      await prisma.newsArticle.create({
        data: {
          slug,
          title: article.title,
          summary: article.summary,
          imageUrl: article.imageUrl,
          originalUrl: article.originalUrl,
          sourceId,
          categoryId,
          publishedAt: article.publishedAt,
          status: "PUBLISHED",
        },
      });
      newCount++;
      existingUrls.add(article.originalUrl);
    } catch (error) {
      // Skip on unique constraint violation (race condition)
      console.warn(`Failed to insert: ${article.title}`, error);
    }
  }

  console.log(`Stored ${newCount} new articles`);
  return newCount;
}

async function logFetchResults(results: FetchResult[]): Promise<void> {
  for (const result of results) {
    try {
      await prisma.fetchLog.create({
        data: {
          sourceId: result.sourceSlug,
          sourceName: result.sourceName,
          status: result.error ? "error" : "success",
          articlesFound: result.articles.length,
          articlesNew: 0, // Updated after store
          errorMessage: result.error,
          duration: result.duration,
        },
      });
    } catch {
      // Logging failure should not break the flow
    }
  }
}
