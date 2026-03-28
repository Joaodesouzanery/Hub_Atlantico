import { prisma } from "@/lib/db";
import {
  newsCategories,
  newsSources,
  licitacaoSources,
  licitacaoCategories,
  legislationCategories,
  legislationItems,
  regulatoryAgencies,
} from "./seed-data";

export interface SeedResult {
  newsCategoriesUpserted: number;
  newsSourcesUpserted: number;
  licitacaoSourcesUpserted: number;
  licitacaoCategoriesUpserted: number;
  legislationCategoriesUpserted: number;
  legislationItemsUpserted: number;
  agenciesUpserted: number;
}

/**
 * Executa o seed completo do banco de dados via upsert.
 * Seguro para rodar múltiplas vezes — nunca duplica dados.
 */
export async function runSeed(): Promise<SeedResult> {
  // 1. Categorias de notícias
  for (const cat of newsCategories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }

  // 2. Fontes de notícias
  for (const source of newsSources) {
    await prisma.newsSource.upsert({ where: { slug: source.slug }, update: source, create: source });
  }

  // 3. Fontes de licitações
  for (const src of licitacaoSources) {
    await prisma.licitacaoSource.upsert({ where: { slug: src.slug }, update: src, create: src });
  }

  // 4. Categorias de licitações
  for (const cat of licitacaoCategories) {
    await prisma.licitacaoCategory.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }

  // 5. Categorias de legislação
  for (const cat of legislationCategories) {
    await prisma.legislationCategory.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }

  // 6. Itens de legislação (dependem das categorias acima)
  const legCats = await prisma.legislationCategory.findMany();
  const legCatMap = new Map(legCats.map((c) => [c.slug, c.id]));

  for (const item of legislationItems) {
    const { legCategorySlug, ...rest } = item;
    const categoryId = legCatMap.get(legCategorySlug) ?? null;
    await prisma.legislation.upsert({
      where: { slug: item.slug },
      update: { ...rest, categoryId },
      create: { ...rest, categoryId },
    });
  }

  // 7. Agências reguladoras
  for (const agency of regulatoryAgencies) {
    await prisma.regulatoryAgency.upsert({ where: { slug: agency.slug }, update: agency, create: agency });
  }

  return {
    newsCategoriesUpserted: newsCategories.length,
    newsSourcesUpserted: newsSources.length,
    licitacaoSourcesUpserted: licitacaoSources.length,
    licitacaoCategoriesUpserted: licitacaoCategories.length,
    legislationCategoriesUpserted: legislationCategories.length,
    legislationItemsUpserted: legislationItems.length,
    agenciesUpserted: regulatoryAgencies.length,
  };
}
