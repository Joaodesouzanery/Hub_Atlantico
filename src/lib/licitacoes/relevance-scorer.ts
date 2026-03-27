/**
 * Score a licitacao's relevance to the sanitation/water engineering domain.
 * Returns a value between 0 and 100.
 */
export function scoreLicitacaoRelevance(
  title: string,
  description: string
): number {
  const text = `${title} ${description}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove accents for matching

  let rawScore = 0;

  // High priority keywords (3 points each)
  const highPriority = [
    "saneamento",
    "abastecimento de agua",
    "esgotamento sanitario",
    "tratamento de agua",
    "tratamento de esgoto",
    "eta",
    "ete",
    "estacao elevatoria",
  ];

  for (const keyword of highPriority) {
    if (text.includes(keyword)) {
      rawScore += 3;
    }
  }

  // Medium priority keywords (2 points each)
  const mediumPriority = [
    "rede de distribuicao",
    "adutora",
    "reservatorio",
    "bombeamento",
    "tubulacao",
    "hidrometro",
    "drenagem urbana",
  ];

  for (const keyword of mediumPriority) {
    if (text.includes(keyword)) {
      rawScore += 2;
    }
  }

  // Low priority keywords (1 point each)
  const lowPriority = [
    "engenharia",
    "meio ambiente",
    "infraestrutura",
    "consultoria ambiental",
  ];

  for (const keyword of lowPriority) {
    if (text.includes(keyword)) {
      rawScore += 1;
    }
  }

  // Normalize to 0-100 range
  // Maximum theoretical score: 8*3 + 7*2 + 4*1 = 24 + 14 + 4 = 42
  // In practice, hitting all keywords is extremely unlikely.
  // A score of ~12 (e.g. 4 high-priority hits) should be near 100.
  const maxExpectedScore = 12;
  const normalized = Math.min(100, Math.round((rawScore / maxExpectedScore) * 100));

  return normalized;
}
