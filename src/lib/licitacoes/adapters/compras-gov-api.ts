import type { RawLicitacao, LicitacaoFetchConfig } from "../types";

const COMPRAS_GOV_BASE_URL = "https://api.compras.dados.gov.br";
const FETCH_TIMEOUT = 30_000;

/**
 * Fetch licitacoes from Compras.gov.br API (dados abertos).
 *
 * TODO: Implement full integration once the API contract is confirmed.
 * The Compras.gov.br open data API provides procurement data but
 * has different endpoints and response structures that need mapping.
 *
 * Possible endpoints:
 *   - /v1/licitacoes (list licitacoes with filters)
 *   - /v1/orgaos (list organs)
 *
 * For now, this returns an empty array as a stub.
 */
export async function fetchFromComprasGov(
  config: LicitacaoFetchConfig,
  sourceName: string
): Promise<RawLicitacao[]> {
  const endpoint = config.searchEndpoint || "/v1/licitacoes";
  const keywords = config.keywords || [];

  console.log(
    `[ComprasGov] Stub adapter called for "${sourceName}" ` +
      `(endpoint: ${COMPRAS_GOV_BASE_URL}${endpoint}, ` +
      `keywords: ${keywords.length})`
  );

  // TODO: Implement actual API call when ready
  // Example structure for future implementation:
  //
  // const url = `${COMPRAS_GOV_BASE_URL}${endpoint}`;
  // const controller = new AbortController();
  // const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  //
  // const response = await fetch(url, {
  //   signal: controller.signal,
  //   headers: { Accept: "application/json" },
  // });
  // clearTimeout(timeout);
  //
  // const data = await response.json();
  // return data.map((item) => mapToRawLicitacao(item, sourceName));

  // Suppress unused variable warnings for stub
  void FETCH_TIMEOUT;

  return [];
}
