/**
 * Next.js Instrumentation Hook
 * Executado uma vez na inicialização do servidor.
 * Auto-inicializa o banco e força refetch quando os dados estão escassos.
 */
export async function register() {
  // Só executa no runtime Node.js (não no Edge)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { prisma } = await import("@/lib/db");

    // 1. Seed de dados estáticos (upsert — seguro rodar sempre, atualiza URLs corrigidas)
    const { runSeed } = await import("@/lib/db/seeder");
    await runSeed().catch((err) => console.error("[instrumentation] Seed error:", err));
    console.log("[instrumentation] Seed executado.");

    // 2. Fetch de notícias se tiver poucos artigos (< 50)
    const articleCount = await prisma.newsArticle.count().catch(() => -1);
    if (articleCount >= 0 && articleCount < 50) {
      console.log(`[instrumentation] Poucos artigos (${articleCount}) — fetch de notícias em background.`);
      Promise.resolve()
        .then(() => import("@/lib/news/fetcher").then((m) => m.fetchAllNews()))
        .catch((err) => console.error("[instrumentation] News fetch error:", err));
    }

    // 3. Fetch de licitações se tiver poucas (< 100)
    const licitacaoCount = await prisma.licitacao.count().catch(() => -1);
    if (licitacaoCount >= 0 && licitacaoCount < 100) {
      console.log(`[instrumentation] Poucas licitações (${licitacaoCount}) — fetch PNCP em background.`);
      Promise.resolve()
        .then(() => import("@/lib/licitacoes/fetcher").then((m) => m.fetchAllLicitacoes()))
        .catch((err) => console.error("[instrumentation] Licitações fetch error:", err));
    }
  } catch (err) {
    // Não quebra o servidor — apenas loga
    console.error("[instrumentation] Erro na inicialização:", err);
  }
}
