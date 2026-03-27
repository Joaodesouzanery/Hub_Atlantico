const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "saneamento-basico": [
    "saneamento", "abastecimento", "água potável", "água tratada",
    "universalização", "marco do saneamento", "plansab",
  ],
  "tratamento-agua": [
    "tratamento de água", "eta", "estação de tratamento",
    "filtração", "desinfecção", "fluoretação", "potabilidade",
    "qualidade da água",
  ],
  "tratamento-esgoto": [
    "esgoto", "ete", "efluente", "lodo", "fossa",
    "coleta de esgoto", "tratamento de esgoto", "esgotamento sanitário",
  ],
  "regulacao-politica": [
    "regulação", "regulatório", "anatel", "ana", "agência reguladora",
    "tarifa", "concessão", "licitação", "edital", "política pública",
    "lei", "decreto", "marco legal",
  ],
  "tecnologia-inovacao": [
    "tecnologia", "inovação", "inteligência artificial", "ia",
    "iot", "sensor", "automação", "digital", "smart",
    "startup", "software",
  ],
  "engenharia": [
    "engenharia", "projeto", "obra", "construção",
    "dimensionamento", "cálculo", "norma técnica",
  ],
  "meio-ambiente": [
    "meio ambiente", "sustentabilidade", "ambiental", "reciclagem",
    "reuso", "recursos hídricos", "bacia hidrográfica",
    "impacto ambiental", "licenciamento",
  ],
  "mercado-negocios": [
    "mercado", "investimento", "privatização", "concessão",
    "ppp", "parceria", "ações", "bolsa", "receita",
    "faturamento", "empresa",
  ],
  "infraestrutura": [
    "infraestrutura", "rede", "adutora", "reservatório",
    "elevatória", "bombeamento", "tubulação", "implantação",
  ],
};

export function categorizeArticle(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();

  let bestCategory = "saneamento-basico"; // default
  let bestScore = 0;

  for (const [categorySlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += keyword.split(" ").length; // multi-word keywords score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = categorySlug;
    }
  }

  return bestCategory;
}
