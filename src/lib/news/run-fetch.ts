/**
 * Standalone script to manually run the news fetcher.
 * Usage: npm run fetch-news
 */
import { fetchAllNews } from "./fetcher";

async function main() {
  console.log("=== Hub Atlântico - News Fetcher ===");
  console.log(`Starting at ${new Date().toISOString()}\n`);

  const summary = await fetchAllNews();

  console.log("\n=== Summary ===");
  console.log(`Sources: ${summary.totalSources}`);
  console.log(`Success: ${summary.successCount}`);
  console.log(`Errors: ${summary.errorCount}`);
  console.log(`Articles found: ${summary.totalArticlesFound}`);
  console.log(`New articles stored: ${summary.totalNewArticles}`);

  console.log("\n=== Per Source ===");
  for (const result of summary.results) {
    const status = result.error ? `ERROR: ${result.error}` : "OK";
    console.log(
      `  [${result.sourceName}] ${result.articles.length} articles - ${result.duration}ms - ${status}`
    );
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
