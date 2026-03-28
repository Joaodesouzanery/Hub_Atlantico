import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * GET /api/admin/status
 * Retorna o estado atual do banco de dados.
 * Protegido por CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const [
    newsArticles,
    newsSources,
    licitacoes,
    licitacaoSources,
    agencies,
    legislationItems,
    lastNewsLog,
    lastLicitacaoLog,
  ] = await Promise.all([
    prisma.newsArticle.count(),
    prisma.newsSource.count(),
    prisma.licitacao.count(),
    prisma.licitacaoSource.count(),
    prisma.regulatoryAgency.count(),
    prisma.legislation.count(),
    prisma.fetchLog.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.licitacaoFetchLog.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    database: {
      newsArticles,
      newsSources,
      licitacoes,
      licitacaoSources,
      agencies,
      legislationItems,
    },
    lastFetch: {
      news: lastNewsLog
        ? { at: lastNewsLog.createdAt, status: lastNewsLog.status, articlesNew: lastNewsLog.articlesNew }
        : null,
      licitacoes: lastLicitacaoLog
        ? { at: lastLicitacaoLog.createdAt, status: lastLicitacaoLog.status, licitacoesNew: lastLicitacaoLog.licitacoesNew }
        : null,
    },
    seeded: newsSources > 0 && licitacaoSources > 0,
  });
}
