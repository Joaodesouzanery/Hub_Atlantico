/**
 * Next.js Instrumentation Hook
 * Executado uma vez na inicialização do servidor.
 * Auto-inicializa o banco na primeira execução (sem fontes cadastradas).
 */
export async function register() {
  // Só executa no runtime Node.js (não no Edge)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { prisma } = await import("@/lib/db");

    // 1. Seed de dados estáticos se o banco estiver vazio
    const sourceCount = await prisma.newsSource.count().catch(() => -1);
    if (sourceCount === 0) {
      const { runSeed } = await import("@/lib/db/seeder");
      await runSeed();
      console.log("[instrumentation] Seed inicial executado.");
    }

    // 2. Fetch de artigos/licitações se não houver nenhum (fire-and-forget)
    const articleCount = await prisma.newsArticle.count().catch(() => -1);
    if (articleCount === 0) {
      console.log("[instrumentation] Banco vazio — iniciando fetch inicial em background.");
      Promise.allSettled([
        import("@/lib/news/fetcher").then((m) => m.fetchAllNews()),
        import("@/lib/licitacoes/fetcher").then((m) => m.fetchAllLicitacoes()),
      ])
        .then((results) => {
          results.forEach((r) => {
            if (r.status === "rejected") console.error("[instrumentation] Fetch error:", r.reason);
          });
          console.log("[instrumentation] Fetch inicial concluído.");
        })
        .catch(() => {});
    }
  } catch (err) {
    // Não quebra o servidor — apenas loga
    console.error("[instrumentation] Erro na inicialização:", err);
  }
}
