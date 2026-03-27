import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, Tag } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { NewsGrid } from "@/components/news/news-grid";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
    select: { title: true, summary: true },
  });

  if (!article) return { title: "Notícia não encontrada" };

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.newsArticle.findUnique({
    where: { slug },
    include: {
      source: {
        select: { name: true, slug: true, url: true, logoUrl: true },
      },
      category: { select: { name: true, slug: true, color: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) notFound();

  // Increment view count
  await prisma.newsArticle.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  // Related articles
  const relatedArticles = await prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    include: {
      source: { select: { name: true, slug: true, logoUrl: true } },
      category: { select: { name: true, slug: true, color: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/noticias"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para notícias
        </Link>

        <article>
          {/* Category & Source */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${article.category.color || "#F97316"}20`,
                color: article.category.color || "#F97316",
              }}
            >
              {article.category.name}
            </span>
            <span className="text-sm text-text-muted">
              Fonte: <strong className="text-text-secondary">{article.source.name}</strong>
            </span>
            <span className="flex items-center gap-1 text-sm text-text-muted">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text-primary">
            {article.title}
          </h1>

          {/* Image */}
          {article.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-xl border border-dark-border">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Summary */}
          <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
            <p className="text-lg leading-relaxed text-text-secondary">
              {article.summary}
            </p>
          </div>

          {/* CTA - Read Original */}
          <div className="mb-8 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
            <p className="mb-4 text-sm text-text-secondary">
              Esta é uma prévia da notícia. Para ler o conteúdo completo, visite
              a fonte original.
            </p>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Ler artigo completo
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-text-muted">
              Você será redirecionado para {article.source.name}
            </p>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-text-muted" />
              {article.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-lg bg-dark-card border border-dark-border px-3 py-1 text-xs text-text-secondary"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-dark-border pt-8">
            <h2 className="mb-6 text-xl font-bold text-text-primary">
              Notícias Relacionadas
            </h2>
            <NewsGrid articles={relatedArticles} />
          </section>
        )}
      </div>
    </div>
  );
}
