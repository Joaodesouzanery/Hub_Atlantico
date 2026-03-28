import type { RawLicitacao, LicitacaoFetchConfig } from "../types";

const PNCP_BASE_URL = "https://pncp.gov.br/api/consulta";
const FETCH_TIMEOUT = 30_000; // 30 seconds
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGES_PER_MODALIDADE = 3;

/** Modalidade codes to search across */
const MODALIDADE_CODES = [8, 6, 1, 2, 4, 5, 7];
// 8=Dispensa, 6=Pregão Eletrônico, 1=Leilão, 2=Concorrência, 4=Concurso,
// 5=Credenciamento, 7=Chamada Pública

const DEFAULT_SANITATION_KEYWORDS: string[] = [
  // Saneamento core
  "saneamento",
  "água",
  "esgoto",
  "abastecimento",
  "tratamento de água",
  "tratamento de esgoto",
  "drenagem",
  "adutora",
  "reservatório",
  "estação elevatória",
  "rede de distribuição",
  "hidrômetro",
  "tubulação",
  "esgotamento sanitário",
  "eta ",
  "ete ",
  "residuos",
  "coleta de lixo",
  // Engenharia e infraestrutura
  "engenharia civil",
  "obras de saneamento",
  "infraestrutura hídrica",
  "abastecimento de água",
  "sistema de esgoto",
  "rede coletora",
  "captação de água",
  "macrodrenagem",
  "microdrenagem",
  // Unaccented variants for matching
  "agua",
  "esgotamento sanitario",
  "estacao elevatoria",
  "abastecimento de agua",
  "tratamento de esgoto",
  "residuos solidos",
];

/**
 * Fetch licitacoes from PNCP API.
 * Iterates over multiple modalidade codes, fetching up to MAX_PAGES_PER_MODALIDADE pages.
 * Uses a 30-day window on first fetch (when DB might be empty), or 7-day rolling window.
 */
export async function fetchFromPNCP(
  config: LicitacaoFetchConfig,
  sourceName: string,
  isInitialFetch = false
): Promise<RawLicitacao[]> {
  const pageSize = Math.max(config.defaultPageSize || DEFAULT_PAGE_SIZE, 10);
  const keywords = config.keywords || DEFAULT_SANITATION_KEYWORDS;

  // Use 30-day window on initial fetch, 7-day rolling otherwise
  const dayWindow = isInitialFetch ? 30 : 7;
  const { dataInicial, dataFinal } = getDateRange(dayWindow);

  const allResults: RawLicitacao[] = [];

  for (const modalidade of MODALIDADE_CODES) {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages && page <= MAX_PAGES_PER_MODALIDADE) {
      try {
        const url = buildSearchUrl(dataInicial, dataFinal, page, pageSize, modalidade);
        console.log(`[PNCP] Fetching modalidade ${modalidade} p.${page}: ${url}`);

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
          console.error(
            `[PNCP] HTTP ${response.status} for modalidade ${modalidade} p.${page}`
          );
          break;
        }

        const body = await response.json();
        const items = extractItems(body);

        if (!items || items.length === 0) {
          console.log(`[PNCP] No results for modalidade ${modalidade} p.${page}`);
          break;
        }

        const filtered = filterByKeywords(items, keywords);
        const mapped = filtered.map((item) => mapToRawLicitacao(item, sourceName));
        allResults.push(...mapped);

        console.log(
          `[PNCP] Modalidade ${modalidade} p.${page}: ${items.length} total, ${filtered.length} matched`
        );

        // Check if there are more pages
        const paginasRestantes = body?.paginasRestantes ?? 0;
        hasMorePages = paginasRestantes > 0;
        page++;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.error(`[PNCP] Timeout for modalidade ${modalidade} p.${page}`);
        } else {
          console.error(
            `[PNCP] Error for modalidade ${modalidade} p.${page}:`,
            error instanceof Error ? error.message : error
          );
        }
        break;
      }
    }
  }

  console.log(`[PNCP] Total fetched: ${allResults.length} licitacoes`);
  return allResults;
}

function buildSearchUrl(
  dataInicial: string,
  dataFinal: string,
  pagina: number,
  tamanhoPagina: number,
  codigoModalidadeContratacao: number
): string {
  const params = new URLSearchParams({
    dataInicial,
    dataFinal,
    codigoModalidadeContratacao: String(codigoModalidadeContratacao),
    pagina: String(pagina),
    tamanhoPagina: String(tamanhoPagina),
  });
  return `${PNCP_BASE_URL}/v1/contratacoes/publicacao?${params.toString()}`;
}

function getDateRange(days: number): {
  dataInicial: string;
  dataFinal: string;
} {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days);

  return {
    dataInicial: formatDateParam(start),
    dataFinal: formatDateParam(now),
  };
}

/**
 * Format date as YYYYMMDD (no dashes) as required by the PNCP API.
 */
function formatDateParam(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

/**
 * Extract items from PNCP response.
 * The API returns { data: [...], totalRegistros, totalPaginas, numeroPagina, paginasRestantes }.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(body: any): any[] {
  if (body?.data && Array.isArray(body.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

/**
 * Filter items whose objetoCompra matches any of the sanitation keywords.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterByKeywords(items: any[], keywords: string[]): any[] {
  if (keywords.length === 0) return items;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  return items.filter((item) => {
    const text = (item.objetoCompra || "").toLowerCase();
    return lowerKeywords.some((kw) => text.includes(kw));
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRawLicitacao(item: any, sourceName: string): RawLicitacao {
  const title = item.objetoCompra || "Sem titulo";
  const description = item.objetoCompra || "";
  const process = item.processo || undefined;

  const modalidade = item.modalidadeNome || "NAO_INFORMADO";
  const status = mapStatus(item.situacaoCompraNome || "");

  const estimatedValue =
    typeof item.valorTotalEstimado === "number"
      ? item.valorTotalEstimado
      : parseFloat(item.valorTotalEstimado) || undefined;

  const uf = item.unidadeOrgao?.ufSigla || undefined;
  const city = item.unidadeOrgao?.municipioNome || undefined;
  const organ = item.orgaoEntidade?.razaoSocial || undefined;
  const organCnpj = item.orgaoEntidade?.cnpj || undefined;

  const originalUrl = `https://pncp.gov.br/app/editais/${item.numeroControlePNCP || "unknown"}`;

  const editalUrl = item.linkSistemaOrigem || undefined;

  const publishedAt = item.dataPublicacaoPncp
    ? new Date(item.dataPublicacaoPncp)
    : new Date();

  const openDate = item.dataAberturaProposta
    ? new Date(item.dataAberturaProposta)
    : undefined;

  const closeDate = item.dataEncerramentoProposta
    ? new Date(item.dataEncerramentoProposta)
    : undefined;

  return {
    title: title.slice(0, 500),
    description: description.slice(0, 2000),
    process,
    modalidade: normalizeModalidade(modalidade),
    status,
    estimatedValue,
    uf,
    city,
    organ,
    organCnpj,
    originalUrl,
    editalUrl,
    openDate,
    closeDate,
    publishedAt,
    sourceName,
  };
}

/**
 * Map PNCP situacaoCompraNome to our internal status codes.
 */
function mapStatus(situacao: string): string {
  const s = situacao.trim().toLowerCase();

  if (s.includes("divulgada")) return "ABERTA";
  if (s.includes("abert")) return "ABERTA";
  if (s.includes("publicada")) return "ABERTA";
  if (s.includes("homologada")) return "HOMOLOGADA";
  if (s.includes("encerrada")) return "ENCERRADA";
  if (s.includes("suspens")) return "SUSPENSA";
  if (s.includes("anulada")) return "ANULADA";
  if (s.includes("revogada")) return "ANULADA";
  if (s.includes("deserta")) return "DESERTA";
  if (s.includes("fracassada")) return "DESERTA";

  return "ABERTA";
}

function normalizeModalidade(raw: string): string {
  const normalized = raw
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z_]/g, "");
  const mapping: Record<string, string> = {
    PREGAO_ELETRONICO: "PREGAO_ELETRONICO",
    PREGAO: "PREGAO_ELETRONICO",
    CONCORRENCIA: "CONCORRENCIA",
    CONCORRENCIA_ELETRONICA: "CONCORRENCIA",
    TOMADA_DE_PRECO: "TOMADA_PRECO",
    TOMADA_DE_PRECOS: "TOMADA_PRECO",
    TOMADA_PRECO: "TOMADA_PRECO",
    CONVITE: "CONVITE",
    LEILAO: "LEILAO",
    DISPENSA: "DISPENSA",
    DISPENSA_DE_LICITACAO: "DISPENSA",
    INEXIGIBILIDADE: "INEXIGIBILIDADE",
    CONCURSO: "CONCURSO",
    CREDENCIAMENTO: "CREDENCIAMENTO",
    CHAMADA_PUBLICA: "CHAMADA_PUBLICA",
  };
  return mapping[normalized] || normalized || "NAO_INFORMADO";
}
