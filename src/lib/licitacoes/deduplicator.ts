import type { RawLicitacao } from "./types";

/**
 * Deduplicate licitacoes by normalized URL and title similarity.
 * Follows the same pattern as the news deduplicator.
 */
export function deduplicateLicitacoes(
  licitacoes: RawLicitacao[]
): RawLicitacao[] {
  const seen = new Map<string, RawLicitacao>();

  for (const licitacao of licitacoes) {
    const urlKey = normalizeUrl(licitacao.originalUrl);

    if (seen.has(urlKey)) continue;

    // Check title similarity against existing entries
    let isDuplicate = false;
    for (const existing of seen.values()) {
      if (titleSimilarity(licitacao.title, existing.title) > 0.85) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(urlKey, licitacao);
    }
  }

  return Array.from(seen.values());
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove trailing slash, query params, and hash
    return `${u.origin}${u.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch {
    return url.toLowerCase().replace(/\/$/, "");
  }
}

function titleSimilarity(a: string, b: string): number {
  const wordsA = normalizeTitle(a);
  const wordsB = normalizeTitle(b);

  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union; // Jaccard similarity
}

function normalizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2); // ignore short words
}
