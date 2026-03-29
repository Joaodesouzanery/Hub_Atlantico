import * as cheerio from "cheerio";
import type { RawArticle, FetchConfig } from "./sources/types";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
};

export async function scrapeHtml(
  url: string,
  config: FetchConfig,
  sourceName: string
): Promise<RawArticle[]> {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: RawArticle[] = [];

  const listSelector = config.articleListSelector || "article";
  const elements = $(listSelector);

  elements.each((_, el) => {
    const $el = $(el);

    // Extract title
    const titleSelector = config.titleSelector || "h2 a, h3 a";
    const titleEl = $el.find(titleSelector).first();
    const title = titleEl.text().trim();

    if (!title) return;

    // Extract link
    const linkSelector = config.linkSelector || titleSelector;
    const linkEl = $el.find(linkSelector).first();
    let link = linkEl.attr("href") || "";

    if (!link) return;

    // Make absolute URL
    if (link.startsWith("/")) {
      const baseUrl = new URL(url);
      link = `${baseUrl.origin}${link}`;
    } else if (!link.startsWith("http")) {
      link = new URL(link, url).href;
    }

    // Extract summary
    const summarySelector = config.summarySelector || "p";
    const summary = cleanText(
      $el.find(summarySelector).first().text(),
      280
    );

    // Extract image
    const imageSelector = config.imageSelector || "img";
    const imageEl = $el.find(imageSelector).first();
    let imageUrl =
      imageEl.attr("data-src") ||
      imageEl.attr("data-lazy-src") ||
      imageEl.attr("src") ||
      undefined;

    if (imageUrl && imageUrl.startsWith("/")) {
      const baseUrl = new URL(url);
      imageUrl = `${baseUrl.origin}${imageUrl}`;
    }

    // Extract date
    let publishedAt = new Date();
    if (config.dateSelector) {
      const dateText = $el.find(config.dateSelector).first().text().trim();
      if (dateText) {
        const parsed = parseBrazilianDate(dateText);
        if (parsed) publishedAt = parsed;
      }
    }

    articles.push({
      title,
      summary: summary || `Leia mais sobre: ${title}`,
      originalUrl: link,
      imageUrl,
      publishedAt,
      sourceName,
    });
  });

  return articles;
}

function cleanText(text: string, maxLength: number): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + "...";
}

function parseBrazilianDate(text: string): Date | null {
  // Formats: "27/03/2026", "27 mar 2026", "27 de março de 2026"
  const months: Record<string, number> = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
    janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3,
    maio: 4, junho: 5, julho: 6, agosto: 7, setembro: 8,
    outubro: 9, novembro: 10, dezembro: 11,
  };

  // DD/MM/YYYY
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    return new Date(
      parseInt(slashMatch[3]),
      parseInt(slashMatch[2]) - 1,
      parseInt(slashMatch[1])
    );
  }

  // DD de MES de YYYY or DD MES YYYY
  const wordMatch = text
    .toLowerCase()
    .match(/(\d{1,2})\s+(?:de\s+)?(\w+)\s+(?:de\s+)?(\d{4})/);
  if (wordMatch) {
    const month = months[wordMatch[2]];
    if (month !== undefined) {
      return new Date(parseInt(wordMatch[3]), month, parseInt(wordMatch[1]));
    }
  }

  return null;
}
