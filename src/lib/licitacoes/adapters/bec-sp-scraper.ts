import * as cheerio from "cheerio";
import type { RawLicitacao, LicitacaoFetchConfig } from "../types";

const FETCH_TIMEOUT = 30_000;

const DEFAULT_KEYWORDS = [
  "saneamento", "água", "agua", "esgoto", "drenagem",
  "resíduos", "residuos", "tubulação", "tubulacao", "bomba hidraulica",
  "estação elevatória", "abastecimento",
];

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

/**
 * Scraper for BEC-SP (Bolsa Eletrônica de Compras do Estado de São Paulo).
 * Fetches the open licitações listing filtered by sanitation keywords.
 */
export async function fetchFromBECSP(
  config: LicitacaoFetchConfig,
  sourceName: string
): Promise<RawLicitacao[]> {
  const keywords: string[] = config.keywords?.length ? config.keywords : DEFAULT_KEYWORDS;
  const allResults: RawLicitacao[] = [];
  const seenUrls = new Set<string>();

  // BEC-SP search page for open licitações (dispensa and pregão)
  const searchUrls = [
    "https://www.bec.sp.gov.br/sicop/pre_oferta_compra_li.aspx",
    "https://www.bec.sp.gov.br/compras/aspx/Compra_li.aspx",
  ];

  for (const searchUrl of searchUrls) {
    try {
      console.log(`[BEC-SP] Fetching: ${searchUrl}`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: DEFAULT_HEADERS,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[BEC-SP] HTTP ${response.status} for ${searchUrl}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // BEC-SP uses table-based layout for licitações
      const rows = $("table tr, .licitacao-item, .resultado tr, tbody tr").toArray();

      for (const row of rows) {
        const $row = $(row);
        const text = $row.text().trim();
        if (!text || text.length < 20) continue;

        // Check if row contains sanitation keywords
        const textLower = text.toLowerCase();
        if (!keywords.some((kw) => textLower.includes(kw.toLowerCase()))) continue;

        // Extract link
        const linkEl = $row.find("a").first();
        let href = linkEl.attr("href") || "";
        if (!href) continue;

        if (href.startsWith("/")) {
          href = `https://www.bec.sp.gov.br${href}`;
        } else if (!href.startsWith("http")) {
          href = `https://www.bec.sp.gov.br/${href}`;
        }

        if (seenUrls.has(href)) continue;
        seenUrls.add(href);

        // Extract title from link text or first meaningful cell
        const title = linkEl.text().trim() ||
          $row.find("td").eq(1).text().trim() ||
          text.slice(0, 200);

        if (!title || title.length < 10) continue;

        // Extract other metadata
        const cells = $row.find("td").toArray().map((td) => $(td).text().trim());
        const organ = cells.find((c) => c.length > 5 && c.length < 100) || undefined;
        const dateText = cells.find((c) => /\d{2}\/\d{2}\/\d{4}/.test(c));
        const publishedAt = dateText ? parseBrazilianDate(dateText) || new Date() : new Date();

        allResults.push({
          title: title.slice(0, 500),
          description: text.slice(0, 2000),
          modalidade: "DISPENSA",
          status: "ABERTA",
          uf: "SP",
          organ,
          originalUrl: href,
          publishedAt,
          sourceName,
        });
      }

      console.log(`[BEC-SP] ${searchUrl}: found ${allResults.length} sanitation items`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`[BEC-SP] Timeout for ${searchUrl}`);
      } else {
        console.warn(`[BEC-SP] Error:`, error instanceof Error ? error.message : error);
      }
      continue;
    }
  }

  return allResults;
}

function parseBrazilianDate(text: string): Date | null {
  const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }
  return null;
}
