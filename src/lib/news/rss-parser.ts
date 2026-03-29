import Parser from "rss-parser";
import type { RawArticle } from "./sources/types";

// Custom fields to extract media:content, enclosure, and image
const parser = new Parser<Record<string, unknown>, {
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
  enclosure?: { url?: string };
}>({
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; HubAtlantico/1.0; +https://hubatlantico.com.br)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

export async function parseRssFeed(
  feedUrl: string,
  sourceName: string
): Promise<RawArticle[]> {
  const feed = await parser.parseURL(feedUrl);
  const articles: RawArticle[] = [];

  // Feed-level image as fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedImage = (feed as any).image?.url || undefined;

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const summary = item.contentSnippet || item.content || item.summary || "";

    // Extract image from multiple sources (priority order)
    const imageUrl =
      extractMediaImage(item) ||
      extractImageFromContent(item.content || "") ||
      extractImageFromContent(item.summary || "") ||
      extractImageFromContent((item as Record<string, unknown>)["content:encoded"] as string || "") ||
      feedImage;

    articles.push({
      title: item.title.trim(),
      summary: cleanSummary(summary, 280),
      originalUrl: item.link.trim(),
      imageUrl,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      sourceName,
    });
  }

  return articles;
}

function cleanSummary(text: string, maxLength: number): string {
  const clean = text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + "...";
}

/** Extract image from media:content, media:thumbnail, or enclosure RSS fields */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMediaImage(item: any): string | undefined {
  // media:content or media:thumbnail
  const mediaUrl =
    item["media:content"]?.$?.url ||
    item["media:thumbnail"]?.$?.url ||
    item["media:content"]?.url;
  if (mediaUrl && isValidImageUrl(mediaUrl)) return mediaUrl;

  // enclosure (used by many WordPress feeds)
  const encUrl = item.enclosure?.url;
  if (encUrl && isValidImageUrl(encUrl)) return encUrl;

  return undefined;
}

/** Extract first image URL from HTML content */
function extractImageFromContent(html: string): string | undefined {
  if (!html) return undefined;

  // Try <img src="...">
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) return imgMatch[1];

  // Try og:image or meta image in content
  const ogMatch = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1] && isValidImageUrl(ogMatch[1])) return ogMatch[1];

  return undefined;
}

function isValidImageUrl(url: string): boolean {
  if (!url || url.length < 10) return false;
  // Must be http(s) URL
  if (!url.startsWith("http")) return false;
  // Reject tiny tracking pixels / icons
  if (url.includes("1x1") || url.includes("pixel") || url.includes("blank.gif")) return false;
  return true;
}
