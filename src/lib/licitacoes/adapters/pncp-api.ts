import type { RawLicitacao, LicitacaoFetchConfig } from "../types";

const PNCP_BASE_URL = "https://pncp.gov.br/api/consulta";
const FETCH_TIMEOUT = 30_000; // 30 seconds
const MAX_PAGES = 5;
const DEFAULT_PAGE_SIZE = 50;

/**
 * Fetch licitacoes from PNCP (Portal Nacional de Contratacoes Publicas) API.
 * Searches publications from the last 7 days, filtering by relevant keywords.
 */
export async function fetchFromPNCP(
  config: LicitacaoFetchConfig,
  sourceName: string
): Promise<RawLicitacao[]> {
  const pageSize = config.defaultPageSize || DEFAULT_PAGE_SIZE;
  const keywords = config.keywords || getDefaultKeywords();

  const { dataInicial, dataFinal } = getDateRange(7);

  const allResults: RawLicitacao[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const url = buildSearchUrl(dataInicial, dataFinal, page, pageSize);
      console.log(`[PNCP] Fetching page ${page}: ${url}`);

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
          `[PNCP] HTTP ${response.status} on page ${page}`
        );
        break;
      }

      const data = await response.json();
      const items = extractItems(data);

      if (!items || items.length === 0) {
        console.log(`[PNCP] No more results on page ${page}`);
        break;
      }

      const filtered = filterByKeywords(items, keywords);
      const mapped = filtered.map((item) => mapToRawLicitacao(item, sourceName));
      allResults.push(...mapped);

      console.log(
        `[PNCP] Page ${page}: ${items.length} total, ${filtered.length} matched keywords`
      );

      // If fewer results than page size, no more pages
      if (items.length < pageSize) break;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(`[PNCP] Timeout on page ${page}`);
      } else {
        console.error(
          `[PNCP] Error on page ${page}:`,
          error instanceof Error ? error.message : error
        );
      }
      break;
    }
  }

  console.log(`[PNCP] Total fetched: ${allResults.length} licitacoes`);
  return allResults;
}

function buildSearchUrl(
  dataInicial: string,
  dataFinal: string,
  pagina: number,
  tamanhoPagina: number
): string {
  const params = new URLSearchParams({
    dataInicial,
    dataFinal,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(data: any): any[] {
  // PNCP API may wrap results in different structures
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.resultado && Array.isArray(data.resultado)) return data.resultado;
  if (data?.content && Array.isArray(data.content)) return data.content;
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterByKeywords(items: any[], keywords: string[]): any[] {
  if (keywords.length === 0) return items;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  return items.filter((item) => {
    const text = [
      item.objetoCompra,
      item.descricao,
      item.objeto,
      item.nomeOrgao,
      item.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return lowerKeywords.some((kw) => text.includes(kw));
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRawLicitacao(item: any, sourceName: string): RawLicitacao {
  const title =
    item.objetoCompra || item.objeto || item.title || "Sem titulo";
  const description =
    item.descricao || item.objetoCompra || item.description || "";
  const process =
    item.numeroCompra ||
    item.processo ||
    item.numberProcess ||
    undefined;
  const modalidade =
    item.modalidadeNome ||
    item.modalidade ||
    item.modalidadeId ||
    "NAO_INFORMADO";
  const status =
    item.situacaoCompra ||
    item.statusCompra ||
    item.status ||
    "ABERTA";

  const estimatedValue =
    parseFloat(item.valorEstimado || item.valorTotalEstimado) || undefined;

  const uf = item.uf || item.unidadeFederativa || undefined;
  const city = item.municipio || item.cidade || undefined;
  const organ = item.nomeOrgao || item.orgao || undefined;
  const organCnpj = item.cnpjOrgao || item.cnpj || undefined;

  const originalUrl =
    item.linkSistemaOrigem ||
    item.uri ||
    item.link ||
    `https://pncp.gov.br/app/editais/${item.codigoUnidade || "unknown"}/${item.anoCompra || "0"}/${item.sequencialCompra || "0"}`;

  const editalUrl = item.linkEdital || item.urlEdital || undefined;

  const publishedAt = item.dataPublicacao
    ? new Date(item.dataPublicacao)
    : new Date();

  const openDate = item.dataAbertura
    ? new Date(item.dataAbertura)
    : item.dataInicioVigencia
      ? new Date(item.dataInicioVigencia)
      : undefined;

  const closeDate = item.dataEncerramentoProposta
    ? new Date(item.dataEncerramentoProposta)
    : item.dataFimVigencia
      ? new Date(item.dataFimVigencia)
      : undefined;

  return {
    title: title.slice(0, 500),
    description: description.slice(0, 2000),
    process,
    modalidade: normalizeModalidade(modalidade),
    status: normalizeStatus(status),
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

function normalizeModalidade(raw: string): string {
  const normalized = raw.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z_]/g, "");
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
  };
  return mapping[normalized] || normalized || "NAO_INFORMADO";
}

function normalizeStatus(raw: string): string {
  const normalized = raw.toUpperCase().replace(/\s+/g, "_");
  const mapping: Record<string, string> = {
    ABERTA: "ABERTA",
    ABERTO: "ABERTA",
    PUBLICADA: "ABERTA",
    ENCERRADA: "ENCERRADA",
    ENCERRADO: "ENCERRADA",
    SUSPENSA: "SUSPENSA",
    SUSPENSO: "SUSPENSA",
    ANULADA: "ANULADA",
    ANULADO: "ANULADA",
    HOMOLOGADA: "HOMOLOGADA",
    HOMOLOGADO: "HOMOLOGADA",
    DESERTA: "DESERTA",
    DESERTO: "DESERTA",
    REVOGADA: "ANULADA",
  };
  return mapping[normalized] || "ABERTA";
}

function getDefaultKeywords(): string[] {
  return [
    "saneamento",
    "abastecimento de agua",
    "agua potavel",
    "esgotamento sanitario",
    "tratamento de agua",
    "tratamento de esgoto",
    "estacao de tratamento",
    "eta",
    "ete",
    "estacao elevatoria",
    "rede de distribuicao",
    "adutora",
    "reservatorio",
    "bombeamento",
    "tubulacao",
    "hidrometro",
    "drenagem",
    "engenharia sanitaria",
    "consultoria ambiental",
    "infraestrutura hidrica",
  ];
}
