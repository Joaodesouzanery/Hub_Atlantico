import type { LicitacaoSource } from "@prisma/client";
import type {
  RawLicitacao,
  LicitacaoFetchConfig,
  LicitacaoSourceAdapter,
} from "../types";
import { fetchFromPNCP } from "../adapters/pncp-api";
import { fetchFromComprasGov } from "../adapters/compras-gov-api";
import { fetchFromBECSP } from "../adapters/bec-sp-scraper";

/**
 * Generic adapter that dynamically selects fetch method
 * based on the source configuration stored in the database.
 */
export function createLicitacaoAdapter(
  source: LicitacaoSource
): LicitacaoSourceAdapter {
  const config: LicitacaoFetchConfig = source.fetchConfig
    ? JSON.parse(source.fetchConfig)
    : {};

  return {
    sourceSlug: source.slug,
    sourceName: source.name,

    async fetch(): Promise<RawLicitacao[]> {
      switch (source.fetchMethod) {
        case "PNCP_API":
          return fetchFromPNCP(config, source.name, !source.lastFetchAt);

        case "COMPRAS_GOV_API":
          return fetchFromComprasGov(config, source.name);

        case "BEC_SP_SCRAPE":
          return fetchFromBECSP(config, source.name);

        case "HTML_SCRAPE":
          console.log(
            `[${source.name}] HTML_SCRAPE not yet implemented for licitacoes`
          );
          return [];

        default:
          throw new Error(
            `Unknown fetch method: ${source.fetchMethod} for ${source.name}`
          );
      }
    },
  };
}
