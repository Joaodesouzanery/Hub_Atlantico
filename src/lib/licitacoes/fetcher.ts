import { prisma } from "@/lib/db";
import slugify from "slugify";
import { createLicitacaoAdapter } from "./sources";
import type { RawLicitacao, LicitacaoFetchResult } from "./types";
import { deduplicateLicitacoes } from "./deduplicator";
import { categorizeLicitacao } from "./categorizer";
import { scoreLicitacaoRelevance } from "./relevance-scorer";

export interface LicitacaoFetchSummary {
  totalSources: number;
  successCount: number;
  errorCount: number;
  totalLicitacoesFound: number;
  totalNewLicitacoes: number;
  results: LicitacaoFetchResult[];
}

export async function fetchAllLicitacoes(): Promise<LicitacaoFetchSummary> {
  // 1. Load all active LicitacaoSource entries
  const sources = await prisma.licitacaoSource.findMany({
    where: { isActive: true },
  });

  console.log(
    `Fetching licitacoes from ${sources.length} active sources...`
  );

  // 2. Create adapters and run all fetches in parallel
  const promises = sources.map(
    async (source): Promise<LicitacaoFetchResult> => {
      const start = Date.now();
      const adapter = createLicitacaoAdapter(source);

      try {
        const licitacoes = await adapter.fetch();
        const duration = Date.now() - start;

        console.log(
          `[${source.name}] Fetched ${licitacoes.length} licitacoes in ${duration}ms`
        );

        return {
          sourceSlug: source.slug,
          sourceName: source.name,
          licitacoes,
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
          licitacoes: [],
          error: errorMsg,
          duration,
        };
      }
    }
  );

  const results = await Promise.allSettled(promises);
  const fetchResults: LicitacaoFetchResult[] = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : {
          sourceSlug: "unknown",
          sourceName: "unknown",
          licitacoes: [],
          error: r.reason?.message || "Unknown error",
          duration: 0,
        }
  );

  // 3. Collect all licitacoes and deduplicate
  const allLicitacoes = fetchResults.flatMap((r) => r.licitacoes);
  const deduplicated = deduplicateLicitacoes(allLicitacoes);

  console.log(
    `Total: ${allLicitacoes.length} licitacoes, ${deduplicated.length} after dedup`
  );

  // 4. Score relevance and auto-categorize, then store
  const newCount = await storeLicitacoes(deduplicated, sources);

  // 5. Log fetch results
  await logFetchResults(fetchResults);

  // 6. Update lastFetchAt for successful sources
  for (const result of fetchResults) {
    if (!result.error) {
      await prisma.licitacaoSource
        .update({
          where: { slug: result.sourceSlug },
          data: { lastFetchAt: new Date() },
        })
        .catch(() => {});
    }
  }

  return {
    totalSources: sources.length,
    successCount: fetchResults.filter((r) => !r.error).length,
    errorCount: fetchResults.filter((r) => !!r.error).length,
    totalLicitacoesFound: allLicitacoes.length,
    totalNewLicitacoes: newCount,
    results: fetchResults,
  };
}

async function storeLicitacoes(
  licitacoes: RawLicitacao[],
  sources: Awaited<ReturnType<typeof prisma.licitacaoSource.findMany>>
): Promise<number> {
  const sourceMap = new Map(sources.map((s) => [s.name, s.id]));

  // Load categories for ID lookup
  const categories = await prisma.licitacaoCategory.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Get existing URLs to avoid duplicates
  const existingUrls = new Set(
    (
      await prisma.licitacao.findMany({
        select: { originalUrl: true },
      })
    ).map((l) => l.originalUrl)
  );

  let newCount = 0;

  for (const licitacao of licitacoes) {
    // Skip if URL already exists
    if (existingUrls.has(licitacao.originalUrl)) continue;

    const sourceId = sourceMap.get(licitacao.sourceName);
    if (!sourceId) continue;

    // Score relevance
    const relevanceScore = scoreLicitacaoRelevance(
      licitacao.title,
      licitacao.description
    );

    // Auto-categorize
    const categorySlug = await categorizeLicitacao(
      licitacao.title,
      licitacao.description
    );
    const categoryId = categoryMap.get(categorySlug) || null;

    // Generate unique slug
    const baseSlug = slugify(licitacao.title, {
      lower: true,
      strict: true,
      locale: "pt",
    }).slice(0, 100);

    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    try {
      await prisma.licitacao.create({
        data: {
          slug,
          title: licitacao.title,
          description: licitacao.description,
          process: licitacao.process,
          modalidade: licitacao.modalidade,
          status: licitacao.status,
          estimatedValue: licitacao.estimatedValue,
          currency: "BRL",
          uf: licitacao.uf,
          city: licitacao.city,
          organ: licitacao.organ,
          organCnpj: licitacao.organCnpj,
          originalUrl: licitacao.originalUrl,
          editalUrl: licitacao.editalUrl,
          sourceId,
          categoryId,
          openDate: licitacao.openDate,
          closeDate: licitacao.closeDate,
          publishedAt: licitacao.publishedAt,
          relevanceScore,
        },
      });
      newCount++;
      existingUrls.add(licitacao.originalUrl);
    } catch (error) {
      // Skip on unique constraint violation (race condition)
      console.warn(`Failed to insert: ${licitacao.title}`, error);
    }
  }

  console.log(`Stored ${newCount} new licitacoes`);
  return newCount;
}

async function logFetchResults(
  results: LicitacaoFetchResult[]
): Promise<void> {
  for (const result of results) {
    try {
      await prisma.licitacaoFetchLog.create({
        data: {
          sourceId: result.sourceSlug,
          sourceName: result.sourceName,
          status: result.error ? "error" : "success",
          licitacoesFound: result.licitacoes.length,
          licitacoesNew: 0, // Updated after store
          errorMessage: result.error,
          duration: result.duration,
        },
      });
    } catch {
      // Logging failure should not break the flow
    }
  }
}
