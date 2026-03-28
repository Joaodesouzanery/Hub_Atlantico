import type { RawLicitacao, LicitacaoFetchConfig } from "../types";

const FETCH_TIMEOUT = 30_000;

// Compras.gov.br open data API (dados.gov.br portal)
const COMPRAS_API_BASE = "https://compras.dados.gov.br/licitacoes/v1";

const SANITATION_KEYWORDS = [
  "saneamento",
  "abastecimento de agua",
  "abastecimento de água",
  "esgotamento sanitario",
  "esgotamento sanitário",
  "tratamento de agua",
  "tratamento de água",
  "drenagem urbana",
  "residuos solidos",
  "resíduos sólidos",
];

/**
 * Fetch licitacoes from Compras.gov.br open data API.
 * Searches by multiple sanitation keywords and aggregates results.
 */
export async function fetchFromComprasGov(
  config: LicitacaoFetchConfig,
  sourceName: string
): Promise<RawLicitacao[]> {
  const keywords = config.keywords?.length ? config.keywords : SANITATION_KEYWORDS;
  const allResults: RawLicitacao[] = [];
  const seenIds = new Set<string>();

  for (const keyword of keywords.slice(0, 5)) { // limit to 5 queries to avoid rate limiting
    try {
      const url = buildUrl(keyword);
      console.log(`[ComprasGov] Searching keyword "${keyword}": ${url}`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "HubAtlantico/1.0",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[ComprasGov] HTTP ${response.status} for keyword "${keyword}"`);
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("json")) {
        console.warn(`[ComprasGov] Non-JSON response for keyword "${keyword}"`);
        continue;
      }

      const data = await response.json();
      const items = extractItems(data);

      for (const item of items) {
        const id = String(item.id || item.numero_licitacao || item.codigo || "");
        if (id && seenIds.has(id)) continue;
        if (id) seenIds.add(id);

        const mapped = mapToRawLicitacao(item, sourceName);
        if (mapped) allResults.push(mapped);
      }

      console.log(`[ComprasGov] "${keyword}": ${items.length} results`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`[ComprasGov] Timeout for keyword "${keyword}"`);
      } else {
        console.warn(`[ComprasGov] Error for keyword "${keyword}":`, error instanceof Error ? error.message : error);
      }
      continue;
    }
  }

  console.log(`[ComprasGov] Total fetched: ${allResults.length} licitacoes`);
  return allResults;
}

function buildUrl(keyword: string): string {
  const params = new URLSearchParams({
    descricao_objeto: keyword,
    formato: "json",
  });
  return `${COMPRAS_API_BASE}/licitacoes.json?${params.toString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data?.licitacoes && Array.isArray(data.licitacoes)) return data.licitacoes;
  if (data?.result && Array.isArray(data.result)) return data.result;
  if (data?.records && Array.isArray(data.records)) return data.records;
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRawLicitacao(item: any, sourceName: string): RawLicitacao | null {
  const title =
    item.objeto_licitacao ||
    item.descricao_objeto ||
    item.objeto ||
    item.title ||
    "";

  if (!title) return null;

  const process =
    item.numero_licitacao ||
    item.numero ||
    item.codigo ||
    undefined;

  const organ =
    item.orgao?.nome ||
    item.unidade_gestora?.nome_unidade ||
    item.nome_orgao ||
    undefined;

  const uf =
    item.orgao?.uf ||
    item.uf ||
    item.estado ||
    undefined;

  const estimatedValue =
    parseFloat(item.valor_estimado || item.valor_licitacao || "0") || undefined;

  const originalUrl =
    item.link ||
    item.url ||
    `https://www.comprasgovernamentais.gov.br`;

  const publishedAt = item.data_abertura
    ? new Date(item.data_abertura)
    : item.data_publicacao
      ? new Date(item.data_publicacao)
      : new Date();

  const closeDate = item.data_encerramento
    ? new Date(item.data_encerramento)
    : undefined;

  return {
    title: String(title).slice(0, 500),
    description: String(title).slice(0, 2000),
    process,
    modalidade: normalizeModalidade(item.modalidade_licitacao || item.modalidade || ""),
    status: mapStatus(item.situacao || item.status || ""),
    estimatedValue,
    uf,
    city: item.municipio || item.cidade || undefined,
    organ,
    organCnpj: item.cnpj || item.orgao?.cnpj || undefined,
    originalUrl,
    editalUrl: item.edital_url || item.link_edital || undefined,
    openDate: item.data_abertura ? new Date(item.data_abertura) : undefined,
    closeDate,
    publishedAt,
    sourceName,
  };
}

function mapStatus(situacao: string): string {
  const s = situacao.toLowerCase().trim();
  if (s.includes("aberta") || s.includes("recebendo")) return "ABERTA";
  if (s.includes("encerrada") || s.includes("finalizada")) return "ENCERRADA";
  if (s.includes("suspensa")) return "SUSPENSA";
  if (s.includes("anulada") || s.includes("revogada")) return "ANULADA";
  if (s.includes("homologada")) return "HOMOLOGADA";
  if (s.includes("deserta") || s.includes("fracassada")) return "DESERTA";
  return "ABERTA";
}

function normalizeModalidade(raw: string): string {
  const s = raw.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z_]/g, "");
  const mapping: Record<string, string> = {
    PREGAO_ELETRONICO: "PREGAO_ELETRONICO",
    PREGAO: "PREGAO_ELETRONICO",
    CONCORRENCIA: "CONCORRENCIA",
    TOMADA_DE_PRECOS: "TOMADA_PRECO",
    CONVITE: "CONVITE",
    LEILAO: "LEILAO",
    DISPENSA: "DISPENSA",
    INEXIGIBILIDADE: "INEXIGIBILIDADE",
    CONCURSO: "CONCURSO",
  };
  return mapping[s] || s || "NAO_INFORMADO";
}
