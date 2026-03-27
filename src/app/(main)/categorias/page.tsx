import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Categorias",
  description: "Navegue por categorias de notícias do setor de saneamento.",
};

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categoriesData = await prisma.category.findMany({
    include: {
      _count: { select: { articles: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Categorias</h1>
        <p className="mt-1 text-sm text-text-muted">
          Navegue pelas categorias de notícias.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((cat) => (
          <Link
            key={cat.id}
            href={`/noticias?category=${cat.slug}`}
            className="group rounded-xl border border-dark-border bg-dark-card p-6 transition-colors hover:bg-dark-elevated"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: cat.color || "#F97316" }}
              />
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent">
                {cat.name}
              </h3>
            </div>
            {cat.description && (
              <p className="mt-2 text-sm text-text-muted">{cat.description}</p>
            )}
            <p className="mt-3 text-xs text-text-muted">
              {cat._count.articles} notícias
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
