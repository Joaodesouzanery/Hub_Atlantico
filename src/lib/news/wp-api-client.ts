import type { RawArticle, FetchConfig } from "./sources/types";

interface WpPost {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
    }>;
  };
}

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; HubAtlantico/1.0; +https://hubatlantico.com.br)",
  Accept: "application/json",
};

export async function fetchFromWordPressApi(
  config: FetchConfig,
  sourceName: string
): Promise<RawArticle[]> {
  if (!config.wpApiUrl) {
    throw new Error("wpApiUrl is required for WP_API fetch method");
  }

  const perPage = config.perPage || 10;
  const url = `${config.wpApiUrl}?per_page=${perPage}&_embed=wp:featuredmedia&orderby=date&order=desc`;

  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`WordPress API returned HTTP ${response.status}`);
  }

  const posts: WpPost[] = await response.json();
  const articles: RawArticle[] = [];

  for (const post of posts) {
    const title = cleanHtml(post.title.rendered);
    if (!title) continue;

    const summary = cleanHtml(post.excerpt.rendered, 280);
    const imageUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || undefined;

    articles.push({
      title,
      summary: summary || `Leia mais sobre: ${title}`,
      originalUrl: post.link,
      imageUrl,
      publishedAt: new Date(post.date),
      sourceName,
    });
  }

  return articles;
}

function cleanHtml(html: string, maxLength?: number): string {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength).trimEnd() + "...";
  }

  return text;
}
