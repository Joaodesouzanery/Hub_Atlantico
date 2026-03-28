import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const status = searchParams.get("status");
  const uf = searchParams.get("uf");
  const modalidade = searchParams.get("modalidade");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (uf) {
    where.uf = uf;
  }

  if (modalidade) {
    where.modalidade = modalidade;
  }

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { organ: { contains: search } },
      { process: { contains: search } },
    ];
  }

  try {
    const [licitacoes, total] = await Promise.all([
      prisma.licitacao.findMany({
        where,
        include: {
          source: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true, color: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.licitacao.count({ where }),
    ]);

    return NextResponse.json({
      licitacoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch licitacoes" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
