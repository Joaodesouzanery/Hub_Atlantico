import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (category) {
    where.category = { slug: category };
  }

  if (source) {
    where.source = { slug: source };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { summary: { contains: search } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      include: {
        source: { select: { name: true, slug: true, logoUrl: true } },
        category: { select: { name: true, slug: true, color: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export const dynamic = "force-dynamic";
