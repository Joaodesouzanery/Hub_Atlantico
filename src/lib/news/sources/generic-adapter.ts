import type { NewsSource } from "@prisma/client";
import type { RawArticle, FetchConfig, SourceAdapter } from "./types";
import { parseRssFeed } from "../rss-parser";
import { scrapeHtml } from "../html-scraper";
import { fetchFromWordPressApi } from "../wp-api-client";

/**
 * Generic adapter that dynamically selects fetch method
 * based on the source configuration stored in the database.
 */
export function createAdapter(source: NewsSource): SourceAdapter {
  const config: FetchConfig = source.fetchConfig
    ? JSON.parse(source.fetchConfig)
    : {};

  return {
    sourceSlug: source.slug,
    sourceName: source.name,

    async fetch(): Promise<RawArticle[]> {
      switch (source.fetchMethod) {
        case "RSS":
          if (!source.feedUrl) {
            throw new Error(`No feedUrl configured for ${source.name}`);
          }
          return parseRssFeed(source.feedUrl, source.name);

        case "WP_API":
          try {
            return await fetchFromWordPressApi(config, source.name);
          } catch (wpError) {
            // Fallback to HTML scraping if WP API fails
            if (config.fallbackMethod === "HTML_SCRAPE" && source.scrapeUrl) {
              console.log(
                `WP API failed for ${source.name}, falling back to HTML scrape`
              );
              return scrapeHtml(source.scrapeUrl, config, source.name);
            }
            throw wpError;
          }

        case "HTML_SCRAPE":
          if (!source.scrapeUrl) {
            throw new Error(`No scrapeUrl configured for ${source.name}`);
          }
          return scrapeHtml(source.scrapeUrl, config, source.name);

        case "MANUAL":
          return []; // Manual sources are managed via admin panel

        default:
          throw new Error(
            `Unknown fetch method: ${source.fetchMethod} for ${source.name}`
          );
      }
    },
  };
}
