import { prisma } from "@/lib/db";

interface ParsedCategory {
  slug: string;
  keywords: string[];
}

let cachedCategories: ParsedCategory[] | null = null;

/**
 * Load LicitacaoCategory entries from the database and parse their
 * keywords JSON field. Results are cached for the lifetime of the process.
 */
async function loadCategories(): Promise<ParsedCategory[]> {
  if (cachedCategories) return cachedCategories;

  const dbCategories = await prisma.licitacaoCategory.findMany();

  cachedCategories = dbCategories.map((cat) => {
    let keywords: string[] = [];
    if (cat.keywords) {
      try {
        const parsed = JSON.parse(cat.keywords);
        if (Array.isArray(parsed)) {
          keywords = parsed.map((k: string) => k.toLowerCase());
        }
      } catch {
        console.warn(
          `[LicitacaoCategorizer] Invalid keywords JSON for category "${cat.slug}"`
        );
      }
    }
    return { slug: cat.slug, keywords };
  });

  return cachedCategories;
}

/**
 * Score the given text against each category's keyword list.
 * Returns the slug of the best matching category, or "outros" if none match.
 */
export async function categorizeLicitacao(
  title: string,
  description: string
): Promise<string> {
  const categories = await loadCategories();
  const text = `${title} ${description}`.toLowerCase();

  let bestCategory = "outros";
  let bestScore = 0;

  for (const category of categories) {
    let score = 0;
    for (const keyword of category.keywords) {
      if (text.includes(keyword)) {
        // Multi-word keywords score higher
        score += keyword.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category.slug;
    }
  }

  return bestCategory;
}

/**
 * Clear the cached categories (useful for testing or after DB updates).
 */
export function clearCategoryCache(): void {
  cachedCategories = null;
}
