import Parser from "rss-parser";
import type { RawArticle } from "./sources/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; HubAtlantico/1.0; +https://hubatlantico.com.br)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

export async function parseRssFeed(
  feedUrl: string,
  sourceName: string
): Promise<RawArticle[]> {
  const feed = await parser.parseURL(feedUrl);
  const articles: RawArticle[] = [];

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const summary =
      item.contentSnippet || item.content || item.summary || "";

    articles.push({
      title: item.title.trim(),
      summary: cleanSummary(summary, 280),
      originalUrl: item.link.trim(),
      imageUrl: extractImageFromContent(item.content || ""),
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      sourceName,
    });
  }

  return articles;
}

function cleanSummary(text: string, maxLength: number): string {
  // Remove HTML tags
  const clean = text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + "...";
}

function extractImageFromContent(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}
