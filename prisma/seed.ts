import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Saneamento Básico",
    slug: "saneamento-basico",
    color: "#0077B6",
    description: "Notícias gerais sobre saneamento básico no Brasil",
    icon: "droplets",
  },
  {
    name: "Tratamento de Água",
    slug: "tratamento-agua",
    color: "#00B4D8",
    description: "Tecnologias e processos de tratamento de água",
    icon: "glass-water",
  },
  {
    name: "Tratamento de Esgoto",
    slug: "tratamento-esgoto",
    color: "#48CAE4",
    description: "Sistemas e tecnologias de tratamento de esgoto",
    icon: "waves",
  },
  {
    name: "Regulação e Política",
    slug: "regulacao-politica",
    color: "#90E0EF",
    description: "Marco regulatório, leis e políticas públicas",
    icon: "landmark",
  },
  {
    name: "Tecnologia e Inovação",
    slug: "tecnologia-inovacao",
    color: "#2E7D32",
    description: "Inovações tecnológicas aplicadas ao setor",
    icon: "cpu",
  },
  {
    name: "Engenharia",
    slug: "engenharia",
    color: "#F9A825",
    description: "Engenharia sanitária, civil e ambiental",
    icon: "hard-hat",
  },
  {
    name: "Meio Ambiente",
    slug: "meio-ambiente",
    color: "#43A047",
    description: "Sustentabilidade e impacto ambiental",
    icon: "leaf",
  },
  {
    name: "Mercado e Negócios",
    slug: "mercado-negocios",
    color: "#EF6C00",
    description: "Concessões, privatizações e mercado do setor",
    icon: "trending-up",
  },
  {
    name: "Infraestrutura",
    slug: "infraestrutura",
    color: "#6D4C41",
    description: "Obras, projetos e infraestrutura de saneamento",
    icon: "building",
  },
];

const sources = [
  {
    name: "Saneamento Básico",
    slug: "saneamento-basico",
    url: "https://www.saneamentobasico.com.br",
    scrapeUrl: "https://www.saneamentobasico.com.br",
    fetchMethod: "WP_API",
    fetchConfig: JSON.stringify({
      wpApiUrl: "https://www.saneamentobasico.com.br/wp-json/wp/v2/posts",
      perPage: 10,
      fallbackMethod: "HTML_SCRAPE",
      articleListSelector: ".jet-listing-grid__item",
      titleSelector: "h2 a, .entry-title a",
      summarySelector: ".entry-content p, .entry-excerpt",
      imageSelector: "img.wp-post-image, .entry-thumbnail img",
      linkSelector: "h2 a, .entry-title a",
    }),
  },
  {
    name: "Instituto Trata Brasil",
    slug: "trata-brasil",
    url: "https://tratabrasil.org.br",
    scrapeUrl: "https://tratabrasil.org.br/blog/",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .post-item, .blog-post",
      titleSelector: "h2 a, h3 a, .entry-title a",
      summarySelector: ".entry-content p, .post-excerpt, .entry-summary",
      imageSelector: "img.wp-post-image, .post-thumbnail img",
      linkSelector: "h2 a, h3 a, .entry-title a",
    }),
  },
  {
    name: "Instituto Água e Saneamento",
    slug: "ias",
    url: "https://www.aguaesaneamento.org.br",
    scrapeUrl: "https://www.aguaesaneamento.org.br/noticias",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item, .post-item",
      titleSelector: "h2 a, h3 a, .titulo a",
      summarySelector: ".resumo, .excerpt, p",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a, .titulo a",
    }),
  },
  {
    name: "Engenharia 360",
    slug: "engenharia360",
    url: "https://engenharia360.com",
    scrapeUrl: "https://engenharia360.com",
    fetchMethod: "WP_API",
    fetchConfig: JSON.stringify({
      wpApiUrl: "https://engenharia360.com/wp-json/wp/v2/posts",
      perPage: 10,
      fallbackMethod: "HTML_SCRAPE",
      articleListSelector: "article, .post-item",
      titleSelector: "h2 a, .entry-title a",
      summarySelector: ".entry-content p, .entry-excerpt",
      imageSelector: "img.wp-post-image",
      linkSelector: "h2 a, .entry-title a",
    }),
  },
  {
    name: "Inovação Tecnológica",
    slug: "inovacao-tecnologica",
    url: "https://www.inovacaotecnologica.com.br",
    feedUrl: "https://www.inovacaotecnologica.com.br/boletim/rss.php",
    fetchMethod: "RSS",
    fetchConfig: null,
  },
  {
    name: "Aegea",
    slug: "aegea",
    url: "https://www.aegea.com.br",
    scrapeUrl: "https://www.aegea.com.br/noticias/",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-card, .post-item",
      titleSelector: "h2 a, h3 a, .titulo a",
      summarySelector: ".resumo, .excerpt, p",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a, a.read-more",
    }),
  },
  {
    name: "Sabesp",
    slug: "sabesp",
    url: "https://www.sabesp.com.br",
    scrapeUrl: "https://www.sabesp.com.br/o-que-fazemos/noticias-e-comunicados",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item, .news-item",
      titleSelector: "h2 a, h3 a, .titulo",
      summarySelector: ".resumo, .descricao, p",
      imageSelector: "img",
      linkSelector: "a",
    }),
  },
  {
    name: "Copasa",
    slug: "copasa",
    url: "https://www.copasa.com.br",
    scrapeUrl: "https://www.copasa.com.br/wps/portal/internet/imprensa/noticias",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item, .news-item",
      titleSelector: "h2 a, h3 a, .titulo",
      summarySelector: ".resumo, p",
      imageSelector: "img",
      linkSelector: "a",
    }),
  },
  {
    name: "Sanepar",
    slug: "sanepar",
    url: "https://site.sanepar.com.br",
    scrapeUrl: "https://site.sanepar.com.br/noticias",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .views-row, .node-noticia",
      titleSelector: "h2 a, h3 a, .field-name-title a",
      summarySelector: ".field-name-body p, .views-field-body",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a",
    }),
  },
  {
    name: "Iguá Saneamento",
    slug: "igua",
    url: "https://www.igua.com.br",
    scrapeUrl: "https://www.igua.com.br/noticias",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item, .post-item",
      titleSelector: "h2 a, h3 a",
      summarySelector: ".resumo, .excerpt, p",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a, a",
    }),
  },
  {
    name: "Caesb",
    slug: "caesb",
    url: "https://www.caesb.df.gov.br",
    scrapeUrl: "https://www.caesb.df.gov.br/noticias",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item",
      titleSelector: "h2 a, h3 a",
      summarySelector: ".resumo, p",
      imageSelector: "img",
      linkSelector: "a",
    }),
  },
  {
    name: "Revista Hydro",
    slug: "revista-hydro",
    url: "https://www.revistashydro.com.br",
    scrapeUrl: "https://www.revistashydro.com.br",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .post-item",
      titleSelector: "h2 a, h3 a, .entry-title a",
      summarySelector: ".entry-content p, .entry-excerpt",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a",
    }),
  },
  {
    name: "ABES",
    slug: "abes",
    url: "https://abes-dn.org.br",
    scrapeUrl: "https://abes-dn.org.br/noticias/",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .noticia-item, .post-item",
      titleSelector: "h2 a, h3 a",
      summarySelector: ".resumo, .excerpt, p",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a",
    }),
  },
  {
    name: "Saneamento Hoje",
    slug: "saneamento-hoje",
    url: "https://saneamentohoje.com.br",
    scrapeUrl: "https://saneamentohoje.com.br",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .post-item",
      titleSelector: "h2 a, h3 a, .entry-title a",
      summarySelector: ".entry-content p, .entry-excerpt",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a",
    }),
  },
  {
    name: "Portal Digital Water",
    slug: "digital-water",
    url: "https://portaldigitalwater.com",
    scrapeUrl: "https://portaldigitalwater.com",
    fetchMethod: "HTML_SCRAPE",
    fetchConfig: JSON.stringify({
      articleListSelector: "article, .post-item",
      titleSelector: "h2 a, h3 a",
      summarySelector: ".excerpt, p",
      imageSelector: "img",
      linkSelector: "h2 a, h3 a",
    }),
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  // Seed sources
  for (const source of sources) {
    await prisma.newsSource.upsert({
      where: { slug: source.slug },
      update: source,
      create: source,
    });
  }
  console.log(`Seeded ${sources.length} news sources`);

  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@hubatlantico.com.br" },
    update: {},
    create: {
      email: "admin@hubatlantico.com.br",
      name: "Administrador",
      role: "ADMIN",
    },
  });
  console.log("Created admin user");

  // ==================== MODULE 2: LICITACOES ====================

  const licitacaoSources = [
    {
      name: "PNCP",
      slug: "pncp",
      baseUrl: "https://pncp.gov.br/api/consulta",
      fetchMethod: "PNCP_API",
      fetchConfig: JSON.stringify({
        searchEndpoint: "/v1/contratacoes/publicacao",
        proposalEndpoint: "/v1/contratacoes/proposta",
        defaultPageSize: 50,
        keywords: ["saneamento", "agua", "esgoto", "tratamento", "abastecimento", "drenagem", "residuos solidos"],
      }),
    },
    {
      name: "Compras.gov.br",
      slug: "compras-gov",
      baseUrl: "https://api.compras.dados.gov.br",
      fetchMethod: "COMPRAS_GOV_API",
      fetchConfig: JSON.stringify({ format: "json" }),
    },
    {
      name: "Licitacoes-e (Banco do Brasil)",
      slug: "licitacoes-e",
      baseUrl: "https://www.licitacoes-e.com.br",
      fetchMethod: "HTML_SCRAPE",
      fetchConfig: JSON.stringify({
        articleListSelector: ".licitacao-item, .resultado-item",
        titleSelector: ".descricao, .objeto",
        linkSelector: "a",
        dateSelector: ".data",
      }),
      isActive: false,
    },
  ];

  for (const src of licitacaoSources) {
    await prisma.licitacaoSource.upsert({
      where: { slug: src.slug },
      update: src,
      create: src,
    });
  }
  console.log(`Seeded ${licitacaoSources.length} licitacao sources`);

  const licitacaoCategorias = [
    { name: "Saneamento e Agua", slug: "saneamento-agua", color: "#0077B6", description: "Sistemas de abastecimento de agua e esgotamento sanitario", keywords: JSON.stringify(["saneamento", "agua", "esgoto", "abastecimento", "eta", "ete"]) },
    { name: "Engenharia Civil", slug: "engenharia-civil", color: "#F9A825", description: "Obras de engenharia e construcao civil", keywords: JSON.stringify(["engenharia", "obra", "construcao", "edificacao", "pavimentacao"]) },
    { name: "Residuos Solidos", slug: "residuos-solidos", color: "#43A047", description: "Coleta, tratamento e disposicao de residuos", keywords: JSON.stringify(["residuo", "lixo", "coleta", "reciclagem", "aterro"]) },
    { name: "Drenagem Urbana", slug: "drenagem-urbana", color: "#00B4D8", description: "Sistemas de drenagem e controle de enchentes", keywords: JSON.stringify(["drenagem", "enchente", "alagamento", "bueiro", "galeria"]) },
    { name: "Equipamentos", slug: "equipamentos", color: "#6D4C41", description: "Aquisicao de equipamentos e materiais", keywords: JSON.stringify(["equipamento", "bomba", "motor", "tubulacao", "valvula", "medidor"]) },
    { name: "Consultoria", slug: "consultoria", color: "#8B5CF6", description: "Servicos de consultoria e projetos", keywords: JSON.stringify(["consultoria", "projeto", "estudo", "diagnostico", "plano"]) },
    { name: "Tecnologia da Informacao", slug: "ti", color: "#2E7D32", description: "Sistemas e servicos de TI", keywords: JSON.stringify(["software", "sistema", "tecnologia", "informatica", "digital"]) },
    { name: "Outros", slug: "outros", color: "#6B6B73", description: "Outras categorias de licitacao", keywords: null },
  ];

  for (const cat of licitacaoCategorias) {
    await prisma.licitacaoCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded ${licitacaoCategorias.length} licitacao categories`);

  // ==================== MODULE 4: LEGISLATION ====================

  const legislationCategories = [
    { name: "Saneamento", slug: "saneamento-leg", color: "#0077B6", icon: "droplets" },
    { name: "Licitacoes", slug: "licitacoes-leg", color: "#F9A825", icon: "gavel" },
    { name: "Seguranca do Trabalho", slug: "seguranca", color: "#EF4444", icon: "shield" },
    { name: "Normas Tecnicas", slug: "normas-tecnicas", color: "#8B5CF6", icon: "file-text" },
    { name: "Regulacao", slug: "regulacao", color: "#22C55E", icon: "landmark" },
  ];

  for (const cat of legislationCategories) {
    await prisma.legislationCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded ${legislationCategories.length} legislation categories`);

  const legCatMap = new Map<string, string>();
  const legCats = await prisma.legislationCategory.findMany();
  for (const c of legCats) legCatMap.set(c.slug, c.id);

  const legislationItems = [
    { slug: "lei-14026-2020", title: "Lei n. 14.026/2020 - Novo Marco Legal do Saneamento Basico", shortTitle: "Marco Legal do Saneamento", description: "Atualiza o marco legal do saneamento basico, estabelecendo metas de universalizacao ate 2033 (99% agua e 90% esgoto). Estimula a regionalizacao e participacao do setor privado.", type: "LEI", number: "14.026/2020", issuingBody: "Presidencia da Republica", documentUrl: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/L14026.htm", publishedAt: new Date("2020-07-15"), effectiveAt: new Date("2020-07-16"), categoryId: legCatMap.get("saneamento-leg") },
    { slug: "lei-14133-2021", title: "Lei n. 14.133/2021 - Nova Lei de Licitacoes e Contratos", shortTitle: "Nova Lei de Licitacoes", description: "Substitui a Lei 8.666/1993. Estabelece normas gerais de licitacao e contratacao para a administracao publica.", type: "LEI", number: "14.133/2021", issuingBody: "Presidencia da Republica", documentUrl: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm", publishedAt: new Date("2021-04-01"), effectiveAt: new Date("2021-04-01"), categoryId: legCatMap.get("licitacoes-leg") },
    { slug: "decreto-12303-2024", title: "Decreto n. 12.303/2024 - Programa Inova", shortTitle: "Programa Inova", description: "Institui o Programa de Governanca e Modernizacao das Empresas Estatais.", type: "DECRETO", number: "12.303/2024", issuingBody: "Presidencia da Republica", documentUrl: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/decreto/D12303.htm", publishedAt: new Date("2024-11-28"), effectiveAt: new Date("2024-11-28"), categoryId: legCatMap.get("saneamento-leg") },
    { slug: "nr-18", title: "NR-18 - Seguranca e Saude no Trabalho na Industria da Construcao", shortTitle: "NR-18", description: "Estabelece diretrizes de seguranca nos processos da industria da construcao.", type: "NORMA_REGULAMENTADORA", number: "18", issuingBody: "Ministerio do Trabalho e Emprego", documentUrl: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/normas-regulamentadoras/nr-18", publishedAt: new Date("1978-06-08"), effectiveAt: new Date("2022-01-01"), categoryId: legCatMap.get("seguranca") },
    { slug: "nbr-12211-2024", title: "NBR 12.211/2024 - Estudos de Concepcao de Sistemas de Abastecimento de Agua", shortTitle: "NBR 12.211", description: "Define condicoes para elaboracao de estudos de concepcao de sistemas publicos de abastecimento de agua.", type: "NBR", number: "12.211/2024", issuingBody: "ABNT", documentUrl: "https://www.abntcatalogo.com.br", publishedAt: new Date("2024-01-15"), categoryId: legCatMap.get("normas-tecnicas") },
    { slug: "resolucao-ana-211-2024", title: "Resolucao ANA n. 211/2024 - Indicadores Operacionais de Agua e Esgoto", shortTitle: "Resolucao ANA 211", description: "Estabelece indicadores operacionais de agua e esgoto para prestadores de servicos de saneamento.", type: "RESOLUCAO", number: "211/2024", issuingBody: "ANA", documentUrl: "https://www.gov.br/ana", publishedAt: new Date("2024-06-15"), categoryId: legCatMap.get("regulacao") },
    { slug: "resolucao-ana-122-2023", title: "Resolucao ANA n. 122/2023 - Norma de Referencia de Regulacao", shortTitle: "Resolucao ANA 122", description: "Estabelece norma de referencia para regulacao tarifaria dos servicos publicos de saneamento basico.", type: "RESOLUCAO", number: "122/2023", issuingBody: "ANA", documentUrl: "https://www.gov.br/ana", publishedAt: new Date("2023-12-01"), categoryId: legCatMap.get("regulacao") },
  ];

  for (const item of legislationItems) {
    await prisma.legislation.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log(`Seeded ${legislationItems.length} legislation items`);

  // ==================== MODULE 5: REGULATORY AGENCIES ====================

  const agencies = [
    { name: "ANA", fullName: "Agencia Nacional de Aguas e Saneamento Basico", slug: "ana", region: "NACIONAL", websiteUrl: "https://www.gov.br/ana", description: "Agencia federal responsavel pela regulacao do uso de recursos hidricos e regulacao de referencia do saneamento basico." },
    { name: "ARSESP", fullName: "Agencia Reguladora de Servicos Publicos do Estado de Sao Paulo", slug: "arsesp", region: "SUDESTE", uf: "SP", websiteUrl: "https://www.arsesp.sp.gov.br" },
    { name: "AGENERSA", fullName: "Agencia Reguladora de Energia e Saneamento Basico do RJ", slug: "agenersa", region: "SUDESTE", uf: "RJ", websiteUrl: "https://www.agenersa.rj.gov.br" },
    { name: "ARSAE", fullName: "Agencia Reguladora de Servicos de Abastecimento de Agua e Esgotamento Sanitario de MG", slug: "arsae", region: "SUDESTE", uf: "MG", websiteUrl: "https://www.arsae.mg.gov.br" },
    { name: "ARSI", fullName: "Agencia Reguladora de Saneamento e Infraestrutura do ES", slug: "arsi", region: "SUDESTE", uf: "ES", websiteUrl: "https://arsi.es.gov.br" },
    { name: "AGEPAR", fullName: "Agencia Reguladora de Servicos Publicos Delegados do Parana", slug: "agepar", region: "SUL", uf: "PR", websiteUrl: "https://www.agepar.pr.gov.br" },
    { name: "AGERGS", fullName: "Agencia Estadual de Regulacao dos Servicos Publicos Delegados do RS", slug: "agergs", region: "SUL", uf: "RS", websiteUrl: "https://www.agergs.rs.gov.br" },
    { name: "ARESC", fullName: "Agencia de Regulacao de Servicos Publicos de Santa Catarina", slug: "aresc", region: "SUL", uf: "SC", websiteUrl: "https://www.aresc.sc.gov.br" },
    { name: "ARCE", fullName: "Agencia Reguladora de Servicos Publicos Delegados do Ceara", slug: "arce", region: "NORDESTE", uf: "CE", websiteUrl: "https://www.arce.ce.gov.br" },
    { name: "ARSAL", fullName: "Agencia Reguladora de Servicos Publicos de Alagoas", slug: "arsal", region: "NORDESTE", uf: "AL", websiteUrl: "https://www.arsal.al.gov.br" },
    { name: "AGESPI", fullName: "Agencia de Regulacao dos Servicos Publicos Delegados do Piaui", slug: "agespi", region: "NORDESTE", uf: "PI", websiteUrl: "https://www.agespi.pi.gov.br" },
    { name: "ATR", fullName: "Agencia Tocantinense de Regulacao", slug: "atr", region: "NORDESTE", uf: "TO", websiteUrl: "https://www.atr.to.gov.br" },
    { name: "ADASA", fullName: "Agencia Reguladora de Aguas, Energia e Saneamento do DF", slug: "adasa", region: "CENTRO_OESTE", uf: "DF", websiteUrl: "https://www.adasa.df.gov.br" },
    { name: "AGR", fullName: "Agencia Goiana de Regulacao", slug: "agr", region: "CENTRO_OESTE", uf: "GO", websiteUrl: "https://www.agr.go.gov.br" },
    { name: "AGER", fullName: "Agencia Estadual de Regulacao dos Servicos Publicos Delegados de MT", slug: "ager", region: "CENTRO_OESTE", uf: "MT", websiteUrl: "https://www.ager.mt.gov.br" },
    { name: "AGEMS", fullName: "Agencia Estadual de Regulacao de Servicos Publicos de MS", slug: "agems", region: "CENTRO_OESTE", uf: "MS", websiteUrl: "https://www.agems.ms.gov.br" },
    { name: "AGEAC", fullName: "Agencia Reguladora dos Servicos Publicos do Acre", slug: "ageac", region: "NORTE", uf: "AC", websiteUrl: "https://www.ageac.ac.gov.br" },
    { name: "ARCON", fullName: "Agencia de Regulacao e Controle de Servicos Publicos do Para", slug: "arcon", region: "NORTE", uf: "PA", websiteUrl: "https://www.arcon.pa.gov.br" },
    { name: "ARSEP", fullName: "Agencia Reguladora de Servicos Publicos do Rio Grande do Norte", slug: "arsep-rn", region: "NORTE", uf: "RN", websiteUrl: "https://www.arsep.rn.gov.br" },
    { name: "ARES-PCJ", fullName: "Agencia Reguladora dos Servicos de Saneamento das Bacias PCJ", slug: "ares-pcj", region: "INTERMUNICIPAL", websiteUrl: "https://www.arespcj.com.br", description: "Regula centenas de municipios nas bacias dos rios Piracicaba, Capivari e Jundiai." },
    { name: "ARIS-SC", fullName: "Agencia Reguladora Intermunicipal de Saneamento de SC", slug: "aris-sc", region: "INTERMUNICIPAL", websiteUrl: "https://www.aris.sc.gov.br", description: "Agencia intermunicipal que regula servicos de saneamento em Santa Catarina." },
  ];

  for (const agency of agencies) {
    await prisma.regulatoryAgency.upsert({
      where: { slug: agency.slug },
      update: agency,
      create: agency,
    });
  }
  console.log(`Seeded ${agencies.length} regulatory agencies`);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
