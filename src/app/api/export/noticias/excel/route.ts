import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateNoticiasExcel } from "@/lib/export/excel-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filter query from search params
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (searchParams.get("category")) {
      where.category = { slug: searchParams.get("category") };
    }
    if (searchParams.get("source")) {
      where.source = { slug: searchParams.get("source") };
    }
    if (searchParams.get("search")) {
      const search = searchParams.get("search")!;
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    const articles = await prisma.newsArticle.findMany({
      where,
      include: {
        source: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 5000,
    });

    const buffer = await generateNoticiasExcel(articles);

    const date = new Date().toISOString().slice(0, 10);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="noticias_${date}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json(
      { error: "Falha ao gerar Excel" },
      { status: 500 }
    );
  }
}
