import { NextRequest, NextResponse } from "next/server";
import { runSeed } from "@/lib/db/seeder";
import { fetchAllNews } from "@/lib/news/fetcher";
import { fetchAllLicitacoes } from "@/lib/licitacoes/fetcher";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * POST /api/admin/initialize
 * Inicializa o banco de dados (seed) e dispara o primeiro fetch de dados.
 * Protegido por CRON_SECRET.
 *
 * Uso:
 *   curl -X POST https://seu-dominio.vercel.app/api/admin/initialize \
 *     -H "Authorization: Bearer SEU_CRON_SECRET"
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: Record<string, unknown> = {};

  try {
    console.log("[initialize] Iniciando seed do banco...");
    const seedResult = await runSeed();
    results.seed = seedResult;
    console.log("[initialize] Seed concluído:", seedResult);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[initialize] Erro no seed:", msg);
    return NextResponse.json({ error: `Falha no seed: ${msg}` }, { status: 500 });
  }

  // Fetch de notícias e licitações em paralelo (com timeout individual)
  const [newsResult, licitacoesResult] = await Promise.allSettled([
    (async () => {
      console.log("[initialize] Iniciando fetch de notícias...");
      const result = await fetchAllNews();
      console.log("[initialize] Notícias concluído:", result);
      return result;
    })(),
    (async () => {
      console.log("[initialize] Iniciando fetch de licitações...");
      const result = await fetchAllLicitacoes();
      console.log("[initialize] Licitações concluído:", result);
      return result;
    })(),
  ]);

  results.news = newsResult.status === "fulfilled"
    ? newsResult.value
    : { error: newsResult.reason instanceof Error ? newsResult.reason.message : String(newsResult.reason) };

  results.licitacoes = licitacoesResult.status === "fulfilled"
    ? licitacoesResult.value
    : { error: licitacoesResult.reason instanceof Error ? licitacoesResult.reason.message : String(licitacoesResult.reason) };

  const duration = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    duration: `${(duration / 1000).toFixed(1)}s`,
    ...results,
  });
}
