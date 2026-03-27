export interface RawArticle {
  title: string;
  summary: string;
  originalUrl: string;
  imageUrl?: string;
  publishedAt: Date;
  sourceName: string;
}

export interface FetchConfig {
  // WordPress API
  wpApiUrl?: string;
  perPage?: number;
  fallbackMethod?: string;

  // HTML Scraping selectors
  articleListSelector?: string;
  titleSelector?: string;
  summarySelector?: string;
  imageSelector?: string;
  linkSelector?: string;
  dateSelector?: string;
  dateFormat?: string;

  // Pagination
  maxPages?: number;
  paginationParam?: string;
}

export interface SourceAdapter {
  sourceSlug: string;
  sourceName: string;
  fetch(): Promise<RawArticle[]>;
}

export interface FetchResult {
  sourceSlug: string;
  sourceName: string;
  articles: RawArticle[];
  error?: string;
  duration: number;
}
