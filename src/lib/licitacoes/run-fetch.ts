/**
 * Standalone script to manually run the licitacoes fetcher.
 * Usage: npx tsx src/lib/licitacoes/run-fetch.ts
 */
import { fetchAllLicitacoes } from "./fetcher";

async function main() {
  console.log("=== Hub Atlantico - Licitacoes Fetcher ===");
  console.log(`Starting at ${new Date().toISOString()}\n`);

  const summary = await fetchAllLicitacoes();

  console.log("\n=== Summary ===");
  console.log(`Sources: ${summary.totalSources}`);
  console.log(`Success: ${summary.successCount}`);
  console.log(`Errors: ${summary.errorCount}`);
  console.log(`Licitacoes found: ${summary.totalLicitacoesFound}`);
  console.log(`New licitacoes stored: ${summary.totalNewLicitacoes}`);

  console.log("\n=== Per Source ===");
  for (const result of summary.results) {
    const status = result.error ? `ERROR: ${result.error}` : "OK";
    console.log(
      `  [${result.sourceName}] ${result.licitacoes.length} licitacoes - ${result.duration}ms - ${status}`
    );
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
