import { prisma } from "@/lib/db";

// ---------- Licitacoes por UF ----------

export async function getLicitacoesByUF() {
  const results = await prisma.licitacao.groupBy({
    by: ["uf"],
    _count: { id: true },
    where: { uf: { not: null } },
    orderBy: { _count: { id: "desc" } },
  });

  return results.map((r) => ({
    name: r.uf || "N/I",
    value: r._count.id,
  }));
}

// ---------- Licitacoes por Mes ----------

export async function getLicitacoesByMonth() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const licitacoes = await prisma.licitacao.findMany({
    where: { publishedAt: { gte: sixMonthsAgo } },
    select: { publishedAt: true },
    orderBy: { publishedAt: "asc" },
  });

  const monthMap = new Map<string, number>();

  for (const l of licitacoes) {
    const d = new Date(l.publishedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  }

  // Sort chronologically and format labels
  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [year, m] = month.split("-");
      const monthNames = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
      ];
      return {
        name: `${monthNames[parseInt(m) - 1]}/${year.slice(2)}`,
        value: count,
      };
    });
}

// ---------- Licitacoes por Modalidade ----------

export async function getLicitacoesByModalidade() {
  const results = await prisma.licitacao.groupBy({
    by: ["modalidade"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const labelMap: Record<string, string> = {
    PREGAO_ELETRONICO: "Pregao Eletronico",
    CONCORRENCIA: "Concorrencia",
    TOMADA_PRECO: "Tomada de Preco",
    CONVITE: "Convite",
    LEILAO: "Leilao",
    DISPENSA: "Dispensa",
    INEXIGIBILIDADE: "Inexigibilidade",
  };

  return results.map((r) => ({
    name: labelMap[r.modalidade] || r.modalidade,
    value: r._count.id,
  }));
}

// ---------- Licitacoes por Categoria ----------

export async function getLicitacoesByCategory() {
  const results = await prisma.licitacao.groupBy({
    by: ["categoryId"],
    _count: { id: true },
    where: { categoryId: { not: null } },
    orderBy: { _count: { id: "desc" } },
  });

  // Fetch category names
  const categoryIds = results
    .map((r) => r.categoryId)
    .filter(Boolean) as string[];

  const categories = await prisma.licitacaoCategory.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return results.map((r) => ({
    name: categoryMap.get(r.categoryId || "") || "Sem categoria",
    value: r._count.id,
  }));
}
