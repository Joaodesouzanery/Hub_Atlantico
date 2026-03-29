import { prisma } from "@/lib/db";

export interface DashboardData {
  kpis: {
    totalLicitacoes: number;
    licitacoesAbertas: number;
    valorTotal: number;
    totalNoticias: number;
    fontesAtivas: number;
    totalAgencias: number;
  };
  licitacoesPorUF: { name: string; value: number }[];
  licitacoesPorMes: { name: string; value: number }[];
  licitacoesPorModalidade: { name: string; value: number }[];
  licitacoesPorCategoria: { name: string; value: number; color: string }[];
  proximosPrazos: {
    id: string;
    slug: string;
    title: string;
    organ: string | null;
    uf: string | null;
    closeDate: Date | null;
    status: string;
  }[];
  topOrgaos: { name: string; value: number }[];
  atividadeRecente: {
    id: string;
    type: "licitacao" | "noticia";
    title: string;
    source: string;
    date: Date;
    slug: string;
  }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const defaults: DashboardData = {
    kpis: {
      totalLicitacoes: 0,
      licitacoesAbertas: 0,
      valorTotal: 0,
      totalNoticias: 0,
      fontesAtivas: 0,
      totalAgencias: 0,
    },
    licitacoesPorUF: [],
    licitacoesPorMes: [],
    licitacoesPorModalidade: [],
    licitacoesPorCategoria: [],
    proximosPrazos: [],
    topOrgaos: [],
    atividadeRecente: [],
  };

  try {
    // KPIs
    const [
      totalLicitacoes,
      licitacoesAbertas,
      valorAgg,
      totalNoticias,
      fontesAtivas,
      totalAgencias,
    ] = await Promise.all([
      prisma.licitacao.count(),
      prisma.licitacao.count({ where: { status: "ABERTA" } }),
      prisma.licitacao.aggregate({ _sum: { estimatedValue: true } }),
      prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
      prisma.newsSource.count({ where: { isActive: true } }),
      prisma.regulatoryAgency.count({ where: { isActive: true } }),
    ]);

    defaults.kpis = {
      totalLicitacoes,
      licitacoesAbertas,
      valorTotal: valorAgg._sum.estimatedValue
        ? Number(valorAgg._sum.estimatedValue)
        : 0,
      totalNoticias,
      fontesAtivas,
      totalAgencias,
    };

    // Licitações por UF
    const byUF = await prisma.licitacao.groupBy({
      by: ["uf"],
      _count: { id: true },
      where: { uf: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    });
    defaults.licitacoesPorUF = byUF.map((r) => ({
      name: r.uf || "N/I",
      value: r._count.id,
    }));

    // Licitações por mês (últimos 6 meses) — use count per month instead of fetching all rows
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRaw = await prisma.$queryRawUnsafe<{ month: string; count: bigint }[]>(
      `SELECT to_char(published_at, 'Mon/YY') as month, COUNT(*) as count
       FROM licitacoes
       WHERE published_at >= $1
       GROUP BY to_char(published_at, 'Mon/YY'), date_trunc('month', published_at)
       ORDER BY date_trunc('month', published_at) ASC`,
      sixMonthsAgo
    );
    defaults.licitacoesPorMes = monthlyRaw.map((r) => ({
      name: r.month,
      value: Number(r.count),
    }));

    // Licitações por modalidade
    const byMod = await prisma.licitacao.groupBy({
      by: ["modalidade"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    defaults.licitacoesPorModalidade = byMod.map((r) => ({
      name: r.modalidade,
      value: r._count.id,
    }));

    // Licitações por categoria
    const byCat = await prisma.licitacao.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      where: { categoryId: { not: null } },
    });
    const catIds = byCat.map((r) => r.categoryId).filter(Boolean) as string[];
    const cats = await prisma.licitacaoCategory.findMany({
      where: { id: { in: catIds } },
    });
    const catMap = new Map(cats.map((c) => [c.id, c]));
    defaults.licitacoesPorCategoria = byCat.map((r) => {
      const cat = catMap.get(r.categoryId!);
      return {
        name: cat?.name || "Outros",
        value: r._count.id,
        color: cat?.color || "#6B6B73",
      };
    });

    // Próximos prazos (licitações abertas com closeDate futuro)
    defaults.proximosPrazos = await prisma.licitacao.findMany({
      where: {
        status: "ABERTA",
        closeDate: { gte: new Date() },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        organ: true,
        uf: true,
        closeDate: true,
        status: true,
      },
      orderBy: { closeDate: "asc" },
      take: 8,
    });

    // Top órgãos licitantes
    const byOrgan = await prisma.licitacao.groupBy({
      by: ["organ"],
      _count: { id: true },
      where: { organ: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    });
    defaults.topOrgaos = byOrgan.map((r) => ({
      name: r.organ || "N/I",
      value: r._count.id,
    }));

    // Atividade recente (mix de licitações e notícias)
    const [recentLic, recentNews] = await Promise.all([
      prisma.licitacao.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          source: { select: { name: true } },
        },
        orderBy: { fetchedAt: "desc" },
        take: 5,
      }),
      prisma.newsArticle.findMany({
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          source: { select: { name: true } },
        },
        orderBy: { fetchedAt: "desc" },
        take: 5,
      }),
    ]);

    defaults.atividadeRecente = [
      ...recentLic.map((l) => ({
        id: l.id,
        type: "licitacao" as const,
        title: l.title,
        source: l.source.name,
        date: l.publishedAt,
        slug: l.slug,
      })),
      ...recentNews.map((n) => ({
        id: n.id,
        type: "noticia" as const,
        title: n.title,
        source: n.source.name,
        date: n.publishedAt,
        slug: n.slug,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);
  } catch (error) {
    console.error("Dashboard query error:", error);
  }

  // Serialize to plain JSON to avoid RSC boundary issues with Date/Decimal objects
  return JSON.parse(JSON.stringify(defaults));
}
