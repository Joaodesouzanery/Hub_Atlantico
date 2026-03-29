import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchAllNews } from "@/lib/news/fetcher";
import { fetchAllLicitacoes } from "@/lib/licitacoes/fetcher";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/internal/trigger-fetch
 * Auto-triggered by dashboard when DB has no data.
 * No auth required — only fetches if DB is truly empty (anti-abuse).
 */
export async function POST() {
  try {
    const [newsCount, licCount] = await Promise.all([
      prisma.newsArticle.count(),
      prisma.licitacao.count(),
    ]);

    // Only fetch if DB is nearly empty (anti-abuse: won't re-fetch if data exists)
    if (newsCount > 20 && licCount > 20) {
      return NextResponse.json({ skipped: true, newsCount, licCount });
    }

    const results: Record<string, unknown> = {};

    if (newsCount <= 20) {
      try {
        results.news = await fetchAllNews();
      } catch (e) {
        results.newsError = e instanceof Error ? e.message : String(e);
      }
    }

    if (licCount <= 20) {
      try {
        results.licitacoes = await fetchAllLicitacoes();
      } catch (e) {
        results.licitacoesError = e instanceof Error ? e.message : String(e);
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
