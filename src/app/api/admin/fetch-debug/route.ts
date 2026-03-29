import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdapter } from "@/lib/news/sources";
import { createLicitacaoAdapter } from "@/lib/licitacoes/sources";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * GET /api/admin/fetch-debug?source=aegea&type=news
 * GET /api/admin/fetch-debug?source=pncp&type=licitacoes
 *
 * Testa UMA fonte e retorna resultado detalhado.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceSlug = searchParams.get("source");
  const type = searchParams.get("type") || "news";

  if (!sourceSlug) {
    // List all sources with their status
    const [newsSources, licitacaoSources] = await Promise.all([
      prisma.newsSource.findMany({
        select: { slug: true, name: true, fetchMethod: true, isActive: true, lastFetchAt: true },
        orderBy: { isActive: "desc" },
      }),
      prisma.licitacaoSource.findMany({
        select: { slug: true, name: true, fetchMethod: true, isActive: true, lastFetchAt: true },
        orderBy: { isActive: "desc" },
      }),
    ]);

    return NextResponse.json({
      usage: "GET /api/admin/fetch-debug?source=SLUG&type=news|licitacoes",
      newsSources: newsSources.map((s) => ({
        slug: s.slug,
        name: s.name,
        method: s.fetchMethod,
        active: s.isActive,
        lastFetch: s.lastFetchAt,
      })),
      licitacaoSources: licitacaoSources.map((s) => ({
        slug: s.slug,
        name: s.name,
        method: s.fetchMethod,
        active: s.isActive,
        lastFetch: s.lastFetchAt,
      })),
    });
  }

  const start = Date.now();

  try {
    if (type === "licitacoes") {
      const source = await prisma.licitacaoSource.findUnique({
        where: { slug: sourceSlug },
      });

      if (!source) {
        return NextResponse.json({ error: `Fonte "${sourceSlug}" não encontrada` }, { status: 404 });
      }

      const adapter = createLicitacaoAdapter(source);
      const licitacoes = await adapter.fetch();
      const duration = Date.now() - start;

      return NextResponse.json({
        source: { slug: source.slug, name: source.name, method: source.fetchMethod },
        success: true,
        duration: `${duration}ms`,
        count: licitacoes.length,
        sample: licitacoes.slice(0, 3).map((l) => ({
          title: l.title.slice(0, 100),
          uf: l.uf,
          modalidade: l.modalidade,
          status: l.status,
          estimatedValue: l.estimatedValue,
        })),
      });
    }

    // Default: news
    const source = await prisma.newsSource.findUnique({
      where: { slug: sourceSlug },
    });

    if (!source) {
      return NextResponse.json({ error: `Fonte "${sourceSlug}" não encontrada` }, { status: 404 });
    }

    const adapter = createAdapter(source);
    const articles = await adapter.fetch();
    const duration = Date.now() - start;

    return NextResponse.json({
      source: { slug: source.slug, name: source.name, method: source.fetchMethod, feedUrl: source.feedUrl, scrapeUrl: source.scrapeUrl },
      success: true,
      duration: `${duration}ms`,
      count: articles.length,
      sample: articles.slice(0, 3).map((a) => ({
        title: a.title.slice(0, 100),
        url: a.originalUrl,
        publishedAt: a.publishedAt,
      })),
    });
  } catch (error) {
    const duration = Date.now() - start;
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      source: sourceSlug,
      type,
      success: false,
      duration: `${duration}ms`,
      error: message,
    });
  }
}
